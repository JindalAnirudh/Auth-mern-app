const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
require('dotenv').config();

require('./Models/db');

const PORT = process.env.PORT || 8000;

// Middleware MUST come before routes
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        message: "Internal Server Error",
        success: false
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
