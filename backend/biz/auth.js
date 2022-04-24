/*
Business layer logic for auth-related endpoints. 

Author: Liam Turcotte
*/

const crypto = require('crypto');

const dbUsers = require('../model/users.js');
const dbAuth = require('../model/auth.js'); 


function computePwHash(pw, salt, iterations, hashLength, algo, send) {
    // computes hash for pw entered 
    crypto.pbkdf2(pw, salt, iterations, hashLength, algo, (error, hashedPw) => {
        if (error) {
            console.error('Issue hashing password: ', error); 
            send(null); 
        } else {
            send(hashedPw.toString('hex'));
        }
    });
}


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
                return; 
            } 

            // compute hash to see if it matches user input 
            computePwHash(hashedPw, authData.salt, authData.iterations, authData.hash_length, authData.algorithm, 
                function(fullyHashedPw) {
                    if (fullyHashedPw == null) {
                        sendResponse(500, "Issue computing hash", null); 
                    } else if (fullyHashedPw != authData.hashed_pw) {
                        sendResponse(401, "Incorrect password entered.", null); 
                    } else {
                        sendResponse(200, "Login successful.", username); 
                    }
                }
            );
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


function register(fields, hashArgs, saltLength, sendResponse) {
    // first check if user already exists 
    dbUsers.getUser(fields.username, function(user) {
        if (user != null) {
            sendResponse(403, "Username already in use.", null); 
            return; 
        } 

        if (fields.email == null || fields.name == null || fields.hashedPw == null) {
            sendResponse(401, "Missing query params.", null); 
            return;
        }

        // put username, email, name in users table 
        if (dbUsers.insertUser(fields.username, fields.email, fields.name) == -1) {
            sendResponse(500, "Issue during the registration process.", null); 
            return; 
        } 

        // Generate new salt and hash the password 
        hashArgs['salt'] = generateSalt(saltLength);
        computePwHash(fields.hashedPw, hashArgs.salt, hashArgs.iterations, hashArgs.hash_length, hashArgs.algorithm, 
            function(fullyHashedPw) {
                if (fullyHashedPw == null) {
                    sendResponse(500, "Issue computing hash", null); 
                } else {
                    // put username, hashed pw, hash args, salt in Auth table
                    if (dbAuth.insertSingleAuth(fields.username, fullyHashedPw, hashArgs.salt, hashArgs.iterations, 
                            hashArgs.hash_length, hashArgs.algorithm) == -1) {
                        sendResponse(500, "Issue during the registration process.", null); 
                    } else {
                        sendResponse(201, "User successfully created", fields.username);
                    }
                }
            }
        );
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
