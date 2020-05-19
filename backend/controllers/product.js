const Product = require("../models/product");
const Store = require("../models/store");
var ObjectId = require("mongoose").Types.ObjectId;
const measureUnitsFile = require("../static-data/measureUnits.json");
const image = require("../helpers/image");

exports.updateProduct = async (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    uploadProductImage(req.file).then(
      result => {
        if (result && result.imagePath) {
          imagePath = result.imagePath;
        }
      },
      err => {
        console.log(err);
        res.status(500).json({
          message: "לא ניתן היה לעדכן את המוצר, אנא נסה שוב מאוחר יותר"
        });
      }
    );
  }

  ownerId = new Object(req.body.userId);
  Store.findOne({ ownerId: ownerId }).then(store => {
    if (!store) {
      res
        .status(500)
        .json({ message: "לא ניתן לעדכן את המוצר, אנא פנו לתמיכה" });
    } else {
      const product = new Product({
        _id: req.body.id,
        name: req.body.name,
        content: req.body.content,
        price: req.body.price,
        measureUnit: req.body.measureUnit,
        imagePath: imagePath,
        store: store._id
      });

      productId = new Object(req.body.id);
      Product.updateOne({ _id: productId, store: store._id }, product)
        .then(newProduct => {
          res.status(201).json({
            message: "המוצר נוסף בהצלחה"
          });
        })
        .catch(err => {
          res.status(500).json({ message: "לא ניתן היה לעדכן את המוצר" });
        });
    }
  });
};

exports.createProduct = (req, res, next) => {
  image.uploadImage(req.file, "products").then(
    result => {
      ownerId = new Object(req.body.userId);
      Store.findOne({ ownerId: ownerId }).then(store => {
        if (!store) {
          res
            .status(500)
            .json({ message: "לא ניתן ליצור את המוצר, אנא פנו לתמיכה" });
        } else {
          const product = new Product({
            _id: null,
            name: req.body.name,
            content: req.body.content,
            imagePath: result.imagePath,
            price: req.body.price,
            measureUnit: req.body.measureUnit,
            store: new Object(store._id)
          });
          product
            .save()
            .then(newProduct => {
              res.status(201).json({
                message: "המוצר נוסף בהצלחה",
                post: {
                  ...newProduct,
                  _id: newProduct._id
                }
              });
            })
            .catch(err => {
              res.status(500).json({ message: "לא ניתן היה ליצור את המוצר" });
            });
        }
      });
    },
    err => {
      console.log(err);
      res.status(500).json({
        message: "לא הצלחנו להעלות את התמונה, אנא נסה שוב מאוחר יותר"
      });
    }
  );
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.status(200).json({ products: products });
    })
    .catch(err => {
      res.status(500).json({ message: "לא הצלחנו ליצור את המוצר, נסו שוב" });
    });
};

exports.getProductById = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res
      .status(404)
      .json({ message: "לא ניתן לערוך את פרטי המוצר, נסו שוב מאוחר יותר" });
  } else {
    Product.findById(req.params.id)
      .then(product => {
        res.status(200).json({ product: product });
      })
      .catch(err => {
        res
          .status(404)
          .json({ message: "לא ניתן לערוך את פרטי המוצר, נסו שוב מאוחר יותר" });
      });
  }
};

exports.getProductsByIDs = (req, res, next) => {
  if (!req.params.ids) {
    return null;
  }

  ids = req.body.ids.map(id => {
    return ObjectId(id);
  });

  Product.find({
    _id: { $in: ids }
  })
    .then(products => {
      res.status(200).json({ products: products });
    })
    .catch(err => {
      res.status(500).json({
        message: "לא הצלחנו לטעון את המוצרים, נסו שוב בעוד מספר דקות"
      });
    });
};

exports.getStoreProducts = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(200).json();
  } else {
    Product.find({ store: new ObjectId(req.params.id) })
      .then(products => {
        res.status(200).json({ products: products });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: "לא הצלחנו לטעון את המוצרים, נסו שוב בעוד מספר דקות"
        });
      });
  }
};

exports.getMeasureUnits = (req, res, next) => {
  if (measureUnitsFile) {
    res.status(200).json({ measureUnits: measureUnitsFile });
  } else {
    res.status(500).json();
  }
};
