import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    name: "",
    email: "",
    bio: "",
}

const userProfileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        updateField: (state, action) => {
            const {field, value} = action.payload;
            state[field] = value;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setBio: (state, action) => {
            state.bio = action.payload;
        },
        getProfile: (state) => {
            return state;
        }
    }
})

export const selectProfile = (state) => state.profile;

export const {updateField, setName, setEmail, setBio} = userProfileSlice.actions;
export default userProfileSlice.reducer;