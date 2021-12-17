let express = require("express");
let mysql = require("mysql");
let router = express.Router();
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "tadatabase",
});
const bodyParser = require("body-parser");

const app = express();
const port = 8000;

var cors = require("cors");

app.use(cors()); // Use this after the variable declaration

app.use(bodyParser.json()); //support parsing of application/json type post data

app.use(bodyParser.urlencoded({ extended: true })); //support parsing of application/x-www-form-urlencoded post data

app.listen(port, () => {
  console.log("We are live on " + port);
});

require("./app/routes")(app, connection);

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});
