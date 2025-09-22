import User from '../models/user';

const listUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const created = await User.create({ name, email, password });
    res.status(201).json({ message: 'User created successfully', id: created._id });
  } catch (error) {
    // code 11000 is MongoDB’s duplicate key error
    if (error && error.code === 11000) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully', id: updated._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  addUser,
  listUsers,
  updateUser,
};
