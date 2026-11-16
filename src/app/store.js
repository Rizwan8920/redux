import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counterSlice.js";
import themeReducer from "../features/themeSlice.js";
import todoReducer from "../features/todoSlice.js";
import profileReducer from "../features/userProfileSlice.js";
import userReducer from "../features/userSlice.js";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        theme: themeReducer,
        todo: todoReducer,
        profile: profileReducer,
        users: userReducer,
    }
})