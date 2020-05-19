const categories = require("../static-data/categories.json");

exports.getCategories = (req, res, next) => {
  if (categories) {
    res.status(200).json({ categories: categories });
  } else {
    res
      .status(500)
      .json({ message: "לא הצלחנו לטעון את הקטגוריות, נסו להשתמש בחיפוש" });
  }
};
