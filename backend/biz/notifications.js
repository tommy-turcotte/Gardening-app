/*
Business layer logic for notification-related endpoints. 

Author: Liam Turcotte
*/

const dbNotifications = require('../model/notifications.js'); 


function getAllUserNotifs(isLoggedIn, userLoggedIn, dbFilled, sendResponse) {
    // Retrieves all notifications for this user and sets all new notifications to old 
    if (!isLoggedIn) {
        sendResponse(401, "Not authenticated; cannot perform operation."); 
    } else if (!dbFilled) {
        sendResponse(403, "No user or notification data."); 
    } else {
        dbNotifications.getAllUserNotifs(userLoggedIn, function(notifications) {
            if (notifications.length == 0) {
                sendResponse(403, "No notifications."); 
            } else {
                dbNotifications.setAllNotifsToOld(userLoggedIn); 
                sendResponse(200, notifications); 
            }
        }); 
    }
}

module.exports.getAllUserNotifs = getAllUserNotifs; 
