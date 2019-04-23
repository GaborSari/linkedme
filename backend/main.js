const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;

let user = {
	uname: '',
	pw: '',
	isCompany: false
};
let newUser = {
	uname: '',
	pw: '',
	birth: '',
	cv: ''
};

let newCompany = {
	username: '',
	isCompany: true,
	password: '',
	address: '',
	webpage: '',
	details: ''
};
let response = {
	success: false,
	username: '',
	isCompany: false
};

var oracledb = require('oracledb');

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
							response.isCompany = true;
							console.log('sikeres bejelentkezés');
						} else {
							response.success = false;
							response.username = '';
							response.isCompany = true;
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
	if (req.body.isCompany == undefined || req.body.isCompany == false) {
		newUser.uname = req.body.username;
		newUser.pw = req.body.password;
		newUser.cv = req.body.cv;
		newUser.birth = req.body.birth;
	} else {
		newCompany.username = req.body.username;
		newCompany.isCompany = req.body.isCompany;
		newCompany.password = req.body.password;
		newCompany.address = req.body.address;
		newCompany.webpage = req.body.webpage;
		newCompany.details = req.body.details;
	}

	console.log(newUser);
	console.log(newCompany);

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

			if (
				newUser.uname.length > 0 &&
				newUser.pw.length > 0 &&
				newUser.cv.length > 0 &&
				newUser.birth.length > 0
			) {
				connection.execute(
					`SELECT username, password FROM seekers where USERNAME = '${newUser.uname}'`,
					function(err, result) {
						if (err) {
							console.error(err);
							return;
						}
						res = result.rows;

						if (res.length > 0) {
							response.success = false;

							console.log('sikertelen regisztráció');
						} else {
							connection.execute(
								`INSERT INTO   seekers (username, password, birth, cv)  VALUES('${newUser.uname}', '${newUser.pw}', '${newUser.birth}', '${newUser.cv}')`,
								{ autoCommit: true },
								function(err, result) {
									if (err) {
										console.error(err);
										return;
									}
									// res = result.rows;
								}
							);
							response.success = true;
							console.log('sikeres regisztráció');
						}
					}
				);
			} else if (
				newCompany.username.length > 0 &&
				newCompany.password.length > 0 &&
				newCompany.webpage.length > 0 &&
				newCompany.address.length > 0 &&
				newCompany.details.length > 0
			) {
				connection.execute(
					`SELECT username, password FROM companies where USERNAME = '${newUser.uname}'`,
					function(err, result) {
						if (err) {
							console.error(err);
							return;
						}
						res = result.rows;

						if (res.length > 0) {
							response.success = false;

							console.log('sikertelen regisztráció');
							return;
						} else {
							connection.execute(
								`INSERT INTO   companies (username, password, address, webpage, details)  VALUES('${newCompany.username}', '${newCompany.password}', '${newCompany.address}', '${newCompany.webpage}', '${newCompany.details}')`,
								{ autoCommit: true },
								function(err, result) {
									if (err) {
										console.error(err);
										return;
									}
									// res = result.rows;
								}
							);
							response.success = true;
							console.log('sikeres regisztráció');
						}
					}
				);
			}
		}
	);
	res.json(response);
	// console.log(req.body);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
