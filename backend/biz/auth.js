/*
Business layer logic for auth-related endpoints. 

Author: Liam Turcotte
*/

const dbUsers = require('../model/users.js');
const dbAuth = require('../model/auth.js'); 


function sendAuthenticatedUser(isLoggedIn, userLoggedIn, sendResponse) {
    // fetch data of the currently authenticated user. 
    if (isLoggedIn && (userLoggedIn != null)) {
        dbUsers.getUser(userLoggedIn, function(user) {
            sendResponse(200, user); 
        }); 
    } else {
        sendResponse(404, "No user currently logged in."); 
    }
}


function sendAuthInfo(username, sendResponse) {
    // send auth info to be able to generate a hashed password 
    dbAuth.retrieveSingleAuthArgs(username, function(authData) {
        if (authData == null) {
            sendResponse(401, `This username is not associated to any account.`); 
        } else {
            sendResponse(200, authData); 
        }
    }); 
}


function login(isLoggedIn, userLoggedIn, username, hashedPw, sendResponse) {
    // Attempt to login using auth info passed in 
    if (isLoggedIn || (userLoggedIn != null)) {
        sendResponse(403, "User already logged in.", null); 
    } else {
        dbAuth.retrieveSingleAuth(username, function(authData) {
            if (authData == null) {
                sendResponse(401, `This username is not associated to any account.`, null); 
            } else if (authData.hashed_pw != hashedPw) {
                sendResponse(401, "Incorrect password entered.", null); 
            } else {
                sendResponse(200, "Login successful.", username); 
            }
        }); 
    }
}


module.exports.sendAuthenticatedUser = sendAuthenticatedUser; 
module.exports.sendAuthInfo = sendAuthInfo; 
module.exports.login = login; 
