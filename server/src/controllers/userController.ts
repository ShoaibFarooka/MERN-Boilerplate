import { Request, Response, NextFunction } from 'express';
import path from 'path';
import * as userService from '../services/userService';
import * as emailService from '../services/emailService';
import * as templateUtils from '../utils/templateUtils';

const Register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = { ...req.body };
    const { userType } = req.params;
    await userService.createUser(data, userType);
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    next(error);
  }
};

const Login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = { ...req.body };
    const { accessToken, refreshToken } = await userService.loginUser(data);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(200).json({ token: accessToken });
  } catch (error) {
    next(error);
  }
};

const ForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const { user, resetToken } = await userService.createResetToken(email);
    const CLIENT_URL = req.get('origin');
    const resetLink = `${CLIENT_URL}/reset-password?token=${resetToken}`;
    const templatePath = path.join(__dirname, '../templates/resetPasswordEmailTemplate.hbs');
    const data = {
      companyLogo: "http://localhost:5777/static/images/logo.png",
      userName: user.name,
      resetLink,
    };
    const htmlContent = await templateUtils.generateHTML(data, templatePath);
    await emailService.sendEmail(user.email, 'Password Reset Request', '', htmlContent);
    res.status(200).json({ message: 'Reset password link sent!' });
  } catch (error) {
    next(error);
  }
};

const ResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    await userService.resetPassword(token, newPassword);
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    next(error);
  }
};

const RefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const { newAccessToken, newRefreshToken } = await userService.refreshToken(refreshToken);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    next(error);
  }
};

const Logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await userService.logoutUser(refreshToken);
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

const FetchUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const user = await userService.fetchUser(userId as string);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const UpdateUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const data = req.body;
    await userService.updateUser(userId as string, data);
    res.status(200).json({ message: "Info updated successfully!" });
  } catch (error) {
    next(error);
  }
};

const ChangeUserPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;
    await userService.changeUserPassword(userId as string, oldPassword, newPassword);
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    next(error);
  }
};

export {
  Register,
  Login,
  ForgotPassword,
  ResetPassword,
  RefreshToken,
  Logout,
  FetchUserInfo,
  UpdateUserInfo,
  ChangeUserPassword
};
