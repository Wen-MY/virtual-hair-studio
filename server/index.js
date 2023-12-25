const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const database = require('./db-config');
app.use(bodyParser.json);
app.use(bodyParser.urlencoded({extended:false}))

const corsOptions = {
    origin: '*',
    credential: true,
    optionSucessStatus: 200
}

app.use(cors(corsOptions))

const port = 4000
const server = app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})