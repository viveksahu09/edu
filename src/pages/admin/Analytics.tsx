import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, FileText, Download, Eye, Calendar, Filter } from "lucide-react";

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  enrolledStudents: number;
  totalDocuments: number;
  downloads: number;
  revenue: number;
  growthRate: number;
}

interface ChartData {
  name: string;
  users: number;
  courses: number;
  revenue: number;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    enrolledStudents: 0,
    totalDocuments: 0,
    downloads: 0,
    revenue: 0,
    growthRate: 0
  });
  const [timeRange, setTimeRange] = useState("7days");
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    // Load analytics data from localStorage or generate sample data
    const storedAnalytics = localStorage.getItem("adminAnalytics");
    if (storedAnalytics) {
      setAnalyticsData(JSON.parse(storedAnalytics));
    } else {
      // Generate sample analytics data
      const sampleData: AnalyticsData = {
        totalUsers: 1234,
        activeUsers: 856,
        totalCourses: 45,
        enrolledStudents: 2341,
        totalDocuments: 156,
        downloads: 5678,
        revenue: 45678.90,
        growthRate: 12.5
      };
      setAnalyticsData(sampleData);
      localStorage.setItem("adminAnalytics", JSON.stringify(sampleData));
    }

    // Generate sample chart data
    const sampleChartData: ChartData[] = [
      { name: "Mon", users: 120, courses: 8, revenue: 1200 },
      { name: "Tue", users: 145, courses: 12, revenue: 1450 },
      { name: "Wed", users: 167, courses: 15, revenue: 1670 },
      { name: "Thu", users: 189, courses: 18, revenue: 1890 },
      { name: "Fri", users: 234, courses: 22, revenue: 2340 },
      { name: "Sat", users: 156, courses: 10, revenue: 1560 },
      { name: "Sun", users: 134, courses: 9, revenue: 1340 }
    ];
    setChartData(sampleChartData);
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: analyticsData.totalUsers.toLocaleString(),
      change: `+${analyticsData.growthRate}%`,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Users",
      value: analyticsData.activeUsers.toLocaleString(),
      change: "+8.2%",
      icon: Eye,
      color: "text-green-600"
    },
    {
      title: "Total Courses",
      value: analyticsData.totalCourses,
      change: "+15.3%",
      icon: FileText,
      color: "text-purple-600"
    },
    {
      title: "Revenue",
      value: `$${analyticsData.revenue.toLocaleString()}`,
      change: "+23.1%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Monitor platform performance and user engagement</p>
      </div>

      {/* Time Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Activity Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
          <div className="space-y-4">
            {chartData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{data.name}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-900">{data.users}</span>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(data.users / 234) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Enrollment Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Enrollments</h3>
          <div className="space-y-4">
            {chartData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{data.name}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-900">{data.courses}</span>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(data.courses / 22) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
        <div className="space-y-4">
          {chartData.map((data, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{data.name}</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-900">${data.revenue}</span>
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(data.revenue / 2340) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Documents</span>
              <span className="text-sm font-medium text-gray-900">{analyticsData.totalDocuments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Downloads</span>
              <span className="text-sm font-medium text-gray-900">{analyticsData.downloads.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Downloads/Doc</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(analyticsData.downloads / analyticsData.totalDocuments)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Courses</h3>
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Courses</span>
              <span className="text-sm font-medium text-gray-900">{analyticsData.totalCourses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Enrolled Students</span>
              <span className="text-sm font-medium text-gray-900">{analyticsData.enrolledStudents.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Students/Course</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(analyticsData.enrolledStudents / analyticsData.totalCourses)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Users</h3>
            <Users className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Users</span>
              <span className="text-sm font-medium text-gray-900">{analyticsData.totalUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-sm font-medium text-gray-900">{analyticsData.activeUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Activity Rate</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round((analyticsData.activeUsers / analyticsData.totalUsers) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
