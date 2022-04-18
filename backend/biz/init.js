/*
Business layer logic for database initialization procedures. 

Author: Liam Turcotte
*/

const dbInit = require('../model/init.js'); 


function initializeDatabase(dbInitialized, sendResponse) {
    // Construct all the tables in the db 
    if (!dbInitialized) {
        dbInit.initializeDB(); 
        sendResponse(200, "Database initialized.");
    } else {
        sendResponse(403, "Database is already initialized.");
    }
}


function fillDatabase(dbInitialized, dbFilled, sendResponse) {
    // Fill the database with a couple of Users and many Locations 
    if (!dbInitialized) {
        sendResponse(403, "Please initialize the database before filling it."); 
    } else if (!dbFilled) {
        dbInit.fillDB(); 
        sendResponse(200, "Database filled."); 
    } else {
        sendResponse(403, "Database is already filled."); 
    }
}


function clearDatabase(isLoggedIn, dbInitialized, sendResponse) {
    // Delete all records from the database but keep all the tables 
    if (!isLoggedIn) {
        sendResponse(401, "Must be logged in to clear the DB.");
    } else if (dbInitialized) {
        dbInit.clearDB();
        sendResponse(200, "Cleared the database.");
    } else {
        sendResponse(403, "Database is already cleared."); 
    }
}


function emptyDatabase(isLoggedIn, dbInitialized, sendResponse) {
    // Delete all the tables and corresponding data from the db 
    if (!isLoggedIn) {
        sendResponse(401, "Must be logged in to empty the DB."); 
    } else if (dbInitialized) {
        dbInit.emptyDB();
        sendResponse(200, "Emptied the database.");
    } else {
        sendResponse(403, "Database is already empty.");
    }
}


module.exports.initializeDatabase = initializeDatabase; 
module.exports.fillDatabase = fillDatabase; 
module.exports.clearDatabase = clearDatabase; 
module.exports.emptyDatabase = emptyDatabase; 
