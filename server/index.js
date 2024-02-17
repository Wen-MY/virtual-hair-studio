const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const sessionExpirationMiddleware = require('./src/api/middleware/session');
const userRoutes = require('./src/api/routes/userRoutes');
const authorizationRoutes = require('./src/api/routes/authorizationRoutes');
const menuRoutes = require('./src/api/routes/menuRoutes');
const appointmentRoutes = require('./src/api/routes/appointmentRoutes');
const serviceRoutes = require('./src/api/routes/serviceRoutes');
const hairstylistRoutes = require('./src/api/routes/hairstylistRoutes');
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
app.use(sessionExpirationMiddleware.checkSessionExpiration);

app.use('/user',userRoutes);
app.use('/auth',authorizationRoutes)
app.use('/menu',menuRoutes);
app.use('/appointment',appointmentRoutes);
app.use('/service',serviceRoutes);
app.use('/hairstylist',hairstylistRoutes);

const port = 4000;
const server = app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
