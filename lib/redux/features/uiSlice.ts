import { createSlice } from "@reduxjs/toolkit"

interface UiState {
  sidebarOpen: boolean
}

const initialState: UiState = {
  sidebarOpen: false,
}

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
  },
})

export const { toggleSidebar } = uiSlice.actions
export default uiSlice.reducer
