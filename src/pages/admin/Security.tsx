import { useState, useEffect } from "react";
import { Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw, Eye, EyeOff, Lock, Key, User, Activity, Search } from "lucide-react";

interface SecurityLog {
  id: string;
  type: "login" | "logout" | "failed_login" | "password_change" | "suspicious_activity";
  user: string;
  email: string;
  ip: string;
  timestamp: string;
  details: string;
  severity: "low" | "medium" | "high";
}

interface SecuritySetting {
  id: string;
  name: string;
  value: boolean;
  description: string;
}

export default function SecurityPage() {
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Load security logs from localStorage or generate sample data
    const storedLogs = localStorage.getItem("adminSecurityLogs");
    if (storedLogs) {
      setSecurityLogs(JSON.parse(storedLogs));
    } else {
      // Generate sample security logs
      const sampleLogs: SecurityLog[] = [
        {
          id: "1",
          type: "login",
          user: "John Doe",
          email: "john.doe@example.com",
          ip: "192.168.1.100",
          timestamp: "2024-04-15 10:30:45",
          details: "Successful login from Chrome browser",
          severity: "low"
        },
        {
          id: "2",
          type: "failed_login",
          user: "Unknown",
          email: "unknown@hacker.com",
          ip: "192.168.1.101",
          timestamp: "2024-04-15 10:25:12",
          details: "Failed login attempt - invalid credentials",
          severity: "medium"
        },
        {
          id: "3",
          type: "suspicious_activity",
          user: "Jane Smith",
          email: "jane.smith@example.com",
          ip: "192.168.1.102",
          timestamp: "2024-04-15 09:45:33",
          details: "Multiple login attempts from different locations",
          severity: "high"
        },
        {
          id: "4",
          type: "password_change",
          user: "Bob Johnson",
          email: "bob.johnson@example.com",
          ip: "192.168.1.103",
          timestamp: "2024-04-14 15:20:18",
          details: "Password successfully changed",
          severity: "low"
        }
      ];
      setSecurityLogs(sampleLogs);
      localStorage.setItem("adminSecurityLogs", JSON.stringify(sampleLogs));
    }

    // Load security settings
    const storedSettings = localStorage.getItem("adminSecuritySettings");
    if (storedSettings) {
      setSecuritySettings(JSON.parse(storedSettings));
    } else {
      // Generate sample security settings
      const sampleSettings: SecuritySetting[] = [
        {
          id: "two_factor_auth",
          name: "Two-Factor Authentication",
          value: false,
          description: "Require 2FA for all admin users"
        },
        {
          id: "ip_whitelist",
          name: "IP Whitelist",
          value: false,
          description: "Only allow access from whitelisted IP addresses"
        },
        {
          id: "session_timeout",
          name: "Session Timeout",
          value: true,
          description: "Automatically logout inactive sessions"
        },
        {
          id: "login_notifications",
          name: "Login Notifications",
          value: true,
          description: "Send email notifications for new logins"
        },
        {
          id: "audit_logging",
          name: "Audit Logging",
          value: true,
          description: "Log all administrative actions"
        },
        {
          id: "rate_limiting",
          name: "Rate Limiting",
          value: true,
          description: "Limit login attempts per IP address"
        }
      ];
      setSecuritySettings(sampleSettings);
      localStorage.setItem("adminSecuritySettings", JSON.stringify(sampleSettings));
    }
  }, []);

  const filteredLogs = securityLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === "all" || log.severity === selectedSeverity;
    const matchesType = selectedType === "all" || log.type === selectedType;
    return matchesSearch && matchesSeverity && matchesType;
  });

  const updateSecuritySetting = (settingId: string, value: boolean) => {
    const updatedSettings = securitySettings.map(setting =>
      setting.id === settingId ? { ...setting, value } : setting
    );
    setSecuritySettings(updatedSettings);
    localStorage.setItem("adminSecuritySettings", JSON.stringify(updatedSettings));
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "login": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "logout": return <User className="h-4 w-4 text-blue-600" />;
      case "failed_login": return <XCircle className="h-4 w-4 text-red-600" />;
      case "password_change": return <Key className="h-4 w-4 text-purple-600" />;
      case "suspicious_activity": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const stats = {
    total: securityLogs.length,
    high: securityLogs.filter(l => l.severity === "high").length,
    medium: securityLogs.filter(l => l.severity === "medium").length,
    today: securityLogs.filter(l => l.timestamp.startsWith(new Date().toISOString().split('T')[0])).length
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Security Center</h1>
        <p className="text-gray-600">Monitor security events and manage security settings</p>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-red-600">{stats.high}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Medium Risk</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
            </div>
            <Activity className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-2xl font-bold text-green-600">{stats.today}</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securitySettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{setting.name}</h3>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={setting.value}
                  onChange={(e) => updateSecuritySetting(setting.id, e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {setting.value ? "Enabled" : "Disabled"}
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Security Logs */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Logs</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search security logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="failed_login">Failed Login</option>
              <option value="password_change">Password Change</option>
              <option value="suspicious_activity">Suspicious Activity</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(log.type)}
                      <span className="text-sm text-gray-900 capitalize">{log.type.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{log.user}</div>
                      <div className="text-sm text-gray-500">{log.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs truncate" title={log.details}>
                      {log.details}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityBadgeColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No security logs found matching your criteria
        </div>
      )}
    </div>
  );
}
