const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const moviesRouter = require('./routes/movies');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/movies', moviesRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
