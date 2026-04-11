import React from "react";
import { Routes, Route } from "react-router-dom";
import RoleList from "../roles/RoleList";
import AddRole from "../roles/AddRole";

export default function RoleManagement() {
  return (
    <Routes>
      <Route path="/" element={<RoleList />} />
      <Route path="/add" element={<AddRole />} />
    </Routes>
  );
}
