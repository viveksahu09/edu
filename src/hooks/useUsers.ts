import { useState, useEffect } from "react";
import type { User } from "../types";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      // Here you would typically fetch users from your API
      const mockUsers: User[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "admin",
          institution: "Example University",
          preferences: {
            subjects: ["Computer Science"],
            languages: ["English"],
          },
          progress: {
            savedNotes: 10,
            completedTopics: 5,
          },
        },
        // Add more mock users as needed
      ];

      setUsers(mockUsers);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (userData: Omit<User, "id">) => {
    try {
      // Here you would typically make an API call to create the user
      const newUser: User = {
        id: Math.random().toString(),
        ...userData,
      };
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err) {
      throw new Error("Failed to create user");
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Here you would typically make an API call to delete the user
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      throw new Error("Failed to delete user");
    }
  };

  return {
    users,
    isLoading,
    error,
    addUser,
    deleteUser,
    refreshUsers: fetchUsers,
  };
}
