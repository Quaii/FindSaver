import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  collections: Array<{
    name: string;
    description: string;
    isPublic: boolean;
  }>;
  createdAt: string;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
}

// Set token in headers
const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

// Load user
export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }
    
    setAuthToken(token);

    // Make request to auth endpoint
    const res = await api.get('/api/auth/me');
    return res.data;
  } catch (err: any) {
    setAuthToken(null);
    localStorage.removeItem('token');
    return rejectWithValue(err.response?.data?.message || 'Failed to load user');
  }
});

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/register', credentials);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/login', credentials);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      setAuthToken(null);
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load user
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        const { token } = action.payload;
        setAuthToken(token);
        state.token = token;
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { token } = action.payload;
        setAuthToken(token);
        state.token = token;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;