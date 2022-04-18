/*
Data retrieval and manipulation for the Locations table. 

Author: Liam Turcotte
*/

const data = require('./init.js'); 


function insertLocations(locations) {
    // Insert all locations within the locations array 
    for (const location of locations) {
        data.db.run(
            `INSERT INTO Locations(longitude, latitude, k_lvl, n_lvl, p_lvl, ph, temperature, humidity, rainfall, 
                recommended_crop, name) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [location.longitude, location.latitude, location.K, location.N, location.P, location.ph, 
                location.temperature, location.humidity, location.rainfall, location.label, null], 
            (error) => {
                if (error) {
                    console.error('Error inserting a Location into the database (insertLocations): ', error);  
                } 
            }
        ); 
    }
}


function getAllLocations(send) {
    // Get all locations in the database 
    data.db.all('SELECT * FROM Locations', (error, locations) => {
        if (!error) {
            send(locations); 
        } else {
            console.error('Error querying the database (getAllLocations): ', error);
        }
    }); 
}


module.exports.insertLocations = insertLocations; 
module.exports.getAllLocations = getAllLocations; 
