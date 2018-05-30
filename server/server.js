const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
// Heroku sets process.env.PORT variable
const port = process.env.PORT || 3000;
const app = express();

// Serves static assets
app.use(express.static(publicPath));

app.listen(port, () => {
	console.log(`Started on port ${port}`);
})