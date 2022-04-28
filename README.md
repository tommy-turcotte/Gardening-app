# WAD Final Project Group 22

## Members
| Group Member Name | GitHub Username (GitHub URL)|
| :------------------------:|:--------------------------------------:|
| Liam Turcotte | [laturcotte](https://github.com/laturcotte) |
| Tommy Turcotte | [tommy-turcotte](https://github.com/tommy-turcotte) |
| Samuel Bazinet | [samuel-bazinet](https://github.com/samuel-bazinet) |
| Guillaume Flores | [Will-exe](https://github.com/Will-exe) |

## Independent Study 
Our independent study is on `Node.js`'s built-in `crypto` module, located at `docs/Independent_Study_crypto.pdf`. The slides can be accessed [here](docs/Independent_Study_crypto.pdf). 

## Project and App Overview
This website is a data-centric application whose purpose is to aid gardeners and farmers in managing their planted crops and making optimal horticulture decisions. Please see the `Pages and System Functions` section further down this page for more details on the site’s modules. 

### Important notes 
- Our group focused a lot of our efforts into developing the backend and the database; as such, some of the functionality it provides is not reflected in the frontend yet. We hope that this—as well as the complexity of our server—is taken into account for the marking.   
- It is recommended to log in as `user1` (username: `user1`, password: `user1pw`) because this user already has data initialized for several system functions (e.g., a watchlist with multiple locations). 

## Server-side details 
### Installing packages
Ensure you are in the `backend/` directory. 

1. `npm install -g nodemon`
2. `npm install express`
3. `npm install sqlite3`
4. `npm install ml-knn`
5. `npm install md5`

View installed packages using `npm list` (no args shows local packages (e.g., `express` and `sqlite`), `-g` to show global packages).

### How to run 
1. `cd backend/`
2. `nodemon` 

The backend runs on port `4321`. 

### Database initialization 
This project uses SQLite; thus, the database is stored as a single `.db` file (`backend/data/database.db`). It is pre-filled (i.e., all tables contain records), so it will work out-of-the-box (no initialization necessary). As previously stated, it is suggested to log in as `user1` to take full advantage of the database. 

### Recommended tools 
1. DB Browser for SQLite: track entire database state in real time. 
2. Postman: provides a much better interface for hitting endpoints and communicating with the backend server directly. Recommended to try out endpoints that are not called by the frontend. 

### Note on location data 
A considerable portion of the pre-built database consists of location data generated using the `data/location_recs.json` file. The dataset used to create this file can be found [here](https://www.kaggle.com/datasets/siddharthss/crop-recommendation-dataset). 

## Front-end details
### Installing packages
Ensure you are in the `frontend/` directory. 

1. `npm install -g @vue/cli`
2. `npm install bulma`
3. `npm install axios`
4. `npm install md5`
5. `npm install jquery`
6. `npm install d3`

### How to run
First ensure that the backend server is running. 

1. `cd frontend/`
2. `npm run serve`

The frontend runs on port `8080`. 

## Pages and System Functions
### Home Page 
Greeting page of the project. User can click through the tiles to see a preview of each main feature.

![Alt text](/frontend/src/assets/home_demo.png?raw=true "Title")

### Watchlist Page 

User can build a table of their watched locations with whichever attributes they want (selected in the dropdown). Clicking a column in the table generates a visualization for the column's data.

![Alt text](/frontend/src/assets/watchlist_demo.png?raw=true "Title")

### Account Page 

Users can see their account data. Accessed from the Profile dropdown menu.

![Alt text](/frontend/src/assets/account_demo.png?raw=true "Title")

### Authentication (Login, logout, register) 

Users can login and register when they are logged out, and have the option to log out in the profile dropdown menu when they are logged in.

![Alt text](/frontend/src/assets/login_demo.png?raw=true "Title") 

![Alt text](/frontend/src/assets/register_demo.png?raw=true "Title")

### Crops And Yields Page

Users select a row from their watched locations and a table will be build showing the crops and associated yields for that location. The user additionally have the option to add a new crop and yield item to the database.

![Alt text](/frontend/src/assets/cropyield_demo.png?raw=true "Title")

### Search Page

Users can search for a crop. They can enter any amount of parameters they desire.

![Alt text](/frontend/src/assets/search_demo.png?raw=true "Title")

### Notifications Page

Users will be shown their list of notifications. Filled color notifications are new and light notifications are old.

![Alt text](/frontend/src/assets/notification_demo.png?raw=true "Title")

### Add Location Page

Users need to enter their location as well as all soil parameters for their location. They will also have the choice to add the location to their watch list before submitting.

![Alt text](/frontend/src/assets/location_demo.png?raw=true "Title")
