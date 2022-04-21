/*
Business layer logic for location-related endpoints. 

Author: Liam Turcotte
*/

const KNN = require('ml-knn'); 

const dbLocations = require('../model/locations.js');

const fields = new Set(
    [
        "longitude",
        "latitude",
        "k_lvl",
        "n_lvl",
        "p_lvl",
        "ph",
        "temperature",
        "humidity",
        "rainfall",
        "recommended_crop",
        "name"
    ]
);


function getAllLocations(isLoggedIn, dbFilled, sendResponse) {
    // fetch all locations in the db 
    if (!isLoggedIn) {
        sendResponse(401, "Not authenticated; cannot perform operation."); 
    } else if (!dbFilled) {
        sendResponse(403, "No location data."); 
    } else {
        dbLocations.getAllLocations(function(locations) {
            if (locations.length == 0) {
                sendResponse(403, "No location data."); 
            } else {
                sendResponse(200, locations); 
            }
        }); 
    }
}


function buildCropRecModel(dbFilled, sendResponse) {
    // build crop recommendation model using all locations currently in the database
    // uses the K nearest neighbors machine learning/data mining algorithm 
    getAllLocations(true, dbFilled, function(statusCode, respBody) {
        if (respBody == null) {
            sendResponse(404, "Location not found.");
        } else if (statusCode != 200) {
            sendResponse(statusCode, respBody, null);
        } else {
            // get attributes and labels 
            let trainingX = respBody.map(loc => 
                [loc.k_lvl, loc.n_lvl, loc.p_lvl, loc.ph, loc.temperature, loc.humidity, loc.rainfall]
            ); 
            let trainingY = respBody.map(loc => loc.recommended_crop); 
            
            try {
                // Return trained k-NN (23-NN) model 
                // chose 23 since the dataset contains 2200 instances and sqrt(2200)/2 ~= 23.45
                // 23 is better than 24 because it is an odd number, so there's no chance of a conflict when it comes 
                // to a majority vote 
                const classifier_ = new KNN(trainingX, trainingY, { k: 23 });
                sendResponse(200, "Classifier successfully created", classifier_); 
            } catch (error) {
                sendResponse(500, `Issue creating the classifier: ${error}`, null); 
            }
        }
    }); 
}


function calculateRecommendedCrop(dbFilled, classifier_, longitude, latitude, sendResponse) {
    // Uses the classifier to compute the recommended crop for this location and returns it 
    if (!dbFilled) {
        sendResponse(403, "No location data."); 
    } else if (classifier_ == null) {
        sendResponse(403, "Crop recommendation model is not initialized."); 
    } else if (longitude == null || latitude == null) {
        sendResponse(400, "Longitude and/or latitude query parameters are missing."); 
    } else {
        dbLocations.getLocation(longitude, latitude, function(loc) {
            if (loc == null) {
                sendResponse(404, "Location not found.");
            } else {
                let attrs = [loc.k_lvl, loc.n_lvl, loc.p_lvl, loc.ph, loc.temperature, loc.humidity, loc.rainfall]; 

                try {
                    let newRec = classifier_.predict(attrs);
                    sendResponse(200, newRec);
                } catch (error) {
                    sendResponse(500, `Issue computing crop recommendation: ${error}`, null);
                }
            }
        }); 
    }
}


function getField(dbFilled, longitude, latitude, field, sendResponse) {
    // retrieve the value for a certain attribute (field) for a particular location
    if (!dbFilled) {
        sendResponse(403, "No location data."); 
    } else if (!fields.has(field)) {
        sendResponse(400, "Field entered is not a location attribute.");
    } else if (longitude == null || latitude == null) {
        sendResponse(400, "Longitude and/or latitude query parameters are missing."); 
    } else {
        dbLocations.getField(longitude, latitude, field, function(val) {
            if (val != null) {
                sendResponse(200, val); 
            } else {
                sendResponse(404, "Location not found."); 
            }
        }); 
    }
}


module.exports.getAllLocations = getAllLocations; 
module.exports.buildCropRecModel = buildCropRecModel; 
module.exports.calculateRecommendedCrop = calculateRecommendedCrop; 
module.exports.getField = getField; 
module.exports.fields = fields; 
