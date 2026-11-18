import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counterSlice.js";
import themeReducer from "../features/themeSlice.js";
import todoReducer from "../features/todoSlice.js";
import profileReducer from "../features/userProfileSlice.js";
import userReducer from "../features/userSlice.js";
import authReducer from "../features/authSlice.js";
import postReducer from "../features/postSlice.js";
import feedReducer from "../features/feedSlice.js";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        theme: themeReducer,
        todo: todoReducer,
        profile: profileReducer,
        users: userReducer,
        auth: authReducer,
        posts: postReducer,
        feed: feedReducer,
    },
})