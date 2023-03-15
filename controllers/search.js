import { response } from 'express';
import { isObjectIdOrHexString, Types } from 'mongoose';
import { Category, Product, User } from '../models/index.js';

const allowedCollections = ['categories', 'products', 'roles', 'users'];

const searchUsers = async (query = '', res = response) => {
  const isMongoID = isObjectIdOrHexString(query);

  if (isMongoID) {
    const user = await User.findById(query);
    return res.json({
      results: user ? [user] : [],
    });
  }

  // serach by name / email
  // Regular expresion for case insensitive and more flexibility
  const regex = new RegExp(query, 'i');

  // const users = await User.find({
  //   $or: [{ name: regex }, { email: regex }],
  //   $and: [{ state: true }],
  // });

  const [total, users] = await Promise.all([
    User.countDocuments({
      $or: [{ name: regex }, { email: regex }],
      $and: [{ state: true }],
    }),
    User.find({
      $or: [{ name: regex }, { email: regex }],
      $and: [{ state: true }],
    }),
  ]);

  return res.json({
    total,
    results: users,
  });
};

const searchCategories = async (query = '', res = response) => {
  const isMongoID = isObjectIdOrHexString(query);

  if (isMongoID) {
    const category = await Category.findById(query);
    return res.json({
      results: category ? [category] : [],
    });
  }

  // serach by name / email
  const regex = new RegExp(query, 'i');

  const [total, categories] = await Promise.all([
    Category.countDocuments({ name: regex, status: true }),
    Category.find({ name: regex, status: true }),
  ]);

  return res.json({
    total,
    results: categories,
  });
};

const searchProducts = async (query = '', res = response) => {
  const isMongoID = isObjectIdOrHexString(query);

  if (isMongoID) {
    const product = await Product.findById(query)
      .populate('category', 'name')
      .populate('user', 'name');
    return res.json({
      results: product ? [product] : [],
    });
  }

  // serach by name / email
  const regex = new RegExp(query, 'i');

  const [total, products] = await Promise.all([
    Product.countDocuments({ name: regex, status: true }),
    Product.find({ name: regex, status: true })
      .populate('category', 'name')
      .populate('user', 'name'),
  ]);

  return res.json({
    total,
    results: products,
  });
};

const search = (req, res = response) => {
  const { collection, query } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Not a valid category, those are [ ${allowedCollections} ]`,
    });
  }

  switch (collection) {
    case 'categories':
      searchCategories(query, res);
      break;
    case 'products':
      searchProducts(query, res);
      break;
    case 'users':
      searchUsers(query, res);
      break;

    default:
      res.status(500).json({
        msg: 'This query was not included in server',
      });
  }
};

const searchProductsByCategory = async (req, res = response) => {
  const { category } = req.params;

  const [total, products, catego] = await Promise.all([
    Product.countDocuments({
      category: Types.ObjectId(category),
      status: true,
    }),
    Product.find({ category: Types.ObjectId(category), status: true }),
    Category.findById(category),
  ]);

  return res.json({
    total,
    category: catego,
    results: products,
  });
};

export { search, searchProductsByCategory };
