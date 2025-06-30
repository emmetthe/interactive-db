import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// This slice manages the project ID state
interface ProjectState {
  id: string | null;
}

const initialState: ProjectState = {
  id: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
});

export const { setProjectId } = projectSlice.actions;
export default projectSlice.reducer;
