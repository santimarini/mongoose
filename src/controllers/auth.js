const User = require('../models/users');

// auth controller class
class AuthController {
  async login(req, res) {
    const {email, password} = req.body;

    const user = await User.findOne({
      email: email,
      password: password
    });

    if (!user) {
      res.status(400).send({body: "Invalid user or password."});
    } else {
      const token = '';
      res.send(token);
    }
  }

  async signUp(req, res) {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
      res.status(400).send({body: "Name, email and password are required."})
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
