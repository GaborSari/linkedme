const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;

let user = {
	uname: '',
	pw: '',
	isCompany: false
};
let response = {
	success: false,
	username: '',
	isCompany: false
};

var oracledb = require('oracledb');

function checkCompany(p) {
	return p || p == undefined;
}

function checkUser(name1, name2, pw1, pw2) {
	return name1 == name2 && pw1 == pw2;
}

app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:4200'
	})
);

app.use(express.json());

// GET method route
app.get('/', function(req, res) {
	res.send('asd');
});

// POST method route
app.post('/login', function(req, res) {
	user.uname = req.body.username;
	user.pw = req.body.password;
	if (req.body.company == undefined || req.body.company == false) {
		user.isCompany = false;
	} else user.isCompany = true;

	// user.isCompany = res.body.company;
	console.log(req.body);

	// console.log(user);

	oracledb.getConnection(
		{
			user: 'h776447',
			password: 'h776447',
			connectString:
				'(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 4000))(CONNECT_DATA =(SID= kabinet)))' // ez nemtom jó-e
		},
		function(err, connection) {
			if (err) {
				console.error(err);
				return;
			}

			if (!user.isCompany) {
				connection.execute(`SELECT username, password FROM seekers where USERNAME = '${user.uname}'`, function(
					err,
					result
				) {
					if (err) {
						console.error(err);
						return;
					}
					res = result.rows;
					console.log(user);

					if (res.length > 0 && checkUser(user.uname, res[0][0], user.pw, res[0][1])) {
						response.success = true;
						response.username = user.username;
						response.isCompany = false;
						console.log('sikeres bejelentkezés');
					} else {
						response.success = false;
						response.username = '';
						response.isCompany = false;
						console.log('sikertelen bejelentkezés');
					}

					console.log(res[0]);
				});
			} else {
				connection.execute(
					`SELECT username, password FROM companies where USERNAME = '${user.uname}'`,
					function(err, result) {
						if (err) {
							console.error(err);
							return;
						}
						res = result.rows;
						console.log(user);

						if (res.length > 0 && checkUser(user.uname, res[0][0], user.pw, res[0][1])) {
							response.success = true;
							response.username = user.username;
							response.isCompany = false;
							console.log('sikeres bejelentkezés');
						} else {
							response.success = false;
							response.username = '';
							response.isCompany = false;
							console.log('sikertelen bejelentkezés');
						}

						console.log(res[0]);
					}
				);
			}
		}
	);
	res.json(response);
});

app.post('/registration', function(req, res) {
	console.log(req.body);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
