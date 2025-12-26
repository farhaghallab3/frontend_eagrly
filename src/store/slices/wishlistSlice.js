import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from '../../services/wishlistService';
import { toast } from 'react-toastify';

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
      toast.success('Added to wishlist!');
      return result;
    } catch (error) {
      toast.error('Failed to add to wishlist');
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      toast.success('Removed from wishlist!');
      return productId;
    } catch (error) {
      toast.error('Failed to remove from wishlist');
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
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
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
        } else if (status === 'removed') {
          // Remove from list
          state.items.results = state.items.results.filter(
            w => w.product_id !== (product_id || item?.product_id)
          );
          state.items.count = Math.max(0, (state.items.count || 1) - 1);
        }
      })
      // Add to wishlist - backend returns updated paginated response
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Remove from wishlist - backend returns updated paginated response
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
