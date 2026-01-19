import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const SALT_WORK_FACTOR = 10;
const userSchema = new mongoose.Schema(
  {
    // Display name, can be changed by user
    name: { type: String, required: false, default: 'ChatApp' },
    // Unique username used for search / add friend / login display
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    verified: { type: Boolean, default: false },
    // Simple friend relationship (for now: symmetric manual update)
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function saveUser(next) {
  const user = this;
  // only hash the password if it has been modified
  if (!user.isModified('password')) return next();
  // hash the password along with salt
  user.password = await bcrypt.hashSync(user.password, SALT_WORK_FACTOR);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
