import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout, selectToken } from "./authSlice";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, thunkAPI) => {
    const {getState, dispatch, rejectWithValue} = thunkAPI;

    // const token = selectToken(getState());
    const token = "my-dummy-jwt";

    if(!token){
        return rejectWithValue("Not authenticated");
    }

    try {
      const response = await fetch(USERS_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
      });

      if(response.status === 401){
        dispatch(logout());
        return rejectWithValue("Session expired. Please log in again.");
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId, { signal, rejectWithValue }) => {
    try {
      const response = await fetch(`${USERS_URL}/${userId}`, {
        signal,
      });
      if (!response.ok) {
        throw new Error(`User ${userId} not found (status ${response.status})`);
      }
      return await response.json();
    } catch (err) {
        if(err.name === "AbortError") throw err;
      return rejectWithValue(err.message);
    }
  },
  {
    condition: (userId, { getState }) => {
      const entry = getState().users.byId[userId];
      if (
        entry &&
        (entry.status === "loading" || entry.status === "succeeded")
      ) {
        return false;
      }
    },
  },
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    byId: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.payload.error.message;
      })
      .addCase(fetchUserById.pending, (state, action) => {
         const id = action.meta.org;
         state.byId[id] = {data: null, status: "loading", error: null};
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.byId[id] = {data: action.payload, status: "succeeded", error: null}
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        const id = action.meta.arg;
        if(action.meta.aborted){
            delete state.byId[id];
        }
        state.byId[id] = {
            data: null,
            status: "failed",
            error: action.payload ?? action.payload.error.message,
        }
      })
  },
});

export default userSlice.reducer;

// Selectors
export const selectAllUsers = (state) => state.users.items;
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;
export const selectUserById = (id) => (state) => state.users.byId[id];
