const ProductDocument = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const { price } = req.query;
  const priceQuery = { $gte: Number(price) };
  const products = await ProductDocument.find({ price: priceQuery });
  res.status(200).json({ hits: products.length, products });
};

const getAllProducts = async (req, res) => {
  const queryObject = {};
  const { featured, company, name, sort, fields, numericFilters } = req.query;

  // searching logic
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  if (company) {
    queryObject.company = { $regex: company, $options: "i" };
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    const regEx = /\b(<|>|=|>=|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    console.log(filters);

    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  let result = ProductDocument.find(queryObject);

  // sorting logic
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  // selecting logic
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  // pagination logic
  const pageNumber = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (pageNumber - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;

  res.status(200).json({ hits: products.length, products });
};

module.exports = { getAllProducts, getAllProductsStatic };
