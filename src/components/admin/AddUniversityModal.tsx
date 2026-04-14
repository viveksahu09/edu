import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { generateSlug, generateUniqueSlug } from "../../utils/slugGenerator";
import { universities } from "../../data/universities";

interface AddUniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUniversity: (university: any) => void;
}

export default function AddUniversityModal({ isOpen, onClose, onAddUniversity }: AddUniversityModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    notesCount: 0,
    studentCount: 0,
  });
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const existingSlugs = universities.map(u => u.slug);
  const searchResults = universities.filter(uni => 
    uni.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, name }));
    
    // Check for duplicates and show suggestions
    if (name.length > 2) {
      const similarUniversities = universities
        .filter(u => u.name.toLowerCase().includes(name.toLowerCase()))
        .map(u => u.name);
      
      setSuggestions(similarUniversities);
      setIsDuplicate(similarUniversities.length > 0);
    } else {
      setSuggestions([]);
      setIsDuplicate(false);
    }
  };

  const handleCreateUniversity = () => {
    if (isDuplicate || !formData.name.trim()) {
      return;
    }

    const slug = generateUniqueSlug(formData.name, existingSlugs);
    const newUniversity = {
      id: String(universities.length + 1),
      ...formData,
      slug,
      degree: [],
    };

    onAddUniversity(newUniversity);
    onClose();
    
    // Reset form
    setFormData({
      name: "",
      image: "",
      notesCount: 0,
      studentCount: 0,
    });
    setSuggestions([]);
    setSearchTerm("");
  };

  const handleSelectExisting = (university: any) => {
    onAddUniversity(university);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">University Options</h2>
        
        <div className="space-y-6">
          {/* Existing Universities */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Existing University</h3>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search University..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                {searchResults.map((university) => (
                  <button
                    key={university.id}
                    onClick={() => handleSelectExisting(university)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <span>{university.name}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Custom University Creation */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Create New University</h3>
            
            <div className="space-y-4">
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
                
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800 font-medium">
                      Similar universities found:
                    </p>
                    <ul className="text-sm text-yellow-700 mt-1">
                      {suggestions.map((suggestion, index) => (
                        <li key={index}>- {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/university-image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes Count
                  </label>
                  <input
                    type="number"
                    value={formData.notesCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, notesCount: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Count
                  </label>
                  <input
                    type="number"
                    value={formData.studentCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentCount: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateUniversity}
                disabled={isDuplicate || !formData.name.trim()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Create "{formData.name || 'New'}" University
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
