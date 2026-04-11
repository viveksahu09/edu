import React from "react";
import { Routes, Route } from "react-router-dom";
import DocumentList from "../documents/DocumentList";
import UploadDocument from "../documents/UploadDocument";

export default function DocumentManagement() {
  return (
    <Routes>
      <Route path="/" element={<DocumentList />} />
      <Route path="/upload" element={<UploadDocument />} />
    </Routes>
  );
}
