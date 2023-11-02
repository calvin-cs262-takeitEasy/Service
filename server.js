const pgp = require('pg-promise')();
const db = pgp({
    host: process.env.DB_SERVER,
    port: process.env.DB_PORT,
    database: process.env.DB_USER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

router.get("/", readHelloMessage);
router.get("/usernames", readUserAccounts);

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
    res.send('Welcome to the Commit Service!');
}


// username function
function readUserAccounts(req, res, next) {
    db.many("SELECT * FROM UserAccount")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}



// friends function
function readUserUser(req, res, next) {
    db.oneOrNone('SELECT * FROM UserUser WHERE id=${ID}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        })
}



// list of notifications function
// user id that includes user id returns all of users friends notifs
//