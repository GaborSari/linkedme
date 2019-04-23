const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;


const oracledb = require('oracledb');
var connection = undefined;
oracledb.outFormat = oracledb.OBJECT;
oracledb.getConnection(
	{
		user: 'h776447',
		password: 'h776447',
		connectString:
			'(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 4000))(CONNECT_DATA =(SID= kabinet)))'
	},
	function (err, _connection) {
		if (err) {
			console.error(err);
			return;
		}
		else {
			connection = _connection;
			app.listen(port, () => console.log(`Example app listening on port ${port}!`));
		}
	}
);

app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:4200'
	})
);

app.use(express.json());

// POST method route
app.post('/login', function (req, response) {
	let responseObject = {};
	let un = req.body.username;
	let pw = req.body.password;
	let sql = `SELECT username, password FROM seekers where USERNAME = '${un}'`;

	let isCompany = false;
	if (req.body.company != undefined && req.body.company == true) {
		isCompany = true;
		sql = `SELECT username, password FROM companies where USERNAME = '${un}'`;
	}

	connection.execute(sql, (
		err,
		result
	) => {
		if (err) {
			console.error(err);
			return;
		}
		if (result.rows.length > 0 && un == result.rows[0].USERNAME && pw == result.rows[0].PASSWORD) {
			responseObject.success = true;
			responseObject.username = un;
			responseObject.isCompany = isCompany;
		} else {
			responseObject.success = false;
		}
		response.json(responseObject);
	});


});

app.post('/registration', function (req, res) {
	let nw = {};
	let sql = '';
	let insert = '';
	let responseObject = {};
	nw.username = req.body.username;
	nw.password = req.body.password;
	if (req.body.isCompany == undefined || req.body.isCompany == false) {
		nw.cv = req.body.cv;
		nw.birth = req.body.birth;
		nw.isCompany = false;
		nw.name = req.body.name;
		sql = `SELECT username FROM seekers where USERNAME = '${nw.username}'`;
		insert = `INSERT INTO seekers (username, password, birth,name, cv)  VALUES('${nw.username}', '${nw.password}',  TO_DATE('${nw.birth}','yyyy-mm-dd'),'${nw.name}' ,utl_raw.cast_to_raw('${nw.cv}'))`

	} else {
		nw.isCompany = req.body.isCompany;
		nw.address = req.body.address;
		nw.webpage = req.body.webpage;
		nw.details = req.body.details;
		sql = `SELECT username FROM companies where USERNAME = '${nw.username}'`
		insert = `INSERT INTO companies (username, password, address, webpage, details)  VALUES('${nw.username}', '${nw.password}', '${nw.address}', '${nw.webpage}', '${nw.details}')`
	}
	connection.execute(sql, (
		err,
		result
	) => {
		if (err) {
			console.error(err);
			return;
		}
		if (result.rows.length > 0) {
			responseObject.success = false;
			response.json(responseObject);
			return;
		}

		connection.execute(
			insert,
			{ autoCommit: true },
			function (err, result) {
				if (err) {
					console.error(err);
					return;
				}
				else {
					responseObject.success = true;
					response.json(responseObject);
				}
			}
		);


	});
});
