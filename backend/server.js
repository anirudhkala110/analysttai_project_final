const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 8096;

app.use(express.json());

// Use cors middleware with default options to allow requests from all origins
app.use(cors());

// Define a route to get user data
app.get('/api/users', (req, res) => {
    axios.get('https://jsonplaceholder.typicode.com/users')
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.listen(port, () => {
    console.log(`App is running at port ${port}`);
});
