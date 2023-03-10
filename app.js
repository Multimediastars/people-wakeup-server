require('dotenv').config()
const cors = require('cors')
const express = require('express')
const { connectedDB } = require('./database/mongoDB.config')
const app = express()
const path = require('path')

//Conectando a DB
connectedDB()

//Middlewares
app.use(cors())
app.use(express.json());
app.use(express.static('public'));


//Routes
app.use('/api/auth', require('./routes/user.route'))
app.use('/api/news', require('./routes/news.route'))


app.get('*', (req, res) => {                       
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));                               
  });


app.listen(process.env.PORT, ()=> {
    console.log(`Server listen on port`, process.env.PORT)
})