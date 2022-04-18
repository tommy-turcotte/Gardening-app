/*
Created: 2022-04-08
Modified: 2022-04-12
Model: SQLite 3.7
Database: SQLite 3.7
*/

-- Create tables section -------------------------------------------------

-- Table Users

CREATE TABLE Users
(
  username character varying(15) NOT NULL,
  email character varying(255) NOT NULL,
  name character varying(100) NOT NULL,
  CONSTRAINT PK_Users PRIMARY KEY (username),
  CONSTRAINT email UNIQUE (email)
)
;

-- Table Auth

CREATE TABLE Auth
(
  username character varying(15) NOT NULL,
  hashed_pw character varying(200) NOT NULL,
  salt character(128) NOT NULL,
  iterations int NOT NULL,
  hash_length int NOT NULL,
  algorithm character varying(20) NOT NULL,
  CONSTRAINT PK_Auth PRIMARY KEY (username),
  CONSTRAINT hashed_pw UNIQUE (hashed_pw),
  CONSTRAINT salt UNIQUE (salt),
  CONSTRAINT authenticates
    FOREIGN KEY (username)
    REFERENCES Users (username)
)
;

-- Table Locations

CREATE TABLE Locations
(
  longitude double precision NOT NULL,
  latitude double precision NOT NULL,
  k_lvl int NOT NULL,
  n_lvl int NOT NULL,
  p_lvl int NOT NULL,
  ph double precision NOT NULL,
  temperature double precision NOT NULL,
  humidity double precision NOT NULL,
  rainfall double precision NOT NULL,
  recommended_crop character varying(30) NOT NULL,
  name character varying(100),
  CONSTRAINT PK_Locations PRIMARY KEY (longitude,latitude)
)
;

-- Table Crops

CREATE TABLE Crops
(
  name character varying(30) NOT NULL,
  threshold_1 double precision NOT NULL,
  threshold_2 double precision NOT NULL,
  threshold_3 double precision NOT NULL,
  threshold_4 double precision NOT NULL,
  CONSTRAINT PK_Crops PRIMARY KEY (name)
)
;

-- Table Watchers

CREATE TABLE Watchers
(
  username character varying(15) NOT NULL,
  longitude double precision NOT NULL,
  latitude double precision NOT NULL,
  CONSTRAINT PK_Watchers PRIMARY KEY (username,longitude,latitude),
  CONSTRAINT tracks
    FOREIGN KEY (username)
    REFERENCES Users (username),
  CONSTRAINT tracked
    FOREIGN KEY (longitude, latitude)
    REFERENCES Locations (longitude, latitude)
)
;

-- Table Locations_Crops

CREATE TABLE Locations_Crops
(
  crop character varying(30) NOT NULL,
  longitude double precision NOT NULL,
  latitude double precision NOT NULL,
  yield double precision NOT NULL,
  label int NOT NULL,
  CONSTRAINT PK_Locations_Crops PRIMARY KEY (crop,longitude,latitude),
  CONSTRAINT growing
    FOREIGN KEY (longitude, latitude)
    REFERENCES Locations (longitude, latitude),
  CONSTRAINT grown
    FOREIGN KEY (crop)
    REFERENCES Crops (name)
)
;

-- Table Threads

CREATE TABLE Threads
(
  ID character(36) NOT NULL,
  creator character varying(15) NOT NULL,
  title character varying(150) NOT NULL,
  creation_datetime datetime NOT NULL,
  last_updated_datetime datetime NOT NULL,
  description character varying(1000),
  CONSTRAINT PK_Threads PRIMARY KEY (ID,creator),
  CONSTRAINT creates
    FOREIGN KEY (creator)
    REFERENCES Users (username)
)
;

-- Table Comments

CREATE TABLE Comments
(
  ID character(36) NOT NULL,
  writer character varying(15) NOT NULL,
  thread_id character(36) NOT NULL,
  thread_creator character varying(15) NOT NULL,
  text character varying(2000) NOT NULL,
  creation_datetime datetime NOT NULL,
  last_updated_datetime datetime NOT NULL,
  CONSTRAINT PK_Comments PRIMARY KEY (ID,writer,thread_id,thread_creator),
  CONSTRAINT writes
    FOREIGN KEY (writer)
    REFERENCES Users (username),
  CONSTRAINT contains
    FOREIGN KEY (thread_id, thread_creator)
    REFERENCES Threads (ID, creator)
)
;

-- Table Notifications

CREATE TABLE Notifications
(
  ID character(36) NOT NULL,
  username character varying(15) NOT NULL,
  longitude double precision NOT NULL,
  latitude double precision NOT NULL,
  text character varying(500) NOT NULL,
  date_time datetime NOT NULL,
  new boolean NOT NULL,
  CONSTRAINT PK_Notifications PRIMARY KEY (ID,username,longitude,latitude),
  CONSTRAINT generate
    FOREIGN KEY (username, longitude, latitude)
    REFERENCES Watchers (username, longitude, latitude)
)
;

