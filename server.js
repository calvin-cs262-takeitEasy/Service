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
router.put("/usernames/:id", updateUser);
router.post('/users/:id', createUser);
router.delete('/users/:id', deleteUser);

//login
router.post("/login", handleLogin);

router.get("/username", readUserAccounts);
router.get("/username/:id", readUserAccount);

router.get("/friends/:id", readUserUser);

router.get("/notifications/:id", readNotification);
router.get("/notifications/friends/:id", readFriendNotifs);

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
  db.many("SELECT * FROM UserUser WHERE ID=${id}", req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}
//Updating user
function updateUser(req, res, next) {
    db.oneOrNone('UPDATE Users SET email=${body.email}, name=${body.name} WHERE id=${params.id} RETURNING id', req)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

//Create user
function createUser(req, res, next) {
    db.one('INSERT INTO Users(name, emailAddress, password, type) VALUES (${name}, ${email}, ${password}, ${type}) RETURNING id', req.body)
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
  db.any("SELECT * FROM Notif WHERE userID=${id}", req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// user id that returns all of users friends notifs
function readFriendNotifs(req, res, next) {
  db.many(
    "SELECT DISTINCT Notif.ID, Notif.type, Notif.posttime, UserAccount.name, UserAccount.username FROM Notif, UserUser, UserAccount WHERE UserUser.userID=${id} AND Notif.userID = UserAccount.ID AND Notif.userID = UserUser.friendsID OR Notif.userID = UserUser.userID AND UserAccount.ID = UserUser.userID AND UserUser.userID=${id} ORDER BY posttime",
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
