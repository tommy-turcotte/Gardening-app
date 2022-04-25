# WAD Final Project Group 22

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

### Recommended tools (developer)
1. Postman: much better way to hit endpoints over using a traditional browser 
2. DB Browser for SQLite: track entire database state in real time 

### Note on location data 
A considerable portion of the pre-built database consists of location data generated using the `data/location_recs.json` file. The dataset used to create this file can be found [here](https://www.kaggle.com/datasets/siddharthss/crop-recommendation-dataset). 

## Front-end details

### Prerequisites

`Node.js` version 12.2.0 or greater

### Installing packages
Ensure you are in the `frontend/` directory. 

1. `npm install -g @vue/cli`
2. `npm install bulma`
3. `npm install axios`
4. `npm install md5`

### How to run
1. `cd frontend/`
2. `npm run serve`

