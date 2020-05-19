const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

exports.createNewUser = (req, res, next) => {
  if (
    !isNewUserValid(
      req.body.firstName,
      req.body.lastName,
      req.body.phone,
      req.body.email,
      req.body.password
    )
  ) {
    return res.status(500).json({
      message:
        "אחד הפרטים שהוכנסו לא היה תקין, ודאו כי כל הפרטים שהכנסתם תקינים ונסו שוב"
    });
  } else {
    bcrypt.hash(req.body.password, 10).then(hash => {
      const newUser = new User({
        _id: null,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        password: hash
      });
      newUser
        .save()
        .then(newUser => {
          const token = jwt.sign(
            { email: newUser.email, userId: newUser._id },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );

          return res.status(201).json({
            message: "המשתמש נוצר בהצלחה",
            token: token,
            expiresIn: 3600,
            userId: newUser._id
          });
        })
        .catch(err => {
          console.log(err);
          return res.status(500).json({
            message: "לא הצלחנו ליצור את המשתמש, נסו שוב או פנו אלינו לתמיכה"
          });
        });
    });
  }
};

exports.loginUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "שם המשתמש או הסיסמא אינם נכונים" });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res
          .status(401)
          .json({ message: "שם המשתמש או הסיסמא אינם נכונים" });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: "לא הצלחנו לחבר אתכם, נסו שוב או פנו אלינו לתמיכה"
      });
    });
};

isNewUserValid = (firstName, lastName, phone, email, password) => {
  return (
    password &&
    password.length &&
    firstName &&
    firstName.length > 0 &&
    lastName &&
    lastName.length > 0 &&
    isEmailValid(email) &&
    isPhoneValid(phone)
  );
};

isPhoneValid = phone => {
  if (!phone) return false;
  const regex = /^[0][5][0|2|3|4|5|9]{1}[-]{0,1}[0-9]{7}$/g;
  return phone.match(regex) !== null;
};

isEmailValid = email => {
  if (!email) return false;
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gim;
  return email.match(regex) !== null;
};

exports.loginUserWithGoogle = async (req, res, next) => {
  console.log(req.body.code);
  code = req.body.code;
  const { data } = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id:
        "922272879107-ihaoe7jp61l2n0o6616lr7l84uc2ut2v.apps.googleusercontent.com",
      client_secret: "NBlPa6PUfWPYLdxLKxMoC46R",
      redirect_uri: "http://localhost:4200",
      grant_type: "authorization_code",
      code
    }
  });

  if (data && data.access_token) {
    return data.access_token;
  } else {
    return null;
  }
};
