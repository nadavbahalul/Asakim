const Store = require("../models/store");
const image = require("../helpers/image");
ObjectId = require("mongoose").Types.ObjectId;

function isStoreValid(req) {
  return (
    !req.body.ownerId ||
    !req.body.name ||
    !req.body.name.length ||
    !req.file ||
    !req.body.description ||
    !req.body.description.length ||
    !req.body.deliveryArea ||
    !req.body.deliveryArea.length ||
    !req.body.category
  );
}
function getStoreFromReq(req, result) {
  return new Store({
    _id: null,
    ownerId: req.body.ownerId,
    name: req.body.name,
    imagePath: result.imagePath,
    description: req.body.description,
    deliveryArea: req.body.deliveryArea,
    category: req.body.category
  });
}

exports.createStore = (req, res, next) => {
  if (isStoreValid(req)) {
    return res.status(500).json({
      message: "חלק מהנתונים שהוכנסו לא תקינים, נסו ליצור את החנות מחדש"
    });
  } else {
    console.log(req.body.ownerId);
    Store.findOne({ ownerId: req.body.ownerId }).then(store => {
      if (store) {
        return res.status(500).json({
          message: "לא ניתן ליצור יותר מחנות אחת"
        });
      } else {
        image.uploadImage(req.file, "stores").then(
          result => {
            const store = getStoreFromReq(req, result);
            store
              .save()
              .then(() => {
                return res.status(201).json({
                  message: "החנות נוספה בהצלחה"
                });
              })
              .catch(err => {
                return res
                  .status(500)
                  .json({ message: "לא ניתן היה להוסיף החנות" });
              });
          },
          err => {
            console.log(err);
            return res.status(500).json({
              message: "לא הצלחנו להעלות את התמונה, אנא נסה שוב מאוחר יותר"
            });
          }
        );
      }
    });
  }
};

exports.getStores = (req, res, next) => {
  Store.find()
    .then(stores => {
      return res.status(200).json({ stores: stores });
    })
    .catch(err => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "לא הצלחנו לטעון את החנויות, נסו שוב מאוחר יותר" });
    });
};

exports.getStore = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res
      .status(404)
      .json({ message: "לא הצלחנו להכניס אתכם לחנות, נסו שוב יותר מאוחר" });
  } else {
    Store.findById(req.params.id)
      .then(store => {
        return res.status(200).json({ store: store });
      })
      .catch(err => {
        console.log(err);
        return res
          .status(500)
          .json({ message: "לא הצלחנו להכניס אתכם לחנות, נסו שוב יותר מאוחר" });
      });
  }
};
