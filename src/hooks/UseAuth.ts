import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { login, logout, updateProfile } from "../store/slices/authSlice";
import { loginUser, registerUser } from "../services/auth";
import type { User, UserRegistration } from "../types";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = async (email: string, password: string) => {
    try {
      const userData = await loginUser(email, password);
      dispatch(login(userData));
      navigate("/");
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (userData: UserRegistration) => {
    try {
      const newUser = await registerUser(userData);
      dispatch(login(newUser));
      navigate("/");
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const updateUser = (userData: User) => {
    dispatch(updateProfile(userData));
  };

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUser,
  };
};
