const express = require('express');
const mongoose = require('mongoose');
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/src/models/config")[env];

const app = express();

// for deprecated
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// connect to db
mongoose.connect(config.DB.URI)
  .then(() => console.log('Connected to DB'))
  .catch(err => console.log(err));

// import routes
const auth = require('./src/routes/auth');

// settings
app.set('port', process.env.PORT || 3000);

// middlewares
app.use(express.urlencoded({extended: false}))

// routes
app.use('/auth', auth)

app.listen(app.get('port'), () => {
  console.log(`Server is listening at ${app.get('port')}`)
})
