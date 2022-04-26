/*
Data retrieval and manipulation for the Crops table. 

Author: Liam Turcotte
*/

const data = require('./init.js');


function insertCrop(fields) {
    // Insert a single crop entry 
    data.db.run(
        `INSERT INTO Crops(name, threshold_1, threshold_2, threshold_3, threshold_4) VALUES(?, ?, ?, ?, ?)`, 
        [fields.name, fields.threshold_1, fields.threshold_2, fields.threshold_3, fields.threshold_4],  
        (error) => {
            if (error) {
                console.error('Error inserting a crop into the database (insertCrop): ', error); 
                return -1; 
            } 
        }
    ); 
}


function fetchThresholds(crop, send) {
    data.db.get(`SELECT threshold_1, threshold_2, threshold_3, threshold_4 FROM Crops WHERE name = ?`, crop, 
        (error, thresholds) => {
            if (!error) {
                send(thresholds); 
            } else {
                console.error('Error querying the database (fetchThresholds): ', error);
            }
        }
    ); 
}


module.exports.insertCrop = insertCrop; 
module.exports.fetchThresholds = fetchThresholds; 
