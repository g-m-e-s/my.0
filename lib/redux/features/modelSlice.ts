import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type ModelType = "gpt-4o" | "openai-o1" | "claude-3.7" | "grok-3" | "phi-4"

interface ModelState {
  activeModel: ModelType
}

const initialState: ModelState = {
  activeModel: "gpt-4o",
}

export const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setActiveModel: (state, action: PayloadAction<ModelType>) => {
      state.activeModel = action.payload
    },
  },
})

export const { setActiveModel } = modelSlice.actions
export default modelSlice.reducer
