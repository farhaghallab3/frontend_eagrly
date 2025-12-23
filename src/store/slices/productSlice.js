// src/redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services/productService";

// ✅ Fetch all products
export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  return await productService.getAll();
});
// ✅ Fetch my products

export const fetchMyProducts = createAsyncThunk(
  "products/fetchMy",
  async () => {
    return await productService.getMyProducts();
  }
);

// ✅ Create product
export const createProduct = createAsyncThunk("products/create", async (data, { rejectWithValue }) => {
  try {
    return await productService.create(data);
  } catch (error) {
    return rejectWithValue(error);
  }
});

// ✅ Update product
export const updateProduct = createAsyncThunk("products/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await productService.update(id, data);
  } catch (error) {
    return rejectWithValue(error);
  }
});

// ✅ Delete product
export const deleteProduct = createAsyncThunk("products/delete", async (id, { rejectWithValue }) => {
  try {
    return await productService.delete(id);
  } catch (error) {
    return rejectWithValue(error);
  }
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    myProducts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
      })
      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      // Fetch My Products
      .addCase(fetchMyProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.myProducts = action.payload.payload || action.payload || [];
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
