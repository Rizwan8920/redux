import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const LOGIN_URL = "https://dummyjson.com/auth/login";
const STORAGE_KEY = "auth";

const loadAuth = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {token: null, user: null};
    } catch {
        return {token: null, user: null};
    }
}

const saveAuth = (auth) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
    } catch {
        
    }
}

const clearAuth = () => {
    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch {
        
    }
}

export const login = createAsyncThunk(
    "auth/login",
    async ({username, password}, {signal, rejectWithValue}) => {
        try {
            const response = await fetch(LOGIN_URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password}),
                signal
            });

            const data = await response.json().catch(() => null);

            if(!response.ok){
                return rejectWithValue(data?.message ?? `Login failed (status ${response.status})`);
            }

            const auth = {
                token: data.accessToken,
                user: {
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    firstName: data.firstName,
                },
            };

            saveAuth(auth);
            return auth;
        } catch (err) {
            if(err.name === "AbortError") throw err;
            return rejectWithValue(err.message);
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    clearAuth();
})

const {token, user} = loadAuth();

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token,
        user,
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = "idle";
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = action.meta.aborted ? "idle" : "failed";
                state.error = action.meta.aborted
                    ? null
                    : action.payload ?? action.error?.message ?? "Login failed";
            })
            .addCase(logout.fulfilled, (state) => {
                state.token = null;
                state.user = null;
                state.status = "idle";
                state.error = null;
            })
    },
});

// const authSlice = createSlice({
//     name: "auth",
//     initialState: {
//         token: null,
//     },
//     reducers: {
//         setToken: (state, action) => {
//             state.token = action.payload;
//         },
//         logout: (state) => {
//             state.token = null;
//         }
//     }
// })

// export const {setToken, logout} = authSlice.actions;
export default authSlice.reducer;

export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token);
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;