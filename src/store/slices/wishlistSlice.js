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
  async (productId, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const isInWishlist = state.wishlist.items?.results?.some(item => item.product_id === productId) || false;

      if (isInWishlist) {
        await dispatch(removeFromWishlist(productId));
      } else {
        await dispatch(addToWishlist(productId));
      }

      return productId;
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
      // Add to wishlist - backend returns updated paginated response
      .addCase(addToWishlist.fulfilled, (state, action) => {
        // The backend should return the updated paginated response
        state.items = action.payload;
      })
      // Remove from wishlist - backend returns updated paginated response
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        // The backend should return the updated paginated response
        state.items = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
