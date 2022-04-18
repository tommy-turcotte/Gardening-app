/*
Business layer logic for location-related endpoints. 

Author: Liam Turcotte
*/

const dbLocations = require('../model/locations.js');


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


module.exports.getAllLocations = getAllLocations; 
