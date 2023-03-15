import { Schema, model } from 'mongoose';

const RoleSchema = Schema({
  role: {
    type: String,
    required: [true, 'Role is required'],
  },
});

const Role = model('Role', RoleSchema);
export default Role;
