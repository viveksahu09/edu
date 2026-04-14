import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { generateSlug, generateUniqueSlug } from "../../utils/slugGenerator";
import { universities } from "../../data/universities";

interface UniversityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (university: any) => void;
  mode?: "add" | "edit";
  initialData?: any;
}

export default function UniversityForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  mode = "add",
  initialData = null 
}: UniversityFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    image: initialData?.image || "",
  });
  
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const existingSlugs = universities.map(u => u.slug);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, name }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File upload triggered:', file);
    if (file) {
      setUploadedImage(file);
      
      // Create preview URL for immediate display
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('FileReader completed:', reader.result);
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Debug useEffect to track form changes
  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      return;
    }

    // Simple ID generation using timestamp
    const newId = String(Date.now());

    const universityData = {
      id: newId,
      ...formData,
      slug: generateUniqueSlug(formData.name, existingSlugs),
      degree: [],
    };

    onSubmit(universityData);
    onClose();
    
    // Reset form
    setFormData({
      name: "",
      image: "",
    });
    setUploadedImage(null);
  };

  const handleCancel = () => {
    onClose();
    // Reset form
    setFormData({
      name: "",
      image: "",
    });
    setUploadedImage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "add" ? "Add University" : "Edit University"}
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Create New University Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Create New University
              </h3>
              
              <div className="space-y-4">
                {/* University Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter university name"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  
                  {/* Generated Slug Preview */}
                  {formData.name && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">
                        Generated URL: /university/{generateSlug(formData.name)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University Image
                  </label>
                  
                  {/* File Upload */}
                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-2">
                      Upload Image File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 file:mr-2 file:py-2"
                    />
                  </div>
                  
                  {/* OR Separator */}
                  <div className="flex items-center my-3">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-3 text-xs text-gray-500">OR</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                  
                  {/* URL Input */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">
                      Enter Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/university-image.jpg"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      key={formData.image}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Image Preview */}
                  {formData.image && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-600 mb-1">
                        Image Preview:
                        {uploadedImage && " (Uploaded from file)"}
                      </div>
                      <img 
                        src={formData.image} 
                        alt="University preview"
                        key={formData.image}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!formData.name.trim()}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            style={{ marginLeft: '2rem' }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add University
          </button>
        </div>
      </div>
    </div>
  );
}
