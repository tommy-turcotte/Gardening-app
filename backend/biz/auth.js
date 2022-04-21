/*
Business layer logic for auth-related endpoints. 

Author: Liam Turcotte
*/

const crypto = require('crypto');

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


function generateSalt(saltLength) {
    // generate salt 
    return crypto.randomBytes(saltLength).toString('base64');
}


function sendAuthArgs(hashArgs, saltLength, sendResponse) {
    // send auth arguments (iterations, hash length, algorithm, salt)
    hashArgs['salt'] = generateSalt(saltLength); 
    sendResponse(200, hashArgs); 
}


function register(fields, sendResponse) {
    // first check if user already exists 
    dbUsers.getUser(fields.username, function(user) {
        if (user != null) {
            sendResponse(403, "Username already in use.", null); 
            return; 
        } 

        // put username, email, name in users table 
        if (dbUsers.insertUser(fields.username, fields.email, fields.name) == -1) {
            sendResponse(500, "Issue during the registration process.", null); 
            return; 
        } 

        // put username, hashed pw, hash args, salt in Auth table
        if (dbAuth.insertSingleAuth(fields.username, fields.hashed_pw, fields.salt, fields.iterations, 
                fields.hash_length, fields.algorithm) == -1) {
            sendResponse(500, "Issue during the registration process.", null); 
            return;
        }
        
        sendResponse(201, "User successfully created", fields.username); 
    });
}


function logout(isLoggedIn, sendResponse) {
    // handles response for logout 
    if (!isLoggedIn) {
        sendResponse(403, "No user currently logged in."); 
    } else {
        sendResponse(200, "Successfully logged out."); 
    }
}


module.exports.sendAuthenticatedUser = sendAuthenticatedUser; 
module.exports.sendAuthInfo = sendAuthInfo; 
module.exports.login = login; 
module.exports.sendAuthArgs = sendAuthArgs; 
module.exports.register = register; 
module.exports.logout = logout; 
