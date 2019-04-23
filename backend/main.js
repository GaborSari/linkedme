const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const oracledb = require('oracledb');
var connection = undefined;
oracledb.outFormat = oracledb.OBJECT;
oracledb.autoCommit = true;
oracledb.getConnection(
	{
		user: 'h776447',
		password: 'h776447',
		connectString:
			'(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 4000))(CONNECT_DATA =(SID= kabinet)))'
	},
	function(err, _connection) {
		if (err) {
			console.error(err);
			return;
		} else {
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
app.post('/login', function(req, response) {
	let responseObject = {};
	let un = req.body.username;
	let pw = req.body.password;
	let sql = `SELECT username, password FROM seekers where USERNAME = '${un}'`;

	let isCompany = false;
	if (req.body.company != undefined && req.body.company == true) {
		isCompany = true;
		sql = `SELECT username, password FROM companies where USERNAME = '${un}'`;
	}

	connection.execute(sql, (err, result) => {
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

app.get('/jobs', function(req, response) {
	let arr = [];
	// let sql = `SELECT name as JOBNAME, name as COMPANYNAME, starts, salary, phone FROM jobs, companies, hrs
	//  where companies.id = jobs.companyid and jobs.hr = hrs.id`;

	let sql = `SELECT jobs.name as JOBNAME, companies.name as COMPANYNAME, starts,ends, salary, phone, hrs.name as HRNAME FROM jobs, companies, hrs
	 where companies.id = jobs.companyid and jobs.hr = hrs.id`;

	connection.execute(sql, (err, result) => {
		if (err) {
			console.error(err);
			return;
		}
		if (result.rows.length > 0) {
			for (let i of result.rows) {
				let responseObject = {};
				responseObject.jobname = i.JOBNAME;
				responseObject.companyname = i.COMPANYNAME;
				responseObject.starts = i.STARTS;
				responseObject.ends = i.ENDS;
				responseObject.salary = i.SALARY;
				responseObject.hrphone = i.PHONE;
				responseObject.hrname = i.HRNAME;
				arr.push(responseObject);
			}
		} else {
			responseObject = null;
		}
		console.log(arr);

		response.json(arr);
	});
});

app.post('/addjob', function(req, response) {
	let nw = {};
	let sql = '';
	let insert = '';
	let responseObject = {};
	nw.jobname = req.body.name;
	nw.address = req.body.address;
	nw.starts = req.body.starts;
	nw.ends = req.body.ends;
	nw.salary = req.body.salary;
	nw.maxApplication = req.body.maxApplication;
	nw.companyUsername = req.body.companyUsername;

	sql = `select id from companies where username = '${nw.companyUsername}'`;

	connection.execute(sql, (err, result) => {
		if (err) {
			console.error(err);
			return;
		}
		nw.companyId = result.rows[0];
		insert = `INSERT INTO jobs (name, companyid, address, starts, ends, salary, maxapplication)  VALUES('${nw.jobname}', '${nw.companyId}', '${nw.address}', '${nw.starts}', '${nw.ends}', '${nw.salary}', '${nw.maxApplication}')`;

		connection.execute(insert, function(err, result) {
			if (err) {
				console.error(err);
				return;
			} else {
				responseObject.success = true;
				response.json(responseObject);
			}
		});
	});
});

app.post('/registration', function(req, response) {
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
		insert = `INSERT INTO seekers (username, password, birth, name, cv)  VALUES('${nw.username}', '${nw.password}', TO_DATE('${nw.birth}','yyyy-mm-dd'), '${nw.name}', utl_raw.cast_to_raw('${nw.cv}'))`;
	} else {
		nw.isCompany = req.body.isCompany;
		nw.address = req.body.address;
		nw.webpage = req.body.webpage;
		nw.details = req.body.details;
		sql = `SELECT username FROM companies where USERNAME = '${nw.username}'`;
		insert = `INSERT INTO companies (username, password, address, webpage, details)  VALUES('${nw.username}', '${nw.password}', '${nw.address}', '${nw.webpage}', '${nw.details}')`;
	}
	connection.execute(sql, (err, result) => {
		if (err) {
			console.error(err);
			return;
		}
		if (result.rows.length > 0) {
			responseObject.success = false;
			response.json(responseObject);
			return;
		}

		connection.execute(insert, function(err, result) {
			if (err) {
				console.error(err);
				return;
			} else {
				responseObject.success = true;
				response.json(responseObject);
			}
		});
	});
});
