/*
Business layer logic for yield-related endpoints. 

Author: Liam Turcotte
*/

const dbYields = require('../model/yields.js'); 
const dbCrops = require('../model/crops.js'); 


function fetchLocationYields(isLoggedIn, dbFilled, fields, sendResponse) {
    // Retrieve all crop/yield combinations for this location 
    if (!isLoggedIn) {
        sendResponse(401, "Not authenticated; cannot perform operation."); 
    } else if (!dbFilled) {
        sendResponse(403, "No data."); 
    } else {
        dbYields.fetchYields(fields, function(yields) {
            if (yields.length == 0) {
                sendResponse(403, "No yield data."); 
            } else {
                sendResponse(200, yields); 
            }
        }); 
    }
}


function fetchLocationCropYield(isLoggedIn, dbFilled, fields, sendResponse) {
    // Retrieve yield value for a certain crop at this location 
    if (!isLoggedIn) {
        sendResponse(401, "Not authenticated; cannot perform operation."); 
    } else if (!dbFilled) {
        sendResponse(403, "No data."); 
    } else if (fields.crop == null) {
        sendResponse(401, "No crop passsed.");
    } else {
        dbYields.fetchYield(fields, function(yield) {
            if (yield == null) {
                sendResponse(403, "No yield data."); 
            } else {
                sendResponse(200, yield); 
            }
        }); 
    }
}


function addCropYield(isLoggedIn, dbFilled, fields, sendResponse) {
    // Add a crop + yield entry for a this location
    if (!isLoggedIn) {
        sendResponse(401, "Not authenticated; cannot perform operation."); 
    } else if (!dbFilled) {
        sendResponse(403, "No data."); 
    } else if (fields.crop == null || fields.yield == null) {
        sendResponse(401, "No crop and/or yield passsed.");
    } else {
        // fetch threshold values 
        dbCrops.fetchThresholds(fields.crop, function(thresholds) {
            if (thresholds == null) {
                sendResponse(403, "No thresholds for this crop."); 
                return; 
            } 

            // compute yield label from threshold, insert record 
            fields['label'] = dbYields.calculateYieldLabel(thresholds, fields.yield); 
            if (dbYields.insertYield(fields) == -1) {
                sendResponse(500, "Issue inserting crop/yield combo to db.");
                return;
            }

            sendResponse(201, "Operation successful.");
        }); 
    }
}


module.exports.fetchLocationYields = fetchLocationYields; 
module.exports.fetchLocationCropYield = fetchLocationCropYield; 
module.exports.addCropYield = addCropYield; 
