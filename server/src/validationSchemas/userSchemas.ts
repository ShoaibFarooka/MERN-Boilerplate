import * as yup from 'yup';
import mongoose from 'mongoose';

// Custom ObjectId validation
const ObjectId = yup.string().test('is-valid', 'Invalid user ID', (value) =>
  value !== undefined && mongoose.Types.ObjectId.isValid(value)
);

// Register schema
const registerSchema = yup.object().shape({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().trim().email('Invalid email address').required('Email is required'),
  number: yup.string().trim().required('Number is required'),
  dateOfBirth: yup.string().trim().optional(),
  address: yup.string().trim().required('Address is required'),
  city: yup.string().trim().required('City is required'),
  zip: yup.string().trim().required('Zip is required'),
  password: yup.string().trim().required('Password is required'),
});

// Login schema
const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').trim().required('Email is required'),
  password: yup.string().trim().required('Password is required'),
});

// Forgot password schema
const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').trim().required('Email is required'),
});

// User type schema
const userTypeSchema = yup.object().shape({
  userType: yup.string().oneOf(['user', 'company'], 'Invalid user type').required('User type is required'),
});

// Reset password schema
const resetPasswordSchema = yup.object().shape({
  token: yup.string().trim().required('Token is required'),
  newPassword: yup.string().trim().required('New Password is required'),
});

// Create user schema
const createUserSchema = yup.object().shape({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().email('Invalid email address').trim().required('Email is required'),
  number: yup.string().trim().required('Number is required'),
  dateOfBirth: yup.string().trim().required('Date of birth is required'),
  address: yup.string().trim().required('Address is required'),
  city: yup.string().trim().required('City is required'),
  zip: yup.string().trim().required('Zip is required'),
  password: yup.string().trim().required('Password is required'),
  notes: yup.string().trim().optional(),
});

// Update user schema
const updateUserSchema = yup.object().shape({
  name: yup.string().trim().optional(),
  email: yup.string().trim().email('Invalid email address').optional(),
  number: yup.string().trim().optional(),
  totalContacts: yup.number().optional(),
  dateOfBirth: yup.string().trim().optional(),
  address: yup.string().trim().optional(),
  city: yup.string().trim().optional(),
  zip: yup.string().trim().optional(),
});

// User ID schema
const userIdSchema = yup.object().shape({
  userId: ObjectId.required('User ID is required'),
});

// Search users schema
const searchUsersSchema = yup.object().shape({
  pageIndex: yup.number().required('Page index is required'),
  limit: yup.number().positive('Limit must be positive').required('Limit is required'),
  searchQuery: yup.string().trim().optional(),
  status: yup.string().trim().optional(),
});

// Change user password schema
const changeUserPasswordSchema = yup.object().shape({
  oldPassword: yup.string().trim().required('Old Password is required'),
  newPassword: yup.string().trim().required('New Password is required'),
});

// Export schemas
export {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  userTypeSchema,
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  searchUsersSchema,
  changeUserPasswordSchema,
};
