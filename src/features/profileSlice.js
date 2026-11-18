import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE = "https://jsonplaceholder.typicode.com";

export const fetchUser = createAsyncThunk(
    "profile/fetchUser",
    async (userId, {signal, rejectWithValue}) => {
        try {
            const res = await fetch(`${BASE}/users/${userId}`, {signal});
            if(!res.ok) return rejectWithValue(`User ${userId} not found (status ${res.status})`);
            return await res.json();
        } catch (err) {
            if(err.name === "AbortError") throw err;
            return rejectWithValue(err.message);
        }
    }
)

export const fetchPostsByUser = createAsyncThunk(
    "profile/fetchPostsByUser",
    async (userId, {signal, rejectWithValue}) => {
        try {
            const res = await fetch(`${BASE}/posts?userId=${userId}`, {signal});
            if(!res.ok) return rejectWithValue(`Failed to load posts (status ${res.status})`);
            return await res.json();
        } catch (err) {
            if(err.name === "AbortError") throw err;
            return rejectWithValue(err.message);
        }
    }
)

export const loadUserWithPosts = createAsyncThunk(
    "profile/loadUserWithPosts",
    async (userId, {dispatch, signal, rejectWithValue}) => {
        const userPromise = dispatch(fetchUser(userId));
        const abortUser = () => userPromise.abort();
        signal.addEventListener("abort", abortUser);

        try {
            const user = await userPromise.unwrap();

            const postsPromise = dispatch(fetchPostsByUser(userId));
            signal.addEventListener("abort", () => postsPromise.abort);
            const posts = await postsPromise.unwrap();

            return {user, posts};
        } catch (err) {
            if(err.name === "AbortError") throw err;
            return rejectWithValue(typeof err === "string" ? err : err.message);
        } finally {
            signal.removeEventListener("abort", abortUser);
        }
    }
)

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        user: null,
        posts: [],
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadUserWithPosts.pending, (state) => {
                state.status = "loading";
                state.error = null;
                state.user = null;
            })
            .addCase(loadUserWithPosts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.user;
                state.posts = action.payload.posts;
            })
            .addCase(loadUserWithPosts.rejected, (state, action) => {
                if(action.meta.aborted){
                    state.status = "idle";
                    return;
                }
                state.status = "failed";
                state.error = action.payload ?? action.error?.messsage ?? "Something went wrong";
            })
    }
})

export default profileSlice.reducer;

export const selectProfile = (state) => state.profile;