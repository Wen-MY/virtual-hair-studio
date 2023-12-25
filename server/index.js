const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session'); 
const userRoutes = require('./src/api/routes/userRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(
    session({
        secret: 'vhs@123',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // true if using HTTPS
    })
);

app.use('/user',userRoutes);

const port = 4000;
const server = app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});