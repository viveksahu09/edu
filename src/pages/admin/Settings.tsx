import { useState, useEffect } from "react";
import { Settings, Save, RefreshCw, Bell, Mail, Shield, Globe, Palette } from "lucide-react";

interface Setting {
  id: string;
  category: string;
  label: string;
  value: string | boolean | number;
  type: "text" | "email" | "number" | "boolean" | "select";
  options?: string[];
  description?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [activeCategory, setActiveCategory] = useState("general");
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load settings from localStorage or generate sample data
    const storedSettings = localStorage.getItem("adminSettings");
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    } else {
      // Generate sample settings
      const sampleSettings: Setting[] = [
        // General Settings
        { id: "site_name", category: "general", label: "Site Name", value: "Edu Platform", type: "text", description: "The name of your educational platform" },
        { id: "site_description", category: "general", label: "Site Description", value: "Advanced Learning Platform", type: "text", description: "Brief description of your platform" },
        { id: "admin_email", category: "general", label: "Admin Email", value: "admin@edu.com", type: "email", description: "Contact email for administrative purposes" },
        { id: "max_users", category: "general", label: "Maximum Users", value: 1000, type: "number", description: "Maximum number of users allowed" },
        { id: "maintenance_mode", category: "general", label: "Maintenance Mode", value: false, type: "boolean", description: "Enable maintenance mode" },
        
        // Notification Settings
        { id: "email_notifications", category: "notifications", label: "Email Notifications", value: true, type: "boolean", description: "Send email notifications to users" },
        { id: "new_user_alerts", category: "notifications", label: "New User Alerts", value: true, type: "boolean", description: "Alert admins when new users register" },
        { id: "course_updates", category: "notifications", label: "Course Update Notifications", value: true, type: "boolean", description: "Notify users about course updates" },
        { id: "system_alerts", category: "notifications", label: "System Alerts", value: true, type: "boolean", description: "Send system status alerts" },
        
        // Security Settings
        { id: "password_min_length", category: "security", label: "Minimum Password Length", value: 8, type: "number", description: "Minimum required password length" },
        { id: "require_2fa", category: "security", label: "Require Two-Factor Authentication", value: false, type: "boolean", description: "Enforce 2FA for all users" },
        { id: "session_timeout", category: "security", label: "Session Timeout (minutes)", value: 30, type: "number", description: "Auto-logout after inactivity" },
        { id: "max_login_attempts", category: "security", label: "Max Login Attempts", value: 5, type: "number", description: "Maximum failed login attempts before lockout" },
        
        // Appearance Settings
        { id: "theme", category: "appearance", label: "Theme", value: "light", type: "select", options: ["light", "dark", "auto"], description: "Choose platform theme" },
        { id: "primary_color", category: "appearance", label: "Primary Color", value: "#4F46E5", type: "text", description: "Primary brand color" },
        { id: "logo_url", category: "appearance", label: "Logo URL", value: "", type: "text", description: "URL to custom logo image" },
        { id: "favicon_url", category: "appearance", label: "Favicon URL", value: "", type: "text", description: "URL to custom favicon" }
      ];
      setSettings(sampleSettings);
      localStorage.setItem("adminSettings", JSON.stringify(sampleSettings));
    }
  }, []);

  const categories = [
    { id: "general", label: "General", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette }
  ];

  const filteredSettings = settings.filter(setting => setting.category === activeCategory);

  const updateSetting = (settingId: string, value: any) => {
    setSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.id === settingId ? { ...setting, value } : setting
      )
    );
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem("adminSettings", JSON.stringify(settings));
      setHasChanges(false);
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      // Reset to default values
      setSettings(prevSettings => 
        prevSettings.map(setting => {
          switch (setting.id) {
            case "site_name": return { ...setting, value: "Edu Platform" };
            case "site_description": return { ...setting, value: "Advanced Learning Platform" };
            case "admin_email": return { ...setting, value: "admin@edu.com" };
            case "max_users": return { ...setting, value: 1000 };
            case "maintenance_mode": return { ...setting, value: false };
            case "email_notifications": return { ...setting, value: true };
            case "new_user_alerts": return { ...setting, value: true };
            case "course_updates": return { ...setting, value: true };
            case "system_alerts": return { ...setting, value: true };
            case "password_min_length": return { ...setting, value: 8 };
            case "require_2fa": return { ...setting, value: false };
            case "session_timeout": return { ...setting, value: 30 };
            case "max_login_attempts": return { ...setting, value: 5 };
            case "theme": return { ...setting, value: "light" };
            case "primary_color": return { ...setting, value: "#4F46E5" };
            case "logo_url": return { ...setting, value: "" };
            case "favicon_url": return { ...setting, value: "" };
            default: return setting;
          }
        })
      );
      setHasChanges(true);
    }
  };

  const renderSettingInput = (setting: Setting) => {
    switch (setting.type) {
      case "boolean":
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={setting.value as boolean}
              onChange={(e) => updateSetting(setting.id, e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              {setting.value ? "Enabled" : "Disabled"}
            </span>
          </label>
        );
      case "select":
        return (
          <select
            value={setting.value as string}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {setting.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case "number":
        return (
          <input
            type="number"
            value={setting.value as number}
            onChange={(e) => updateSetting(setting.id, parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        );
      case "email":
        return (
          <input
            type="email"
            value={setting.value as string}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        );
      default:
        return (
          <input
            type="text"
            value={setting.value as string}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure platform settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Category Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <nav className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeCategory === category.id
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {categories.find(c => c.id === activeCategory)?.label} Settings
                </h2>
                <div className="flex items-center gap-3">
                  {hasChanges && (
                    <span className="text-sm text-orange-600">Unsaved changes</span>
                  )}
                  <button
                    onClick={resetSettings}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </button>
                  <button
                    onClick={saveSettings}
                    disabled={!hasChanges || saving}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {filteredSettings.map((setting) => (
                <div key={setting.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {setting.label}
                    </label>
                    {setting.type === "boolean" && renderSettingInput(setting)}
                  </div>
                  {setting.type !== "boolean" && renderSettingInput(setting)}
                  {setting.description && (
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
