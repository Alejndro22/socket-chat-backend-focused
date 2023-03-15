import { Schema, model } from 'mongoose';

const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  description: { type: String },
  available: { type: Boolean, default: true },
  img: { type: String },
});

ProductSchema.methods.toJSON = function () {
  const { __v, ...product } = this.toObject();
  return product;
};

const Product = model('Product', ProductSchema);
export default Product;
