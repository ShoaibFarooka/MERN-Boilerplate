import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import userService from '../services/userService';

// Define the User type according to your API response structure
interface User {
    id: string;
    name: string;
    email: string;
}

// Define the type for the user state
interface UserState {
    user: User | null;
    userError: string | null;
}

// Define the initial state using the UserState interface
const initialState: UserState = {
    user: null,
    userError: null
};

// Define an async thunk for fetching user info
export const fetchUserInfo = createAsyncThunk<User, void>(
    'user/fetchUserInfo',
    async (_, { rejectWithValue }) => {
        try {
            // Uncomment and replace with actual API call
            // const response = await userService.getUserInfo();
            // return response.user; // Ensure response.user matches User type

            // For testing, let's return a mock user object
            return { id: '1', name: 'John Doe', email: 'john.doe@example.com' }; // Example mock user
        } catch (error) {
            // Check if the error is an instance of Error and return its message
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to fetch user info');
        }
    }
);

// Create the user slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUser() {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
                state.userError = null;
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                // action.payload can be of type string due to rejectWithValue
                state.userError = action.payload as string || 'Error fetching user info';
            });
    }
});

// Export the actions and the reducer
export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
