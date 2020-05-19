const Store = require("../models/store");
const Product = require("../models/product");
const Order = require("../models/order");
const nodemailer = require("nodemailer");

exports.newOrder = (req, res, next) => {
  const { firstName, lastName, email, phone, adress, cart } = req.body;
  validateOrder(firstName, lastName, email, phone, adress, cart).then(
    isValid => {
      if (!isValid) {
        res.status(501).json({ message: "לא הצלחנו לשמור את ההזמנה, נסו שוב" });
      } else {
        var products = [];
        var amounts = [];
        var totalPrice = 0;

        for (item of Object.values(cart.items)) {
          products.push(item.product._id);
          amounts.push(item.amount);
          totalPrice += item.product.price * item.amount;
        }

        const order = new Order({
          _id: null,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          adress: adress,
          store: cart.storeId,
          products: products,
          amounts: amounts,
          totalPrice: totalPrice
        });
        order
          .save()
          .then(order => {
            sendMailToClient(order);
            res.status(200).json({
              message:
                "ההזמנה בוצעה בהצלחה, נשלח אישור הזמנה במייל וסמס בדקות הקרובות :)"
            });
          })
          .catch(err => {
            console.log(err);
            res
              .status(501)
              .json({ message: "לא הצלחנו לשמור את ההזמנה, נסו שוב" });
          });
      }
    }
  );
};

validateOrder = async (firstName, lastName, email, phone, adress, cart) => {
  const isValid =
    !firstName ||
    firstName.length <= 1 ||
    (!lastName && lastName.length <= 1) ||
    !validateEmail(email) ||
    !validatePhone(phone) ||
    !validateAdress(adress) ||
    !validateCart(cart);
  return Promise.resolve(isValid);
};

validatePhone = phone => {
  if (!phone) return false;
  const regex = /^[0][5][0|2|3|4|5|9]{1}[-]{0,1}[0-9]{7}$/g;
  return phone.match(regex) !== null;
};

validateEmail = email => {
  if (!email) return false;
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gim;
  return email.match(regex) !== null;
};

validateAdress = adress => {
  return adress !== null;
};

validateCart = cart => {
  if (!cart) return false;
  Store.findById(cart.storeId)
    .then(store => {
      if (!store) return false;
      items = Object.values(cart.items);
      for (item of items) {
        Product.findById(item.product.productId).then(product => {
          if (!product || product.storeId !== storeId) return false;
        });
      }
      return true;
    })
    .catch(err => {
      return false;
    });
};

sendMailToClient = async order => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  generateEmailMessage(order).then(mailContent => {
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: order.email,
      subject: "הזמנתך בAsakim IL",
      html: mailContent
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  });
};

generateEmailMessage = order => {
  return new Promise((resolve, reject) => {
    var orderDetails = "";
    for (product of order.products) {
      orderDetails +=
        "<p style='direction:rtl'>שם המוצר: " +
        item.product.name +
        ", מחיר: " +
        item.product.price +
        ' ש"ח</p>';
    }

    orderDetails +=
      '<p style="direction:rtl"><b>סה"כ: ' + order.totalPrice + ' ש"ח</b></p>';
    orderDetails +=
      "<p style='direction:rtl'>כתובת למשלוח: " + order.adress + "</p>";
    orderDetails += "<p style='direction:rtl'>פלאפון: " + order.phone + "</p>";

    const mailContent =
      "<html lang='HE' style='direction:rtl' dir='rtl'>" +
      "<meta charset='UTF-8'>" +
      "<h1 style='direction:rtl'>שלום " +
      order.firstName +
      " " +
      order.lastName +
      "</h1>" +
      "<h2 style='direction:rtl'>הזמנתך התקבלה ונשלחה למוכר, המוכר יפנה אליך בשעות הקרובות לגבי הזמנתך</h2>" +
      "<h3 style='direction:rtl'>סיכום הזמנתך:</h3>" +
      orderDetails +
      "<h4 style='direction:rtl'>תודה שבחרת להזמין ב " +
      "Asakim IL " +
      " ותמכת בעסקים הקטנים!</h4>" +
      "<h5 style='direction:rtl'>נתראה בפעם הבאה,</h5>" +
      "<h6 style='direction:rtl'>Asakim IL, תמיכה גדולה בעסקים הקטנים</h6>" +
      "</html>";

    resolve(mailContent);
  });
};
