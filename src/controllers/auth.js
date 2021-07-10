const jwt = require('jsonwebtoken');
const User = require('../models/users');
const config = require('../config/env');

// auth controller class
class AuthController {
  async login(req, res) {
    const {email, password} = req.body;

    const user = await User.findOne({
      email: email
    });

    const passwordMatch = await User.comparePasswords(password, user.password);

    if (!user || !passwordMatch) {
      res.status(400).send({error: 'Invalid user or password.'});
    } else {
      const token = jwt.sign({id: user._id}, config.JWT.SECRET_KEY, {
        expiresIn: (60 * 60) //expires in an hour
      });
      res.send({token: token} );
    }
  }

  async signUp(req, res) {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
      res.status(400).send({error: 'Name, email and password are required.'})
    }

    // check if user already exists
    const userExists = await User.findOne({
      email: email
    });

    if (userExists) {
      res.status(400).send({error: `User with email '${email}' already exists.`});
    }

    // if not exist, create a new user
    const newUser = new User({
      name: name,
      email: email,
      password: await User.encryptPassword(password)
    });

    // save created user to db
    const insertedUser = await newUser.save();

    // return userId
    res.send({
      userId: insertedUser._id
    })
  }
}

module.exports = AuthController;
