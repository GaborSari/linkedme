const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
const port = 3000;

app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:4200'
	})
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// GET method route
app.get('/', function(req, res) {
	res.send('asd');
});

// POST method route
app.post('/', function(req, res) {
	console.log(req.body.username);
});

app.post('/registration', function(req, res) {
	console.log(req.body.username);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
