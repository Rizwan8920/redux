import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { selectToken } from "./authSlice";

const POST_URL = "https://jsonplaceholder.typicode.com/posts";

const authHeaders = (getState) => {
    const token = selectToken(getState());
    return token ? {Authorization: `Bearer ${token}`} : {};
};

export const addPost = createAsyncThunk(
    "posts/addPost",
    async (newPost, {getState, signal, rejectWithValue}) => {
        const token = selectToken(getState());
            
        try {
            const response = await fetch(POST_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && {Authorization: `Bearer ${token}`}),
                },
                body: JSON.stringify(newPost),
                signal,
            })

            if(!response.ok){
                const errorBody = await response.json().catch(() => null);
                return rejectWithValue(
                    errorBody?.message ?? `Request failed with status ${response.status}`
                );
            }

            return response.json();
        } catch (err) {
            if(err.name === "AbortError") throw err;
            return rejectWithValue(err.message);
        }
    }
);

export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async (postId, {getState, signal, rejectWithValue}) => {
        try {
            const response = await fetch(`${POST_URL}/${postId}`, {
                method: "DELETE",
                headers: authHeaders(getState),
                signal,
            });
            if(!response.ok){
                return rejectWithValue(`Failed to delete post (status ${response.status})`);
            }
            return postId;
        } catch (err) {
            if(err.name === "AbortError") throw err;
            return rejectWithValue(err.message);
        }
    },
    {
        condition: (postId, {getState}) => {
            const post = getState().posts.items.find((p) => p.id === postId);
            if(post?.pending) return false;
        }
    }
);

const postsSlice = createSlice({
    name: "posts",
    initialState: {
        items: [],
        addStatus: "idle",
        addError: null,
        removed: {},
    },
    reducers: {
        clearAddError: (state) => {
            state.addError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addPost.pending, (state, action) => {
                state.items.unshift({
                    ...action.meta.arg,
                    id: action.meta.requestId,
                    pending: true,
                })
                // state.addStatus = "loading";
                // state.addError = null;
            })
            .addCase(addPost.fulfilled, (state, action) => {
                const i = state.items.findIndex((p) => p.id === action.meta.requestId);
                if(i !== -1) state.items[i] = action.payload;
                // state.addStatus = "succeeded";
                // state.items.unshift(action.payload);
            })
            .addCase(addPost.rejected, (state, action) => {
                state.items = state.items.filter((p) => p.id !== action.meta.requestId);
                if(!action.meta.aborted){
                    state.addError = action.payload ?? action.error?.message ?? "Could not add post";
                }
                // state.addStatus = "failed";
                // state.addError = action.payload ?? action.error.message;
            })
            .addCase(deletePost.pending, (state, action) => {
                const id = action.meta.arg;
                const index = state.items.findIndex((p) => p.id === id);
                if(index === -1) return;
                state.removed[action.meta.requestId] = {post: state.items[index], index};
                state.items.splice(index, 1);
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                delete state.removed[action.meta.requestId];
            })
            .addCase(deletePost.rejected, (state, action) => {
                const backup = state.removed[action.meta.requestId];
                if(backup){
                    const index = Math.min(backup.index, state.items.length);
                    state.items.splice(index, 0, backup.post);
                    delete state.removed[action.meta.requestId];
                }
                if(!action.meta.aborted){
                    state.addError = action.payload ?? action.error?.message ?? "Could not delete post";
                }
            })
    }
});

export const {clearAddError} = postsSlice.actions;
export default postsSlice.reducer;

export const selectAllPosts = (state) => state.posts.items;
export const selectAddStatus = (state) => state.posts.addStatus;
export const selectAddError = (state) => state.posts.addError;