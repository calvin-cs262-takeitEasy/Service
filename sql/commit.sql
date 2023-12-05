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
    ID SERIAL PRIMARY KEY,
    name varchar(32),
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
-- INSERT INTO UserAccount VALUES (0, 'admin', 'password', '2006-06-27 08:00:00');
-- INSERT INTO UserAccount VALUES (1, 'ajm94', 'ajm94', '2006-06-27 08:00:00');
-- INSERT INTO UserAccount VALUES (2, 'pjf5', 'pjf5', '2006-06-27 08:00:00');

-- INSERT INTO UserUser VALUES (0, 1, 2, '2006-06-27 08:00:00');
-- INSERT INTO UserUser VALUES (1, 0, 1, '2006-06-27 08:00:00');

-- INSERT INTO Notif VALUES (0, 1, 'study', '2006-06-27 08:00:00');

-- INSERT INTO Comment VALUES (0, 2, 0, 'I''m studying too!', '2006-06-27 08:00:00');


-- ChatGPT given records
INSERT INTO UserAccount (name, username, password, creationDate) VALUES
  ('keith', 'kvlinden', 'keith_password', '2023-10-24 10:15:00'),
  ('Brenda VanderLinden', 'brenda.vl', 'brenda_password', '2023-10-24 11:30:00'),
  ('Ken Arnold', 'ken', 'ken_password', '2023-10-24 12:45:00'),
  ('Vic Norman', 'THE_VIC', 'vic_password', '2023-10-24 13:20:00'),
  ('emily', 'emily45', 'emily_password', '2023-10-24 14:55:00'),
  ('frank', 'frank17', 'frank_password', '2023-10-24 15:40:00'),
  ('grace', 'grace53', 'grace_password', '2023-10-24 16:25:00'),
  ('henry', 'henry39', 'henry_password', '2023-10-24 17:10:00'),
  ('isabel', 'isabel88', 'isabel_password', '2023-10-24 18:35:00'),
  ('jason', 'jason65', 'jason_password', '2023-10-24 19:50:00'),
  ('karen', 'karen76', 'karen_password', '2023-10-24 20:15:00'),
  ('lucas', 'lucas12', 'lucas_password', '2023-10-24 21:30:00'),
  ('mary', 'mary29', 'mary_password', '2023-10-24 22:45:00'),
  ('nathan', 'nathan50', 'nathan_password', '2023-10-24 23:20:00'),
  ('olivia', 'olivia18', 'olivia_password', '2023-10-25 00:55:00'),
  ('peter', 'peter84', 'peter_password', '2023-10-25 01:40:00'),
  ('quinn', 'quinn61', 'quinn_password', '2023-10-25 02:25:00'),
  ('rachel', 'rachel22', 'rachel_password', '2023-10-25 03:10:00'),
  ('sam', 'sam73', 'sam_password', '2023-10-25 04:35:00'),
  ('tom', 'tom56', 'tom_password', '2023-10-25 05:50:00'),
  ('teamE', 'admin', 'admin', '2023-10-25 06:15:00');

-- INSERT INTO UserUser (ID, userID, friendsID, creationDate) VALUES
--   (1, 1, 2, '2023-10-24 12:00:00'),
--   (2, 2, 1, '2023-10-24 13:00:00'),
--   (3, 3, 4, '2023-10-24 14:00:00'),
--   (4, 4, 5, '2023-10-24 15:00:00'),
--   (5, 5, 3, '2023-10-24 16:00:00'),
--   (6, 1, 3, '2023-10-24 12:00:00');
--   (7, 1, 4, '2023-10-24 12:00:00');

-- INSERT INTO Notif (ID, userID, type, postTime) VALUES
--   (1, 3, 'study_fail', '2023-10-24 10:15:00'),
--   (2, 5, 'study_success', '2023-10-24 11:30:00'),
--   (3, 2, 'alarm_fail', '2023-10-24 12:45:00'),
--   (4, 4, 'alarm_success', '2023-10-24 13:20:00'),
--   (5, 1, 'bedtime_fail', '2023-10-24 14:55:00'),
--   (6, 3, 'bedtime_success', '2023-10-24 15:40:00'),
--   (7, 5, 'study_fail', '2023-10-24 16:25:00'),
--   (8, 4, 'study_success', '2023-10-24 17:10:00'),
--   (9, 2, 'alarm_fail', '2023-10-24 18:35:00'),
--   (10, 1, 'alarm_success', '2023-10-24 19:50:00'),
--   (11, 3, 'bedtime_fail', '2023-10-24 20:15:00'),
--   (12, 5, 'bedtime_success', '2023-10-24 21:30:00'),
--   (13, 2, 'study_fail', '2023-10-24 22:45:00'),
--   (14, 4, 'study_success', '2023-10-24 23:20:00'),
--   (15, 1, 'alarm_fail', '2023-10-25 00:55:00'),
--   (16, 3, 'alarm_success', '2023-10-25 01:40:00'),
--   (17, 5, 'bedtime_fail', '2023-10-25 02:25:00'),
--   (18, 4, 'bedtime_success', '2023-10-25 03:10:00'),
--   (19, 2, 'study_fail', '2023-10-25 04:35:00'),
--   (20, 1, 'study_success', '2023-10-25 05:50:00');

--   INSERT INTO Comment (ID, userID, notificationID, commentText, postTime) VALUES
--   (1, 1, 1, 'message', '2023-10-24 16:00:00'),
--   (2, 2, 2, 'message', '2023-10-24 17:00:00'),
--   (3, 3, 3, 'message', '2023-10-24 18:00:00'),
--   (4, 4, 4, 'message', '2023-10-24 19:00:00'),
--   (5, 5, 5, 'message', '2023-10-24 20:00:00');