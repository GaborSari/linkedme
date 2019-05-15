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
	function (err, _connection) {
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
app.post('/login', function (req, response) {
	let responseObject = {};
	let un = req.body.username;
	let pw = req.body.password;
	let sql = `SELECT username,name, password, id FROM seekers where USERNAME = '${un}'`;

	let isCompany = false;
	if (req.body.company != undefined && req.body.company == true) {
		isCompany = true;
		sql = `SELECT username,name, password, id FROM companies where USERNAME = '${un}'`;
	}

	connection.execute(sql, (err, result) => {
		if (err) {
			console.error(err);
			return;
		}
		if (result.rows.length > 0 && un == result.rows[0].USERNAME && pw == result.rows[0].PASSWORD) {
			responseObject.success = true;
			responseObject.name = result.rows[0].NAME;
			responseObject.username = un;
			responseObject.id = result.rows[0].ID;
			responseObject.isCompany = isCompany;
			if(!isCompany){
				let sql = `UPDATE seekers SET lastActive = sysdate where id = ${responseObject.id}`;
				connection.execute(sql, (err, result) => {

				});

			}
		} else {
			responseObject.success = false;
		}
		response.json(responseObject);
	});
});

app.get('/jobs', function (req, response) {
	let arr = [];
	// let sql = `SELECT name as JOBNAME, name as COMPANYNAME, starts, salary, phone FROM jobs, companies, hrs
	//  where companies.id = jobs.companyid and jobs.hr = hrs.id`;

	let sql = `SELECT jobs.name as JOBNAME, jobs.id, companies.name as COMPANYNAME, companies.id as COMPANYID, starts,ends, salary, phone, hrs.name as HRNAME, ctags.tags FROM jobs, companies, hrs,

	(SELECT LISTAGG(tags.name,',')  WITHIN GROUP (order by tags.name) as tags,  jobs.id
	FROM jobtags,tags,jobs
	WHERE tags.id = jobtags.tagid and jobtags.jobid = jobs.id
	group by jobs.id
	) ctags
	where companies.id = jobs.companyid and jobs.hr = hrs.id and ctags.id = jobs.id
	
	
	`;

	connection.execute(sql, (err, result) => {
		if (err) {
			console.error(err);
			return;
		}
		if (result.rows.length > 0) {
			for (let i of result.rows) {
				let responseObject = {};
				responseObject.id = i.ID;
				responseObject.jobname = i.JOBNAME;
				responseObject.companyname = i.COMPANYNAME;
				responseObject.starts = i.STARTS;
				responseObject.ends = i.ENDS;
				responseObject.salary = i.SALARY;
				responseObject.hrphone = i.PHONE;
				responseObject.hrname = i.HRNAME;
				responseObject.tags = i.TAGS;
				responseObject.companyid = i.COMPANYID;
				arr.push(responseObject);
			}
		} else {
			responseObject = null;
		}

		response.json(arr);
	});
});

app.post('/addjob', function (req, response) {
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
	nw.companyid = req.body.companyid;




	insert = `INSERT INTO jobs (name, companyid, address, starts, ends, salary, maxapplication,hr) VALUES('${nw.jobname}', ${nw.companyid}, '${nw.address}', TO_DATE('${nw.starts}','yyyy-mm-dd'), TO_DATE('${nw.ends}','yyyy-mm-dd'), ${nw.salary}, ${nw.maxApplication},1)`;
	connection.execute(insert, (err, result) => {
		connection.execute(`SELECT * FROM (SELECT * FROM jobs ORDER BY id DESC	) WHERE ROWNUM = 1`, async function (err, jobresult) {
			for (let tag of req.body.tags.split(',')) {
				let taginsert = `insert into tags (name) values('${tag}')`;

				await new Promise(async function (resolve, reject) {
					connection.execute(taginsert, (err, x) => {
						let selectlasttag = 'SELECT * FROM (SELECT * FROM tags ORDER BY id DESC	) WHERE ROWNUM = 1';
						connection.execute(selectlasttag, (err, tagresult) => {
							let jobtaginsert = `insert into jobtags (jobid,tagid) values(${jobresult.rows[0].ID},${tagresult.rows[0].ID})`;
							connection.execute(jobtaginsert, (err, result) => {
								if (!err) {
									resolve();

								}
							});
						});
					});


				});
			}
			responseObject.success = true;
			response.json(responseObject);
			return;
		});
	});


});

app.post('/registration', function (req, response) {
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

		connection.execute(insert, function (err, result) {
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





app.post('/application', function (req, response) {
	let responseObject = {};
	let jobid = req.body.jobid;
	let seekerid = req.body.seekerid;
	let comment = req.body.comment;
	let sql = `INSERT INTO applications (jobid,seekerid,text) values (${jobid},${seekerid},'${comment}')`;

	connection.execute(sql, (err, result) => {
		if (err) {
			console.error(err);
			responseObject.success = false;
			response.json(responseObject);
			return;
		}
		else {
			responseObject.success = true;
			response.json(responseObject);
		}

	});
});




app.post('/myapplications', function (req, response) {
	let responseObject = {};
	let seekerid = req.body.seekerid;
	let sql = `SELECT accepted, jobs.name as jname  FROM applications, jobs WHERE seekerid = ${seekerid} and jobs.id = jobId`;

	connection.execute(sql, (err, result) => {
		if (err) {
			console.error(err);
			responseObject.success = false;
			response.json(responseObject);
			return;
		}
		else {
			responseObject.success = true;
			responseObject.applications = result.rows;
			response.json(responseObject);
		}

	});
});



app.post('/incomingapplications', function (req, response) {
	let responseObject = {};
	let companyid = req.body.companyid;

	let sql = `SELECT applications.id ,applications.accepted as "status", seekers.name as "sname", jobs.name as "jname", utl_raw.cast_to_varchar2(seekers.cv) as "cv", applications.text as "comment" FROM applications,seekers,jobs WHERE jobid IN (select id from jobs where companyId = ${companyid}) and seekers.id = seekerid and jobs.id = jobid`;
	connection.execute(sql, (err, result) => {
		if (err) {
			console.error(err);
			responseObject.success = false;
			response.json(responseObject);
			return;
		}
		else {
			responseObject.success = true;
			responseObject.applications = result.rows;
			response.json(responseObject);
		}

	});
});



app.post('/decideapplication', function (req, response) {
	let responseObject = {};
	let application = req.body.application;
	let status = req.body.status;
	let sql = `UPDATE applications SET accepted = ${status} where id = ${application}`;
	connection.execute(sql, (err, result) => {
		if (err) {
			console.error(err);
			responseObject.success = false;
			response.json(responseObject);
			return;
		}
		else {
			responseObject.success = true;
			response.json(responseObject);
		}

	});
});


app.post('/deletejob', function (req, response) {
	let responseObject = {};
	let jobid = req.body.jobid;
	let sql = `DELETE from applications where jobId = ${jobid}`;
	connection.execute(sql, (err, result) => {
		if (err) {
			console.error(err);
			responseObject.success = false;
			response.json(responseObject);
			return;
		}
		else {
			let sql = `DELETE from jobtags where jobId = ${jobid}`;
			connection.execute(sql, (err, result) => {
				if (err) {
					console.error(err);
					responseObject.success = false;
					response.json(responseObject);
					return;
				}
				else {
					let sql = `DELETE from jobs where id = ${jobid}`;
					connection.execute(sql, (err, result) => {
						if (err) {
							console.error(err);
							responseObject.success = false;
							response.json(responseObject);
							return;
						}
						else {
							responseObject.success = true;
							response.json(responseObject);
						}

					});
				}

			});


		}

	});
});


