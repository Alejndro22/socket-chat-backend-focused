import { Schema, model } from 'mongoose';

const CategorySchema = Schema({
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
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

CategorySchema.methods.toJSON = function () {
  const { __v, ...category } = this.toObject();
  return category;
};

const Category = model('Category', CategorySchema);
export default Category;
