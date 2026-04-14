import React, { useState, useEffect } from "react";
import { Save, User, Mail, Building, Calendar, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ImageUpload from "../../components/profile/ImageUpload";
import { uploadImage } from "../../services/profile";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    institution: user?.institution || "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log("Profile: Checking auth, isAuthenticated =", isAuthenticated);
    if (!isAuthenticated) {
      // Debug logging
      console.log("Profile: Auth state", { isAuthenticated, user: user?.name, userRole: user?.role });
      console.log("Profile: User role check:", { userRole: user?.role, isSuperAdmin: user?.role === 'SUPER_ADMIN' });
      console.log("Profile: User object:", user);
      console.log("Profile: Raw user.role value:", user?.role);
      console.log("Profile: Type of user.role:", typeof user?.role);
      console.log("Profile: Redirecting to login");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = await uploadImage(file);
      // For now, just log the upload - we'll implement profile updates later
      console.log("Profile picture uploaded:", imageUrl);
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updatedUser = { ...user, ...formData };
      // For now, just log the update - we'll implement profile updates later
      console.log("Profile updated:", updatedUser);
      setIsEditing(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Please log in to view your profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in to view and edit your profile information.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Profile Header */}
        <div className="relative h-40 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg">
          <div className="absolute -bottom-16 left-6">
            <ImageUpload
              currentImage={user.profilePicture}
              onImageUpload={handleImageUpload}
            />
          </div>
        </div>

        {/* User Info Display */}
        <div className="pt-20 px-6 pb-6">
          <div className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                  {user.institution && (
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {user.institution}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date((user as any).createdAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  (user.role as string) === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  (user.role as string) === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  (user.role as string) === 'educator' || (user.role as string) === 'teacher' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  (user.role as string) === 'researcher' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                  (user.role as string) === 'student' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  <Award className="w-3 h-3 mr-1" />
                  <span className="capitalize">{user.role}</span>
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
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
                  value={formData.institution}
                  onChange={(e) =>
                    setFormData({ ...formData, institution: e.target.value })
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
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          institution: user.institution,
                        });
                      }}
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
                    {user.progress?.savedNotes || 0}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Completed Topics
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-green-600 dark:text-green-400">
                    {user.progress?.completedTopics || 0}
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
