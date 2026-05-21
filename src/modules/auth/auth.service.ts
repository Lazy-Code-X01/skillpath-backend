import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../user/user.model';
import { JWT_SECRET } from '../../config/env';

export class AuthService {
  /**
   * Register a new user in the system.
   * @param name User name
   * @param email User email
   * @param password Raw user password
   */
  async registerUser(name: string, email: string, password: string): Promise<any> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const userObj = savedUser.toObject();
    delete userObj.password;

    return userObj;
  }

  /**
   * Authenticate user credentials and return a signed JWT.
   */
  async loginUser(email: string, password: string): Promise<{ token: string; user: any }> {
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userObj = user.toObject();
    delete userObj.password;

    return { token, user: userObj };
  }
}

export const authService = new AuthService();
export default authService;
