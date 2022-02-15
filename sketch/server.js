const express = require("express");
const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/views"))

const USERS = {
    "user1": {
        name: "Joe",
        age: 20
    },
    "user2": {
        name: "Ashley",
        age: 42
    }
};

app.get("/", function(req, res) {
    res.render("index", {title: "Test Title", users: JSON.stringify(USERS), err: "This is an error"});
});

app.listen(port);