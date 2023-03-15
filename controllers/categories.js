import { response } from 'express';
import { Category } from '../models/index.js';

// getCategories - paginated - show how many categos are registered - call populate (Mongoose)
const getCategories = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query).skip(from).limit(limit).populate('user', 'name'),
  ]);

  res.json({
    total,
    categories,
  });
};

// getCategory - populate {}
const getCategory = async (req, res = response) => {
  const { id } = req.params;

  const category = await Category.findById(id).populate('user', 'name');

  res.json(category);
};

const createCategory = async (req, res = response) => {
  const name = req.body.name.toUpperCase();

  // generate data to save
  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category(data);

  // save in db
  await category.save();

  res.status(201).json(category);
};

// updateCategory - only name and update
const updateCategory = async (req, res = response) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const category = await Category.findByIdAndUpdate(id, data, { new: true });

  res.status(200).json(category);
};

// deleteCategory - status:false - checkId
const deleteCategory = async (req = request, res = response) => {
  const { id } = req.params;

  // Change user state
  const category = await Category.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.json(category);
};

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
