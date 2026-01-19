import User from '../models/user.js';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Sign in
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Signed in successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json(`Can not find user with email ${email}`);
    }
    const id = user._id.toString();
    const validUser = user.comparePassword(password);
    if (validUser) {
      const { name, createdAt, verified } = user;
      // if (!verified) {
      //     return res.status(403).json({ message: ' Authentication failed, please verified your email address' });
      // }
      const token = jwt.sign({ id }, process.env.SECRET);
      return res.status(200).json({ token, name, createdAt, verified, id });
    } else {
      return res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Signed up successfully
 *       400:
 *         description: Validation or duplicate error
 *       500:
 *         description: Server error
 */
async function signUp(req, res) {
  const { name, username, password, email } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const user = new User({ name, username, password, email });
  try {
    await user.save();
    return res.status(200).json({
      message: 'Sign up successfully',
    });
  } catch (error) {
    // TODO - error handle
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate email' });
    }

    return res.status(500).json({ error: error.message });
  }
}

export default {
  signIn,
  signUp,
};
