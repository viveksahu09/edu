import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "lucide-react";
import Breadcrumbs from "../../components/admin/Breadcrumbs";

export default function AddNavigation() {
  const navigate = useNavigate();
  const [navItem, setNavItem] = useState({
    title: "",
    path: "",
    order: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle navigation item creation logic here
    navigate("/admin/navigation");
  };

  return (
    <div>
      <Breadcrumbs />
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Navigation className="h-6 w-6 text-indigo-600 mr-2" />
            <h1 className="text-2xl font-bold">Add Navigation Item</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={navItem.title}
                onChange={(e) =>
                  setNavItem({ ...navItem, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Path
              </label>
              <input
                type="text"
                value={navItem.path}
                onChange={(e) =>
                  setNavItem({ ...navItem, path: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Order
              </label>
              <input
                type="number"
                value={navItem.order}
                onChange={(e) =>
                  setNavItem({ ...navItem, order: parseInt(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/admin/navigation")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Navigation Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
