--
-- This SQL script builds a database, deleting any pre-existing version
--

-- Drop previous versions of the tables if they they exist

DROP TABLE IF EXISTS UserUser;
DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS Notif;
DROP TABLE IF EXISTS UserAccount;

-- Create the schema
CREATE TABLE UserAccount (
    ID integer PRIMARY KEY,
    username varchar(16) NOT NULL,
    password varchar(32) NOT NULL,
    creationDate TIMESTAMP
);

CREATE TABLE UserUser (
    ID integer PRIMARY KEY,
    userID integer REFERENCES UserAccount(ID),
    friendsID integer REFERENCES UserAccount(ID),
    creationDate TIMESTAMP
);

CREATE TABLE Notif (
    ID integer PRIMARY KEY,
    userID integer REFERENCES UserAccount(ID),
    type varchar(16),
    postTime TIMESTAMP
);

CREATE TABLE Comment (
    ID integer PRIMARY KEY,
    userID integer REFERENCES UserAccount(ID),
    notificationID integer REFERENCES Notif(ID),
    commentText varchar(128),
    postTime TIMESTAMP
);

-- Allow users to selectr data from the tables
GRANT SELECT ON UserAccount TO PUBLIC;
GRANT SELECT ON UserUser TO PUBLIC;
GRANT SELECT ON Notif TO PUBLIC;
GRANT SELECT ON Comment TO PUBLIC;

-- Add sample records
INSERT INTO UserAccount VALUES (0, 'admin', 'password', '2006-06-27 08:00:00');
INSERT INTO UserAccount VALUES (1, 'ajm94', 'ajm94', '2006-06-27 08:00:00');
INSERT INTO UserAccount VALUES (2, 'pjf5', 'pjf5', '2006-06-27 08:00:00');

INSERT INTO UserUser VALUES (0, 1, 2, '2006-06-27 08:00:00');
INSERT INTO UserUser VALUES (1, 0, 1, '2006-06-27 08:00:00');

INSERT INTO Notif VALUES (0, 1, 'study', '2006-06-27 08:00:00');