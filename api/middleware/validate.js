const { check, validationResult } = require('express-validator');;

exports.checkValidationResult = async (req, res, next) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    const { message, code } = result.errors[0].msg
    message??="Validation error"
    code??=400
    return res.status(400).json({ message, code, data: null })
  }

  next()
}


// const registrationRules = [
//   check('name', "Name is required!!!!!!!!!!!").notEmpty(),
//   check('email', "Email is required!!!!!!!!!!!").notEmpty(),
//   check('email', "Email is invalid!!!!!!!!!!!").isEmail(),
//   check('password', { message: "Password is required!!!!!!!!!!!", code: 20 }).notEmpty()
// ];


// const validate = (req, res, next) => {
//   const result = validationResult(req);
//   if (!result.isEmpty()) {
//     return res.status(400).json({ errors: result.errors[0].msg });
//   }
//   next();
// };

// module.exports = { registrationRules, validate };
