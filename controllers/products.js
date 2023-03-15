import { response } from 'express';
import { Product } from '../models/index.js';

const getProducts = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .skip(from)
      .limit(limit)
      .populate('user', 'name')
      .populate('category', 'name'),
  ]);

  res.json({
    total,
    products,
  });
};

const getProduct = async (req, res = response) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate('user', 'name')
    .populate('category', 'name');

  res.json(product);
};

const createProduct = async (req, res = response) => {
  const { status, user, ...body } = req.body;

  const data = {
    ...body,
    name: body.name.toUpperCase(),
    user: req.user._id,
  };

  const product = new Product(data);

  // save in db
  await product.save();

  res.status(201).json(product);
};

const updateProduct = async (req, res = response) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  if (data.name) data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const product = await Product.findByIdAndUpdate(id, data, { new: true });

  res.status(200).json(product);
};

const deleteProduct = async (req = request, res = response) => {
  const { id } = req.params;

  // Change user state
  const product = await Product.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.json(product);
};

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
