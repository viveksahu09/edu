import { User } from "../types";

export const registerUser = async (
  userData: Omit<User, "id">
): Promise<User> => {
  // Simulate API call
  const newUser: User = {
    ...userData,
    id: Date.now().toString(), // Generate a unique ID
  };

  // Store in localStorage
  let users: User[] = [];
  try {
    const storedUsers = localStorage.getItem("users");
    users = storedUsers ? JSON.parse(storedUsers) : [];
  } catch (error) {
    console.error("Error parsing users from localStorage:", error);
    localStorage.removeItem("users");
  }
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  return newUser;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  // Get users from localStorage
  let users: User[] = [];
  try {
    const storedUsers = localStorage.getItem("users");
    users = storedUsers ? JSON.parse(storedUsers) : [];
  } catch (error) {
    console.error("Error parsing users from localStorage:", error);
    localStorage.removeItem("users");
  }
  
  const user = users.find((u) => u.email === email);

  if (!user) {
    throw new Error("User not found");
  }

  // In a real app, you would hash the password and compare properly
  // Note: This old auth.ts file is deprecated and not used in the new system
  // The password field doesn't exist in the current User type
  // This is just for backward compatibility
  
  return user;
};

export const resetPassword = (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    let users: User[] = [];
    try {
      const storedUsers = localStorage.getItem("users");
      users = storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
      console.error("Error parsing users from localStorage:", error);
      localStorage.removeItem("users");
    }
    
    const user = users.find((u: User) => u.email === email);

    if (user) {
      // In a real application, send reset email
      // For demo, just log to console
      console.log("Password reset email sent to:", email);
      resolve();
    } else {
      reject(new Error("User not found"));
    }
  });
};
