const db = require('../models/index');

// auth controller class
class AuthController {
  async login(req, res) {
    const {email, password} = req.body;

    const user = await db['users'].findOne({
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
}

module.exports = AuthController;
