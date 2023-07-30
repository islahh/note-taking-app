const auth_messages = require('../../../../config/responses/res_msg_user');
const db = require('../../../models')
const User = db.user
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const { logger } = require('../../../services/logger')
const { validateEmail } = require('../../../services/utility')

/* The `exports.register` function is responsible for handling the registration of a user. */
exports.register = async (req, res) => {
  try {
    if (req.body.name == null || req.body.name == '') return res.status(400).json(auth_messages.name_is_required)
    if (req.body.email == null || req.body.email == '') return res.status(400).json(auth_messages.email_is_required)
    if (!validateEmail(req.body.email)) return res.status(400).json(auth_messages.email_is_invalid)
    if (req.body.password == null || req.body.password == '') return res.status(400).json(auth_messages.password_is_required)

    let request_data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }

    const saltRounds = 10
    request_data.password = await bcrypt.hash(request_data.password, saltRounds)



    let user = await User.findOne({ where: { email: request_data.email } })
    if (user) return res.status(400).json(auth_messages.email_already_exists)

    user = await User.create(request_data)
    if (!user) return res.status(400).json(auth_messages.user_registration_failed)

    res.status(200).json(auth_messages.user_registration_success)
  } catch (error) {
    logger.error("Error while registering user:", { context: error })
    res.status(500).json(auth_messages.server_error)
  }
};



/* The `exports.login` function is responsible for handling the login functionality. */
exports.login = async (req, res) => {
  try {
    if (req.body.email == null || req.body.email == '') return res.status(400).json(auth_messages.email_is_required)
    if (req.body.password == null || req.body.password == '') return res.status(400).json(auth_messages.password_is_required)

    let request_data = {
      email: req.body.email,
      password: req.body.password
    }

    let user = await User.findOne({ where: { email: request_data.email } })
    if (!user) return res.status(400).json(auth_messages.invalid_email_or_password)

    // Validating the password.
    const valid_password = await bcrypt.compare(request_data.password, user.password);
    if (!valid_password) return res.status(400).json(auth_messages.invalid_email_or_password)


    /* Generating a JSON Web Token (JWT) for authentication purposes. */
    const token = jwt.sign(
      { username: user.name, id: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    let response = auth_messages.success
    response.data = {
      id: user.id,
      name: user.name,
      email: user.email,
      token
    }

    res.status(200).json(response)
  } catch (error) {
    logger.error("Error while login:", { context: error })
    res.status(500).json(auth_messages.server_error)
  }
};