import { User, IUser } from './user.model';

export class UserService {
  async getUserById(userId: string): Promise<IUser> {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateUserPreferences(
    userId: string,
    preferences: { goal?: string; currentLevel?: string; dailyTime?: number }
  ): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const updates: Record<string, any> = {};
    if (preferences.goal !== undefined) updates['preferences.goal'] = preferences.goal;
    if (preferences.currentLevel !== undefined) updates['preferences.currentLevel'] = preferences.currentLevel;
    if (preferences.dailyTime !== undefined) updates['preferences.dailyTime'] = preferences.dailyTime;

    await User.updateOne({ _id: userId }, { $set: updates });
    return (await User.findById(userId).select('-password'))!;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }
}

export const userService = new UserService();
export default userService;
