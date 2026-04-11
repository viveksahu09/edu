import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Clear any corrupted localStorage data on startup
const clearCorruptedAuthData = (): void => {
  const keysToCheck = ["user", "redux_user", "users", "authToken", "refreshToken"];
  
  keysToCheck.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      if (value && (value === 'undefined' || value === 'null' || value === '')) {
        console.log(`authSlice: Clearing corrupted key: ${key}`);
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`authSlice: Error checking key ${key}:`, error);
      localStorage.removeItem(key);
    }
  });
};

const loadInitialState = (): AuthState => {
  // Clear any corrupted data first
  clearCorruptedAuthData();
  
  try {
    const savedUser = localStorage.getItem("redux_user");
    console.log("authSlice: Found savedUser:", savedUser);
    
    // Check if savedUser exists and is not undefined/null
    if (!savedUser || savedUser === 'undefined' || savedUser === 'null') {
      console.log("authSlice: No valid user data found");
      localStorage.removeItem("redux_user");
      return {
        user: null,
        isAuthenticated: false,
      };
    }
    
    const parsedUser = JSON.parse(savedUser);
    console.log("authSlice: Successfully parsed user:", parsedUser);
    
    return {
      user: parsedUser,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("authSlice: Error parsing user from localStorage", error);
    // Clear all potentially corrupted auth data
    localStorage.removeItem("redux_user");
    localStorage.removeItem("user");
    localStorage.removeItem("users");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    return {
      user: null,
      isAuthenticated: false,
    };
  }
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("redux_user", JSON.stringify(action.payload));
    },
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("redux_user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("redux_user");
    },
    updateProfile: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("redux_user", JSON.stringify(action.payload));
    },
  },
});

export const { register, login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
