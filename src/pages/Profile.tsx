import React, { useState } from "react";
import { Camera, Save } from "lucide-react";
import type { User } from "../types";

const guestUser: User = {
  id: "guest",
  name: "Guest User",
  email: "guest@example.com",
  institution: "Not Specified",
  preferences: {
    subjects: [],
    languages: ["English"],
  },
  progress: {
    savedNotes: 0,
    completedTopics: 0,
  },
};

export default function Profile() {
  const [user, setUser] = useState<User>(guestUser);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Handle profile update logic here
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="relative h-40 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg">
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              <img
                src={
                  user.profilePicture ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg">
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-20 px-6 pb-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Institution
                </label>
                <input
                  type="text"
                  value={user.institution}
                  onChange={(e) =>
                    setUser({ ...user, institution: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Learning Progress
              </h3>
              <dl className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Saved Notes
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-indigo-600 dark:text-indigo-400">
                    {user.progress.savedNotes}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Completed Topics
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-indigo-600 dark:text-indigo-400">
                    {user.progress.completedTopics}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
