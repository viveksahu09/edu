import React from "react";
import { Routes, Route } from "react-router-dom";
import UserList from "./UserList";
import AddUser from "../users/AddUser";

export default function UserManagement() {
  return (
    <Routes>
      <Route path="/" element={<UserList />} />
      <Route path="/add" element={<AddUser />} />
    </Routes>
  );
}
