import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';

// Types
export interface Item {
  _id: string;
  title: string;
  description: string;
  images: string[];
  price: string | null;
  details: Record<string, string>;
  sourceUrl: string;
  domain: string;
  user: string;
  collection: string;
  tags: string[];
  scrapedAt: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ItemsState {
  items: Item[];
  currentItem: Item | null;
  collections: Array<{
    name: string;
    description: string;
    isPublic: boolean;
  }>;
  loading: boolean;
  error: string | null;
}

interface ScrapeUrlParams {
  url: string;
  collection: string;
  useJavaScript?: boolean;
  tags?: string[];
}

interface CreateCollectionParams {
  name: string;
  description?: string;
  isPublic?: boolean;
}

// Fetch all items
export const fetchItems = createAsyncThunk('items/fetchItems', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/api/scrape');
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch items');
  }
});

// Fetch items by collection
export const fetchItemsByCollection = createAsyncThunk(
  'items/fetchItemsByCollection',
  async (collection: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/scrape/collections/${collection}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch collection items');
    }
  }
);

// Fetch single item
export const fetchItem = createAsyncThunk(
  'items/fetchItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/scrape/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch item');
    }
  }
);

// Scrape URL and save item
export const scrapeUrl = createAsyncThunk(
  'items/scrapeUrl',
  async (params: ScrapeUrlParams, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/scrape', params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to scrape URL');
    }
  }
);

// Delete item
export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/scrape/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete item');
    }
  }
);

// Toggle favorite status
export const toggleFavorite = createAsyncThunk(
  'items/toggleFavorite',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/scrape/${id}/favorite`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update favorite status');
    }
  }
);

// Fetch user collections
export const fetchCollections = createAsyncThunk(
  'items/fetchCollections',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/users/collections');
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch collections');
    }
  }
);

// Create new collection
export const createCollection = createAsyncThunk(
  'items/createCollection',
  async (params: CreateCollectionParams, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/users/collections', params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create collection');
    }
  }
);

// Delete collection
export const deleteCollection = createAsyncThunk(
  'items/deleteCollection',
  async (name: string, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/api/users/collections/${name}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete collection');
    }
  }
);

const initialState: ItemsState = {
  items: [],
  currentItem: null,
  collections: [],
  loading: false,
  error: null,
};

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    clearItemError: (state) => {
      state.error = null;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch items by collection
      .addCase(fetchItemsByCollection.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItemsByCollection.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchItemsByCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch single item
      .addCase(fetchItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItem.fulfilled, (state, action: PayloadAction<Item>) => {
        state.currentItem = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Scrape URL
      .addCase(scrapeUrl.pending, (state) => {
        state.loading = true;
      })
      .addCase(scrapeUrl.fulfilled, (state, action: PayloadAction<Item>) => {
        state.items = [action.payload, ...state.items];
        state.loading = false;
        state.error = null;
      })
      .addCase(scrapeUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete item
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(item => item._id !== action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Toggle favorite
      .addCase(toggleFavorite.fulfilled, (state, action: PayloadAction<Item>) => {
        const updatedItem = action.payload;
        state.items = state.items.map(item => 
          item._id === updatedItem._id ? updatedItem : item
        );
        if (state.currentItem && state.currentItem._id === updatedItem._id) {
          state.currentItem = updatedItem;
        }
        state.error = null;
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Fetch collections
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.collections = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create collection
      .addCase(createCollection.fulfilled, (state, action) => {
        state.collections = action.payload;
        state.error = null;
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Delete collection
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.collections = action.payload;
        state.error = null;
      })
      .addCase(deleteCollection.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearItemError, clearCurrentItem } = itemSlice.actions;

export default itemSlice.reducer;