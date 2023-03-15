import { Category, Product, Role, User } from '../models/index.js';

/**
 *
 * User validators
 */

// Check if role exists in DB
const isValidRole = async (role = '') => {
  const roleExists = await Role.findOne({ role });
  if (!roleExists) throw new Error(`Role ${role} isn't registered in DB`);
};

// Verify if email already exists
const isRegistered = async (email = '') => {
  const emailExists = await User.findOne({ email });
  if (emailExists)
    throw new Error(`Email: ${email} is already registered in DB`);
};

const userExistsById = async (id = '') => {
  const userExists = await User.findById(id);
  if (!userExists)
    throw new Error(`User with id: ${id} is not registered in DB`);
};

/**
 *
 * Category validators
 */

// Verify if category already exists in DB
const categoryRegistered = async (category = '', { req }) => {
  const name = category.toUpperCase();
  const categoryExists = await Category.findOne({
    name,
  });
  if (categoryExists)
    if (categoryExists._id != req.params.id) {
      throw new Error(`Category: ${name} is already registered in DB`);
    }
};

// Check if category exists in DB
const categoryExistsById = async (id = '') => {
  const category = await Category.findById(id);
  if (!category)
    throw new Error(`Category with id: ${id} is not registered in DB`);
};

/**
 *
 * Product validators
 */

// Verify if product already exists in DB
const productRegistered = async (product = '', { req }) => {
  const name = product.toUpperCase();
  const productExists = await Product.findOne({
    name,
  });

  if (productExists) {
    if (productExists._id != req.params.id) {
      throw new Error(`Product: ${name} is already registered in DB`);
    }
  }
};

// Check if product exists in DB
const productExistsById = async (id = '') => {
  const product = await Product.findById(id);
  if (!product)
    throw new Error(`Product with id: ${id} is not registered in DB`);
};

/**
 *
 * Validate collections
 */
const allowedCollections = async (collection = '', allowedArray = []) => {
  const allowed = allowedArray.includes(collection);
  if (!allowed)
    throw new Error(
      `Collection: ${collection} is not allowed, the ones allowed are: [ ${allowedArray} ]`
    );

  return true;
};

export {
  isValidRole,
  isRegistered,
  userExistsById,
  categoryRegistered,
  categoryExistsById,
  productRegistered,
  productExistsById,
  allowedCollections,
};
