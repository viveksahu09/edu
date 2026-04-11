import React from "react";
import { Routes, Route } from "react-router-dom";
import NavigationList from "../navigation/NavigationList";
import AddNavigation from "../navigation/AddNavigation";

export default function NavigationManagement() {
  return (
    <Routes>
      <Route path="/" element={<NavigationList />} />
      <Route path="/add" element={<AddNavigation />} />
    </Routes>
  );
}
