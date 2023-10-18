--
-- This SQL script builds a monopoly database, deleting any pre-existing version
--

-- Drop previous versions of the tables if they they exist
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS UserUser;
DROP TABLE IF EXISTS Notification; -- change name
DROP TABLE IF EXISTS Comment;

-- Create the schema
CREATE TABLE User (
    ID integer PRIMARY KEY,
    username varchar(16) NOT NULL,
    password varchar(32) NOT NULL,
    creationDate timestap
);

CREATE TABLE UserUser (
    ID integer PRIMARY KEY,
    userID integer REFERENCES User(ID),
    friendsID integer REFERENCES User(ID),
    creationDate timestap
);

CREATE TABLE Notification (
    ID integer PRIMARY KEY,
    userID integer REFERENCES User(ID),
    type varchar(16),
    postTime timestap
);

CREATE TABLE Comment (
    ID integer PRIMARY KEY,
    userID integer REFERENCES User(ID),
    notificationID integer REFERENCES Notification(ID),
    commentText varchar(128),
    postTime timestap
);

-- Allow users to selectr data from the tables
GRANT SELECT ON User TO PUBLIC;
GRANT SELECT ON UserUser TO PUBLIC;
GRANT SELECT ON Notification TO PUBLIC;
GRANT SELECT ON Comment TO PUBLIC;

-- Add sample records
INSERT INTO User VALUES (0, "admin", "password", "2006-06-27 08:00:00");
INSERT INTO User VALUES (1, "ajm94", "ajm94", "2006-06-27 08:00:00");
INSERT INTO User VALUES (2, "pjf5", "pjf5", "2006-06-27 08:00:00");

INSERT INTO UserUser VALUES (0, 1, 2, "2006-06-27 08:00:00");
INSERT INTO UserUser VALUES (1, 0, 1, "2006-06-27 08:00:00");

INSERT INTO Notification VALUES (0, 1, "study", "2006-06-27 08:00:00");