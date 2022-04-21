/*
Data retrieval and manipulation for the Users table. 

Author: Liam Turcotte
*/

const data = require('./init.js'); 


function insertUser(username, email, name) {
    // Insert a single user 
    data.db.run('INSERT INTO Users(username, email, name) VALUES(?, ?, ?)', [username, email, name], (error) => {
        if (error) {
            console.error('Error inserting a User into the database (insertUser): ', error); 
            return -1; 
        } 
    }); 
}


function getUser(username, send) {
    // Retrieve the data for a single user 
    data.db.get('SELECT * FROM Users WHERE username = ?', username, (error, user) => {
        if (!error) {
            send(user); 
        } else {
            console.error('Error querying the database (getUser): ', error);
        }
    }); 
}


function getAllUsers(send) {
    // Fetch all users in the database. 
    data.db.all('SELECT * FROM Users', (error, users) => {
        if (!error) {
            send(users); 
        } else {
            console.error('Error querying the database (getAllUsers): ', error);
        }
    }); 
}


module.exports.insertUser = insertUser; 
module.exports.getUser = getUser; 
module.exports.getAllUsers = getAllUsers; 
