export const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    password: "Admin123!",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    email: "user@example.com",
    password: "User123!",
    name: "Regular User",
    role: "user",
  },
];

export const mockAuth = {
  login: (email: string, password: string) => {
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      return Promise.resolve({ ...user, password: undefined });
    }
    return Promise.reject(new Error("Invalid credentials"));
  },

  register: (email: string, password: string, name: string) => {
    if (mockUsers.some((u) => u.email === email)) {
      return Promise.reject(new Error("Email already exists"));
    }
    const newUser = {
      id: String(mockUsers.length + 1),
      email,
      password,
      name,
      role: "user",
    };
    mockUsers.push(newUser);
    return Promise.resolve({ ...newUser, password: undefined });
  },

  resetPassword: (email: string) => {
    const user = mockUsers.find((u) => u.email === email);
    if (user) {
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error("User not found"));
  },
};
