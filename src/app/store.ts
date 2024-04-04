import { configureStore } from "@reduxjs/toolkit";

import themeSliceReducer from "../features/slices/themeSlice";

export default configureStore({
    reducer: {
        theme: themeSliceReducer
    }
})