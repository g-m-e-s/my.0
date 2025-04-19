import { configureStore } from "@reduxjs/toolkit"
import uiReducer from "./features/uiSlice"
import chatReducer from "./features/chatSlice"
import modelReducer from "./features/modelSlice"

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    chat: chatReducer,
    model: modelReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
