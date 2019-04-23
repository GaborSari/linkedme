const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;

var oracledb = require('oracledb');
oracledb.getConnection(
	{
		user: 'h652913',
		password: 'h652913',
		connectString: 'hostname:orania.inf.u-szeged.hu' // ez nemtom jó-e
	},
	function(err, connection) {
		if (err) {
			console.error(err);
			return;
		}
		connection.execute('SELECT *' + 'FROM jobs ', function(err, result) {
			if (err) {
				console.error(err);
				return;
			}
			console.log(result.rows);
		});
	}
);

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
	console.log(req.body);
});

app.post('/registration', function(req, res) {
	console.log(req.body);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
