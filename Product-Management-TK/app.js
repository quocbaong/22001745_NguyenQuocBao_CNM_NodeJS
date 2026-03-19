const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const productRoutes = require('./routes/productRoutes');
app.use('/', productRoutes);

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});