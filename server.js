require('dotenv').config();
const express = require('express');
const path = require('path');
const clientRoutes = require('./routes/clientRoutes');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, 'assets')));

app.set('view engine', 'ejs');
app.set('views', 'pages');

app.use(clientRoutes)

app.listen(port, (err) => console.log(err || `Visit http://localhost:${port}/`))