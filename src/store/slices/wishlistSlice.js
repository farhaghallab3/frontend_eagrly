import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from '../../services/wishlistService';

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async () => {
    const wishlist = await wishlistService.getWishlist();
    return wishlist;
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const result = await wishlistService.addToWishlist(productId);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      return productId; // Return the productId to filter from state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const result = await wishlistService.toggleWishlist(productId);
      return result; // Returns { status: 'added'/'removed', item: object, product_id: id }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastAction: null, // Track last action for UI feedback
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
    clearLastAction: (state) => {
      state.lastAction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Wishlist
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { status, item, product_id } = action.payload;

        // Ensure state.items structure exists (paginated format from backend)
        if (!state.items) state.items = { results: [], count: 0 };
        if (!state.items.results) state.items.results = [];

        if (status === 'added') {
          // Add to list
          state.items.results.push(item);
          state.items.count = (state.items.count || 0) + 1;
          state.lastAction = { type: 'added', productId: item?.product_id };
        } else if (status === 'removed') {
          // Remove from list
          state.items.results = state.items.results.filter(
            w => w.product_id !== (product_id || item?.product_id)
          );
          state.items.count = Math.max(0, (state.items.count || 1) - 1);
          state.lastAction = { type: 'removed', productId: product_id || item?.product_id };
        }
      })
      // Add to wishlist - backend returns updated paginated response
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.lastAction = { type: 'added' };
      })
      // Remove from wishlist - filter out the removed item
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const removedProductId = action.payload;

        // Ensure state.items structure exists (paginated format from backend)
        if (state.items && state.items.results) {
          state.items.results = state.items.results.filter(
            item => item.product_id !== removedProductId
          );
          state.items.count = Math.max(0, (state.items.count || 1) - 1);
        }
        state.lastAction = { type: 'removed', productId: removedProductId };
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlist, clearLastAction } = wishlistSlice.actions;
export default wishlistSlice.reducer;

