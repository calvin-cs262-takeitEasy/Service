const pgp = require("pg-promise")();
const db = pgp({
  host: process.env.DB_SERVER,
  port: process.env.DB_PORT,
  database: process.env.DB_USER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

router.get("/", readHelloMessage);

//user functions
router.put("/usernames/:id", updateUser); // Updating user
router.post('/users', createUser); // Create user
router.delete('/users/:id', deleteUser); // Delete user

//login
router.post("/login", handleLogin);

router.get("/username", readUserAccounts); // list all accounts
router.get("/username/:id", readUserAccount); // show user account using user id

router.get("/friends/:id", readUserUser); // list friends of user using user id
router.post("/friends", createFriend); // Create friend

router.get("/notifications/:id", readNotification); // list of notifications function using user id
router.get("/notifications/friends/:id", readFriendNotifs); // user id that returns all of users friends' and their notifs
router.post("/notifications", createNotification); // Create notification

app.use(router);
app.listen(port, () => console.log(`Listening on port ${port}`));

function returnDataOr404(res, data) {
  if (data == null) {
    res.sendStatus(404);
  } else {
    res.send(data);
  }
}

function readHelloMessage(req, res) {
  res.send("Welcome to the Commit Service!");
}

// list all accounts
function readUserAccounts(req, res, next) {
  db.many("SELECT * FROM UserAccount")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}
// show user account using user id
function readUserAccount(req, res, next) {
  db.one("SELECT * FROM UserAccount WHERE ID=${id}", req.params)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

// list friends of user using user id
function readUserUser(req, res, next) {
  db.many("SELECT * FROM UserUser WHERE userID=${id}", req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}
// Updating user
function updateUser(req, res, next) {
    db.oneOrNone('UPDATE Users SET name=${body.name} WHERE id=${params.id} RETURNING id', req)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

//Create user
function createUser(req, res, next) {
    db.one('INSERT INTO UserAccount(username, password) VALUES (${username}, ${password}) RETURNING ID', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

// Create friend
function createFriend(req, res, next) {
    db.one('INSERT INTO UserUser(userID, friendsID) VALUES (${userID}, ${friendsID}) RETURNING ID', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

// Delete user
function deleteUser(req, res, next) {
    db.oneOrNone('DELETE FROM Users WHERE id=${id} RETURNING id', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

//login function
async function handleLogin(req, res) {
    const {  username, password } = req.body;  // username, password might be wrong spelling

    try{
        if(!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if(user.password === pasword) {
            return res.status(200).json({ message: 'Login approved' });
        } else {
            return res.status(200).json({ message: 'Incorrect password' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error occured during login'});
    }
}

// list of notifications function using user id
function readNotification(req, res, next) {
  db.any("SELECT * FROM Notif WHERE userID=${id} ORDER BY ID", req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// user id that returns all of users friends' and their notifs
function readFriendNotifs(req, res, next) {
  db.many(
    "SELECT DISTINCT Notif.ID, Notif.type, Notif.posttime, UserAccount.name, UserAccount.username FROM Notif, UserUser, UserAccount WHERE UserUser.userID=${id} AND Notif.userID = UserAccount.ID AND Notif.userID = UserUser.friendsID OR Notif.userID = UserUser.userID AND UserAccount.ID = UserUser.userID AND UserUser.userID=${id} ORDER BY ID",
    req.params
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}


// list of notifications function

// user id that includes user id returns all of users friends notifs

// returns all of the users friends
function readUserFriends(req, res, next) {
  db.many(
    "SELECT UserUser.friendsID FROM UserUser, UserAccount WHERE UserAccount.ID=UserUser.userID AND UserUser.userID=${id}",
    req.params
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}
// Create notification
function createNotification (req, res, next) {
  db.one('INSERT INTO Notif(userID, type) VALUES (${userID}, ${type}) RETURNING ID', req.body)
      .then(data => {
          res.send(data);
      })
      .catch(err => {
          next(err);
      });
}