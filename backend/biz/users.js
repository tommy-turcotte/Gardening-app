/*
Business layer logic for user-related endpoints. 

Author: Liam Turcotte
*/

const dbUsers = require('../model/users.js');


function getAllUsers(isLoggedIn, dbFilled, sendResponse) {
    // fetch all users in the db 
    if (!isLoggedIn) {
        sendResponse(401, "Not authenticated; cannot perform operation."); 
    } else if (!dbFilled) {
        sendResponse(403, "No user data."); 
    } else {
        dbUsers.getAllUsers(function(users) {
            if (users.length == 0) {
                sendResponse(403, "No user data."); 
            } else {
                sendResponse(200, users); 
            }
        }); 
    }
}


module.exports.getAllUsers = getAllUsers; 
