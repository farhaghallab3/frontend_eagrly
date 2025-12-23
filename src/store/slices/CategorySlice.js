import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories } from '../../services/api';

// Async thunk لجلب الفئات
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    return await getCategories();
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });
  },
});

export default categorySlice.reducer;
