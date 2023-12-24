require('dotenv').config()
require('express-async-errors')
const express = require('express')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const sequelize = require('./config/dbConn');
const credentials = require('./middleware/credentials')
const app = express()
const port = process.env.PORT || 3500



const corsConfig = {
  origin:true,
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(credentials)
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://resonant-faun-ce409d.netlify.app/");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials
  next();
});

const server = require('http').createServer(app)

app.use('/auth', require('./routes/authRoutes'))
app.use('/register', require('./routes/register.js'))
app.use('/users', require('./routes/userRoutes.js'))

app.use(errorHandler)

sequelize.authenticate()
  .then(() => {
    console.log('🔗 Successfully connected to MySQL database');  

    server.listen(port, () => {
      console.log(`🚀 Server ready at http://localhost:${port}`);
    });

    sequelize.sync()  
      .then(() => console.log('Database synced'))  
      .catch(err => console.error('Failed to sync database',err));

  })
  .catch(err => {
    console.error('Unable to connect to database:', err);
  });
