import { User } from "../types";

export const updateUserProfile = async (
  userId: string,
  userData: Partial<User>
): Promise<User> => {
  // Get current users from localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const userIndex = users.findIndex((u: User) => u.id === userId);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  // Update user data
  const updatedUser = {
    ...users[userIndex],
    ...userData,
    updatedAt: new Date().toISOString(),
  };

  users[userIndex] = updatedUser;
  localStorage.setItem("users", JSON.stringify(users));

  // Update current user in localStorage if it's the same user
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  if (currentUser && currentUser.id === userId) {
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }

  return updatedUser;
};

export const uploadProfileImage = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

export const uploadImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // In a real app, you'd upload to a server
      // For demo, we'll store in localStorage
      const imageUrl = reader.result as string;
      resolve(imageUrl);
    };
    reader.readAsDataURL(file);
  });
};
