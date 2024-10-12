import { createSlice } from "@reduxjs/toolkit";

// Define the type for the loader state
interface LoaderState {
    isLoading: boolean;
}

// Define the initial state using the LoaderState interface
const initialState: LoaderState = {
    isLoading: false,
};

export const loaderSlice = createSlice({
    name: "loader",
    initialState,
    reducers: {
        ShowLoading(state) {
            state.isLoading = true;
        },
        HideLoading(state) {
            state.isLoading = false;
        },
    },
});

// Export actions and reducer
export const { ShowLoading, HideLoading } = loaderSlice.actions;

export default loaderSlice.reducer;
