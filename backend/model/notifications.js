/*
Data retrieval and manipulation for the Notifications table. 

Author: Liam Turcotte
*/

const data = require('./init.js');


function insertNotification(fields) {
    // insert a single notification 
    data.db.run(`
        INSERT INTO Notifications(ID, username, longitude, latitude, text, date_time, new) 
        VALUES(?, ?, ?, ?, ?, ?, ?)`, 
        [fields.ID, fields.username, fields.longitude, fields.latitude, fields.text, fields.date_time, fields.new],  
        (error) => {
            if (error) {
                console.error('Error inserting a notification into the database (insertNotification): ', error); 
                return -1; 
            } 
        }
    ); 
}


function getAllUserNotifs(username, send) {
    // get all notifications in the database for this user 
    data.db.all('SELECT longitude, latitude, text, date_time, new FROM Notifications WHERE username = ?', username, 
        (error, notifications) => {
            if (!error) {
                send(notifications); 
            } else {
                console.error('Error querying the database (getAllUserNotifs): ', error);
            }
        }
    ); 
}


function setAllNotifsToOld(username) {
    // sets all notifications for a user to old 
    data.db.run(`UPDATE Notifications SET new = false WHERE username = ?`, username, (error) => {
        if (error) {
            console.error('Error updating notifications in the database (setAllNotifsToOld): ', error);  
            return -1; 
        } 
    }); 
}


module.exports.insertNotification = insertNotification;
module.exports.getAllUserNotifs = getAllUserNotifs; 
module.exports.setAllNotifsToOld = setAllNotifsToOld; 
