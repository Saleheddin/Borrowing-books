const express = require('express');
const pg = require("pg");
const app = express();
require('dotenv').config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const conString = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Default to accept all requests
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


/**
 * Authenticate function to get login and password
 */
app.post("/authenticate", function (req, res) {
    const login = req.body.login;
    const passwd = req.body.passwd;

    let jsonString;
    if ((login === "admin") && (passwd === "admin")) {
        jsonString = JSON.stringify({ ok: 1 });
    } else {
        jsonString = JSON.stringify({ ok: 0 });
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(jsonString);
});

/**
 * Send request to Postgresql server
 * @param {*} req 
 * @param {*} res 
 * @param {*} sqlRequest 
 * @param {*} values 
 */
function getSQLResult(req, res, sqlRequest, values) {
	const client = new pg.Client(conString);
	client.connect(function(err) {
		if (err) {
			// Cannot connect
			console.error('cannot connect to postgres', err);
			res.status(500).end('Database connection error!');
		} else {
			// Connection is OK
			client.query(sqlRequest, values, function(err, result) {
				if (err) {
					// Request fails
					console.error('bad request', err);
					res.status(500).end('Bad request error!');
				} else {
					// Build result array from SQL result rows
					const results = [];
					for (let ind in result.rows) {
						results.push(result.rows[ind]);
					}
		    	   	// Convert object to a JSON string and send it back
					res.setHeader('Content-Type', 'application/json');
					res.send(JSON.stringify(results));
				}
				client.end();
			});
		}
	});
}
/**
 * Send request to Postgresql server 
 */
app.get("/users", function(req, res) {
	const sqlRequest = "SELECT * FROM person ORDER BY person_lastname, person_firstname";
	const values = [];
	getSQLResult(req, res, sqlRequest, values);
});
/**
 * Send request to Postgresql server
 */
app.post("/users", function(req, res) {
	const sqlRequest = "SELECT * FROM person ORDER BY person_lastname, person_firstname";
	const values = [];
	getSQLResult(req, res, sqlRequest, values);
});

/**
 * respond to the raquest with the id of a user
 */
app.post("/user", function(req, res) {
    const id = req.body.id;
	const sqlRequest = "SELECT * FROM Person WHERE person_id = $1" ;
	const values = [id];
	getSQLResult(req, res, sqlRequest, values);
});

app.post("/saveUser", function(req, res) {
    // defining the user informations to be saved
    const person_id = req.body.person_id;
	const person_firstname = req.body.person_firstname;
	const person_lastname = req.body.person_lastname;
	const person_birthdate = req.body.person_birthdate;
    //the sql request to send to the client
    let sqlRequest = "";
    // values used by the sqlrequest
    let values = [];
    // We build a request that returns ID value (Person_ID) either if it's inserting (new user) or uodating existed user
	if (person_id < 0) {
		sqlRequest = "INSERT INTO Person(Person_FirstName, Person_LastName, Person_BirthDate)"
		+ " VALUES ($1, $2, $3)"
		+ " RETURNING Person_ID";
		values = [person_firstname, person_lastname, person_birthdate];
	} else {
		sqlRequest = "UPDATE Person SET"
		+ " Person_FirstName=$1, Person_LastName=$2, Person_BirthDate=$3"
		+ " WHERE Person_ID=$4"
		+ " RETURNING Person_ID";
		values = [person_firstname, person_lastname, person_birthdate, person_id];
	}
	getSQLResult(req, res, sqlRequest, values);
});

/**
 * Implement a POST method in server.js that delete user and returns :
    • maybe an empty list if you use getSQLResult and it is ok,
    • an error otherwise.
 */
app.post("/deletUser",function(req,res){
    const person_id = req.body.person_id;
    const sqlRequest = "DELETE FROM person WHERE person_id = $1 ";
    const values = [person_id];
    getSQLResult(req, res, sqlRequest, values);
});


/**
 * Get books list
 */
app.post("/books", function(req, res) {
	const sqlRequest = "SELECT * FROM Book ORDER BY Book_Title, Book_Authors";
	const values = [];
	getSQLResult(req, res, sqlRequest, values);
});

app.get("/books", function(req, res) {
	const sqlRequest = "SELECT * FROM Book ORDER BY Book_Title, Book_Authors";
	const values = [];
	getSQLResult(req, res, sqlRequest, values);
});

app.post("/book", function(req, res) {
	const id = req.body.id;
	const sqlRequest = "SELECT * FROM Book WHERE Book_id=$1";
	const values = [id];
	getSQLResult(req, res, sqlRequest, values);
});

app.post("/saveBook", function(req, res) {
	const book_id = req.body.book_id;
	const book_title = req.body.book_title;
	const book_authors = req.body.book_authors;

	let sqlRequest = "";
	let values = [];
	// we insert the book if it's not already in the database (negative id) and we return the id
	if (book_id < 0) {
		sqlRequest = "INSERT INTO Book(Book_Title, Book_Authors)"
		+ " VALUES ($1, $2)"
		+ " RETURNING Book_ID";
		values = [book_title, book_authors];
	} else {
		sqlRequest = "UPDATE Book SET"
		+ " Book_Title=$1, Book_Authors=$2"
		+ " WHERE Book_ID=$3"
		+ " RETURNING Book_ID";
		values = [book_title, book_authors, book_id];
	}
	getSQLResult(req, res, sqlRequest, values);
});

app.post("/deleteBook", function(req, res) {
	const book_id = req.body.book_id;
	const sqlRequest = "UPDATE Book SET available=$1 WHERE Book_ID=$2";
	const values = [0,book_id];
	getSQLResult(req, res, sqlRequest, values);
});

/**
 *  • add a “/borrows” route to retrieve a person_id borrows
	• add a “/borrow” route to retrieve a borrow_id informations
	• add a “/saveBorrow” route to create a new line in Borrow according to the person_id, a book_id
	and a date of borrow.
	• add a “/returnBook” route to return a book for a given borrow_id
 */

app.post('/borrows', function(req,res){
	const person_id = req.body.person_id;
	const sqlRequest = "SELECT Borrow.*, Book_Title FROM Borrow JOIN Book USING (Book_ID) WHERE Person_ID=$1 ORDER BY Borrow_ID";
	const values = [person_id];
	getSQLResult(req, res, sqlRequest, values);
});

app.post("/borrow", function(req, res) {
	const id = req.body.id;
	const sqlRequest = "SELECT Borrow.*, Book_Title FROM Borrow JOIN Book USING (Book_ID) WHERE Borrow_ID=$1";
	const values = [id];
	getSQLResult(req, res, sqlRequest, values);
});

app.post("/returnBook", function(req, res) {
	const borrow_id = req.body.borrow_id;
	const borrow_return = req.body.borrow_return;

	const sqlRequest = "UPDATE Borrow SET"
	+ " Borrow_Return=$1"
	+ " WHERE Borrow_ID=$2"
	+ " RETURNING Borrow_ID";
	const values = [borrow_return, borrow_id];
	getSQLResult(req, res, sqlRequest, values);
});

app.post("/saveBorrow", function(req, res) {
	const person_id = req.body.person_id;
	const book_id = req.body.book_id;
	const borrow_date = req.body.borrow_date;

	let sqlRequest = "";
	let values = [];
	// We build a request that returns ID value to be able to returns its value (Borrow_ID)
	sqlRequest = "INSERT INTO Borrow(Person_ID, Book_ID, Borrow_Date)"
	+ " VALUES ($1, $2, $3)"
	+ " RETURNING Borrow_ID";
	values = [person_id, book_id, borrow_date];
	getSQLResult(req, res, sqlRequest, values);
});

// Listen to port 8000
app.listen(8000, () => {
    console.log('Server started!')
});

