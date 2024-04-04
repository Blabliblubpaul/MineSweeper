import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
    name: "theme",
    initialState: {
        value: "light"
    },
    reducers: {
        set: (state, action) => {
            state.value = action.payload
        }
    }
})

export const {set} = themeSlice.actions

export default themeSlice.reducer