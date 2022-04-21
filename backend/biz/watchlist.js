/*
Business layer logic for watchlist-related endpoints. 

Author: Liam Turcotte
*/

const dbLocations = require('../model/locations.js');
const locationBiz = require('./locations.js'); 
const dbWatchlist = require('../model/watchlist.js'); 


function fieldCheck(fields) {
    // ensure all location fields are present 
    for (const field of locationBiz.fields) {
        if (!(field in fields)) {
            if (field == 'name') {
                fields['name'] = null; 
            } else if (field != 'recommended_crop') {
                return false; 
            }
        } 
    }

    // if user wants to add location to watch list but no username, reject 
    if ((parseInt(fields.addToWatchList) == 1) && !('username' in fields)) {
        return false; 
    }

    return true; 
}


function calculateRecCrop(classifier_, loc) {
    // Calculates recommended crop for a certain location
    // Differs from the biz/locations function with the same name by not querying the db and returning a response 
    let attrs = [loc.k_lvl, loc.n_lvl, loc.p_lvl, loc.ph, loc.temperature, loc.humidity, loc.rainfall].map(
        val => parseFloat(val)
    );
    let rec = null; 

    try {
        rec = classifier_.predict(attrs);
    } catch (error) {
        console.error('Issue computing crop recommendation: ', error); 
    } finally {
        return rec; 
    }
}


function addLocation(isLoggedIn, userLoggedIn, classifier_, fields, sendResponse) {
    // Adds a new location to the database and to this user's watchlist (if selected) 
    if (!isLoggedIn) {
        sendResponse(401, "Not authenticated; cannot perform operation."); 
        return; 
    } 

    fields['username'] = userLoggedIn; 
    if (!fieldCheck(fields)) {
        sendResponse(400, "Missing location and/or user data.");
    } else {
        // first check if location already exists 
        dbLocations.getLocation(fields.longitude, fields.latitude, function(location) {
            if (location != null) {
                sendResponse(403, "Location already exists."); 
                return; 
            } 

            // compute recommended crop for this location 
            if (classifier_ == null) {
                sendResponse(403, "Crop recommendation model is not initialized.");
                return; 
            }

            let recCrop = calculateRecCrop(classifier_, fields);
            if (recCrop == null) {
                sendResponse(500, "Issue computing recommended crop for this location.");
                return; 
            } else {
                fields['recommended_crop'] = recCrop; 
            }

            // put new location in Locations table 
            if (dbLocations.insertLocation(fields) == -1) {
                sendResponse(500, "Issue adding location to db.");
                return; 
            }

            // add location to watchlist if requested by the user 
            if (parseInt(fields.addToWatchList) == 1) {
                if (dbWatchlist.insertWatcher(fields) == -1) {
                    sendResponse(500, "Issue adding watcher to db.");
                    return;
                }
            }

            sendResponse(201, "Operation successful.");
        }); 
    }
}


function addWatcher(isLoggedIn, userLoggedIn, dbFilled, fields, sendResponse) {
    // Adds an existing location to a user's watchlist
    if (!isLoggedIn) {
        sendResponse(401, "Not authenticated; cannot perform operation."); 
    } else if (!dbFilled) {
        sendResponse(403, "No location data."); 
    } else {
        // first check if location already exists 
        dbLocations.getLocation(fields.longitude, fields.latitude, function(location) {
            if (location == null) {
                sendResponse(403, "Location does not exist."); 
                return; 
            } 

            // insert watcher into the db 
            watchFields = {
                'username': userLoggedIn,
                'longitude': fields.longitude,
                'latitude': fields.latitude
            }; 

            if (dbWatchlist.insertWatcher(watchFields) == -1) {
                sendResponse(500, "Issue adding watcher to db.");
                return;
            }

            sendResponse(201, "Operation successful.");
        }); 
    }
}


function fetchWatchedLocations(isLoggedIn, userLoggedIn, dbFilled, sendResponse) {
    // Retrieve all watched locations for this user 
    if (!isLoggedIn) {
        sendResponse(401, "Not authenticated; cannot perform operation."); 
    } else if (!dbFilled) {
        sendResponse(403, "No location data."); 
    } else {
        dbWatchlist.fetchWatchedLocations(userLoggedIn, function(locations) {
            if (locations.length == 0) {
                sendResponse(403, "No watcher data."); 
            } else {
                sendResponse(200, locations); 
            }
        }); 
    }
}


function fetchAttrData(isLoggedIn, userLoggedIn, dbFilled, attr, sendResponse) {
    // Calculate aggregate data for a certain location attribute in this user's watchlist
    if (!isLoggedIn) {
        sendResponse(401, "Not authenticated; cannot perform operation."); 
    } else if (!dbFilled) {
        sendResponse(403, "No location data."); 
    } else if (attr == null) {
        sendResponse(401, "No attribute passsed.");
    } else {
        dbWatchlist.fetchWatchedAttr(userLoggedIn, attr, function(data) {
            if (data == null) {
                sendResponse(403, "No data for this attribute."); 
            } else {
                sendResponse(200, data); 
            }
        });
    }
}


module.exports.addLocation = addLocation; 
module.exports.addWatcher = addWatcher; 
module.exports.fetchWatchedLocations = fetchWatchedLocations; 
module.exports.fetchAttrData = fetchAttrData; 
