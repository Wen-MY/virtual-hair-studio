const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const sessionExpirationMiddleware = require('./src/api/middleware');
const userRoutes = require('./src/api/routes/userRoutes');
const authorizationRoutes = require('./src/api/routes/authorizationRoutes');
const appointmentRoutes = require('./src/api/routes/appointmentRoutes');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(session({
    secret: 'vhs@123',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 365 * 24 * 60 * 60, //1 day in milliseconds
      httpOnly: true,
    },
  }));
// Use the sessionExpirationMiddleware for all routes
//app.use(sessionExpirationMiddleware);

app.use('/user',userRoutes);
app.use('/auth',authorizationRoutes)
app.use('/appointment',appointmentRoutes);

const port = 4000;
const server = app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
