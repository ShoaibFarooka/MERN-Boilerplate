import User, {IUser} from '../models/userModel';
import CryptoJS from 'crypto-js';
import * as authUtils from '../utils/authUtils';

interface UserData {
  name: string;
  email: string;
  number: string;
  dateOfBirth: Date | null;
  address: string;
  city: string;
  zip: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

const createUser = async (userData: UserData, role: string): Promise<IUser> => {
  const { name, email, number, dateOfBirth, address, city, zip, password } = userData;

  let existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('A user with that email has already been registered!');
    (error as any).code = 409;
    throw error;
  }

  existingUser = await User.findOne({ number });
  if (existingUser) {
    const error = new Error('A user with that number has already been registered!');
    (error as any).code = 409;
    throw error;
  }

  const passwordDigest = await authUtils.hashPassword(password);
  const user = await User.create({
    name,
    email,
    number,
    dateOfBirth: role === 'user' ? dateOfBirth : null,
    address,
    city,
    zip,
    password: passwordDigest,
    role,
  });

  return user;
};

const loginUser = async (loginData: LoginData): Promise<{ accessToken: string; refreshToken: string }> => {
  const { email, password } = loginData;

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('User not found!');
    (error as any).code = 404;
    throw error;
  }

  const passwordMatched = await authUtils.comparePassword(user.password, password);
  if (!passwordMatched) {
    const error = new Error('Invalid credentials!');
    (error as any).code = 400;
    throw error;
  }

  const payload: UserPayload = {
    id: user._id as string,
    email: user.email,
    role: user.role,
  };

  const accessToken = authUtils.createAccessToken(payload);
  const refreshToken = authUtils.createRefreshToken(payload);
  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

const createResetToken = async (email: string): Promise<{ user: IUser; resetToken: string }> => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('User not found!');
    (error as any).code = 404;
    throw error;
  }

  const randomBytes = CryptoJS.lib.WordArray.random(32);
  const resetToken = randomBytes.toString(CryptoJS.enc.Hex);
  user.resetToken = resetToken;
  user.resetTokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour
  await user.save();

  return { user, resetToken };
};

const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
  if (!user) {
    const error = new Error('Invalid or expired token!');
    (error as any).code = 400;
    throw error;
  }

  const passwordDigest = await authUtils.hashPassword(newPassword);
  user.password = passwordDigest;
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();
};

const refreshToken = async (refreshToken: string): Promise<{ newAccessToken: string; newRefreshToken: string }> => {
  if (!refreshToken) {
    const error = new Error('Refresh token not found!');
    (error as any).code = 401;
    throw error;
  }

  const payload = authUtils.verifyRefreshToken(refreshToken);
  if(!payload) {
    const error = new Error('Invalid refresh token!');
    (error as any).code = 401;
    throw error;
  }

  const user = await User.findById(payload.id);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error('Invalid refresh token!');
    (error as any).code = 401;
    throw error;
  }

  const newPayload: UserPayload = { id: payload.id, email: payload.email, role: payload.role };
  const newAccessToken = authUtils.createAccessToken(newPayload);
  const newRefreshToken = authUtils.createRefreshToken(newPayload);
  user.refreshToken = newRefreshToken;
  await user.save();

  return { newAccessToken, newRefreshToken };
};

const logoutUser = async (refreshToken: string): Promise<void> => {
  const payload = authUtils.verifyRefreshToken(refreshToken);
  if (payload && payload.id) {
    const user = await User.findById(payload.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }
};

const fetchUser = async (userId: string): Promise<IUser> => {
  const userProjection = {
    name: 1,
    email: 1,
    number: 1,
    dateOfBirth: 1,
    address: 1,
    city: 1,
    zip: 1,
    role: 1,
    _id: 0,
  };

  const user = await User.findById(userId, userProjection);
  if (!user) {
    const error = new Error('User not found!');
    (error as any).code = 404;
    throw error;
  }

  return user;
};

const searchUsers = async (pageIndex: number, limit: number, searchQuery: string, role?: string): Promise<{ users: IUser[]; totalPages: number; totalCount: number }> => {
  const skip = (pageIndex - 1) * limit;
  let query: any = {};

  if (searchQuery && searchQuery !== '') {
    query = {
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { number: { $regex: searchQuery, $options: 'i' } },
      ],
    };
  }

  if (role) {
    query = { ...query, role };
  }

  const totalCount = await User.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limit);

  const userProjection = {
    name: 1,
    email: 1,
    number: 1,
    dateOfBirth: 1,
    address: 1,
    city: 1,
    zip: 1,
    role: 1,
    notes: 1,
    createdAt: 1,
  };

  const users = await User.find(query, userProjection)
    .sort({ createdAt: -1 })  // Sort by createdAt descending (-1)
    .skip(skip)
    .limit(limit);

  if (!users || users.length <= 0) {
    const error = new Error('Users not found!');
    (error as any).code = 404;
    throw error;
  }

  return {
    users,
    totalPages,
    totalCount,
  };
};

const updateUser = async (userId: string, updateData: any, role?: string): Promise<IUser | null> => {
  const userToUpdate = await User.findById(userId);
  if (!userToUpdate) {
    const error = new Error('User not found!');
    (error as any).code = 404;
    throw error;
  }

  if (role && userToUpdate.role !== role) {
    const error = new Error('Cannot update other type of user via this endpoint!');
    (error as any).code = 405;
    throw error;
  }

  if (updateData.password) {
    updateData.password = await authUtils.hashPassword(updateData.password);
  }

  let existingUser;
  if (updateData.email && updateData.email !== userToUpdate.email) {
    existingUser = await User.findOne({ email: updateData.email });
    if (existingUser) {
      const error = new Error('A user with that email has already been registered!');
      (error as any).code = 409;
      throw error;
    }
  }

  if (updateData.number && updateData.number !== userToUpdate.number) {
    existingUser = await User.findOne({ number: updateData.number });
    if (existingUser) {
      const error = new Error('A user with that number has already been registered!');
      (error as any).code = 409;
      throw error;
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
  return updatedUser;
};

const deleteUser = async (userId: string, role: string): Promise<IUser | null> => {
  const userToDelete = await User.findById(userId);
  if (!userToDelete) {
    const error = new Error('User not found!');
    (error as any).code = 404;
    throw error;
  }

  if (userToDelete.role !== role) {
    const error = new Error('Cannot delete other type of user via this endpoint!');
    (error as any).code = 405;
    throw error;
  }

  const deletedUser = await User.findByIdAndDelete(userId);
  return deletedUser;
};

const changeUserPassword = async (userId: string, oldPassword: string, newPassword: string): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found!');
    (error as any).code = 404;
    throw error;
  }

  const passwordMatched = await authUtils.comparePassword(user.password, oldPassword);
  if (!passwordMatched) {
    const error = new Error('Invalid old password!');
    (error as any).code = 400;
    throw error;
  }

  const passwordDigest = await authUtils.hashPassword(newPassword);
  user.password = passwordDigest;
  await user.save();
};

export {
  createUser,
  loginUser,
  createResetToken,
  resetPassword,
  refreshToken,
  logoutUser,
  fetchUser,
  searchUsers,
  updateUser,
  deleteUser,
  changeUserPassword,
};
