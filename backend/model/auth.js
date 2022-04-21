/*
Data retrieval and manipulation for the Auth table. 

Author: Liam Turcotte
*/

const data = require('./init.js'); 


function insertSingleAuth(username, hashedPw, salt, iterations, hashLength, algorithm) {
    // Insert auth info for a single user  
    data.db.run(
        `INSERT INTO Auth(username, hashed_pw, salt, iterations, hash_length, algorithm) VALUES(?, ?, ?, ?, ?, ?)`, 
        [username, hashedPw, salt, iterations, hashLength, algorithm], 
        (error) => {
            if (error) {
                console.error('Error inserting auth info into the database (insertSingleAuth): ', error); 
                return -1; 
            } 
        }
    ); 
}


function retrieveSingleAuth(username, send) {
    // Retrieve the auth data for a single user 
    data.db.get('SELECT * FROM Auth WHERE username = ?', username, (error, authData) => {
        if (!error) {
            send(authData); 
        } else {
            console.error('Error querying the database (retrieveSingleAuth): ', error);
        }
    }); 
}


function retrieveSingleAuthArgs(username, send) {
    // Retrieve salt, iterations, hash length, and algorithm for a single user 
    data.db.get('SELECT salt, iterations, hash_length, algorithm FROM Auth WHERE username = ?', username, 
        (error, authData) => {
            if (!error) {
                send(authData); 
            } else {
                console.error('Error querying the database (retrieveSingleAuthArgs): ', error);
            }
        }
    ); 
}


function getAllAuthInfo(send) {
    // Fetch all auth info in the database 
    data.db.all('SELECT * FROM Auth', (error, authData) => {
        if (!error) {
            send(authData); 
        } else {
            console.error('Error querying the database (getAllAuthInfo): ', error);
        }
    }); 
}


module.exports.insertSingleAuth = insertSingleAuth; 
module.exports.retrieveSingleAuth = retrieveSingleAuth; 
module.exports.getAllAuthInfo = getAllAuthInfo; 
module.exports.retrieveSingleAuthArgs = retrieveSingleAuthArgs; 
