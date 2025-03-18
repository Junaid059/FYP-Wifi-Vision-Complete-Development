import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../ui/card';
import {
  Activity,
  ArrowUp,
  ArrowDown,
  Clock,
  Shield,
  Database,
  Cpu,
  Server,
  Network,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogOut } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';

// Dynamically import recharts components to avoid SSR issues
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

function AdminDashboard({ onLogout }) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [systemHealth, setSystemHealth] = useState(92);
  const [cpuUsage, setCpuUsage] = useState(68);
  const [memoryUsage, setMemoryUsage] = useState(45);
  const [diskUsage, setDiskUsage] = useState(32);
  const [alertsCount, setAlertsCount] = useState(5);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  // Simulate changing metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) =>
        Math.round(
          Math.max(30, Math.min(90, prev + (Math.random() - 0.5) * 10))
        )
      );
      setMemoryUsage((prev) =>
        Math.round(Math.max(20, Math.min(80, prev + (Math.random() - 0.5) * 8)))
      );
      setDiskUsage((prev) =>
        Math.round(Math.max(20, Math.min(70, prev + (Math.random() - 0.5) * 5)))
      );
      setSystemHealth((prev) =>
        Math.round(Math.max(80, Math.min(98, prev + (Math.random() - 0.5) * 3)))
      );
      setAlertsCount(Math.floor(Math.random() * 3) + 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const { users } = useUser();

  // Handle empty state (if users are undefined or null)
  // const totalUsers = users?.length || 0;
  // const activeUsers = users?.filter((user) => user.isActive)?.length || 0;
  const adminCount =
    users?.filter((user) => user.role === 'admin')?.length || 0;
  const superUserCount =
    users?.filter((user) => user.role === 'super')?.length || 0;
  const regularUserCount =
    users?.filter((user) => user.role === 'user')?.length || 0;

  // Data for role distribution chart
  const roleData = [
    { name: 'Admin', value: adminCount, color: '#ef4444' },
    { name: 'Super User', value: superUserCount, color: '#3b82f6' },
    { name: 'Regular User', value: regularUserCount, color: '#10b981' },
  ];

  // Data for user activity chart (mock data)
  const activityData = [
    { name: 'Mon', users: 3, logins: 12, actions: 45 },
    { name: 'Tue', users: 5, logins: 18, actions: 56 },
    { name: 'Wed', users: 7, logins: 24, actions: 75 },
    { name: 'Thu', users: 4, logins: 16, actions: 42 },
    { name: 'Fri', users: 6, logins: 22, actions: 65 },
    { name: 'Sat', users: 2, logins: 8, actions: 30 },
    { name: 'Sun', users: 1, logins: 5, actions: 15 },
  ];

  // System performance data
  const performanceData = [
    { time: '00:00', cpu: 45, memory: 60, network: 30 },
    { time: '04:00', cpu: 30, memory: 55, network: 25 },
    { time: '08:00', cpu: 65, memory: 70, network: 60 },
    { time: '12:00', cpu: 85, memory: 75, network: 70 },
    { time: '16:00', cpu: 75, memory: 65, network: 55 },
    { time: '20:00', cpu: 60, memory: 60, network: 40 },
    { time: '23:59', cpu: 50, memory: 58, network: 35 },
  ];

  // Recent alerts data
  const recentAlerts = [
    {
      id: 1,
      type: 'CPU Spike',
      severity: 'high',
      time: '10 minutes ago',
      message: 'Server CPU usage exceeded 90%',
    },
    {
      id: 2,
      type: 'Login Attempt',
      severity: 'medium',
      time: '25 minutes ago',
      message: 'Failed login attempt from unknown IP',
    },
    {
      id: 3,
      type: 'Disk Space',
      severity: 'low',
      time: '1 hour ago',
      message: 'Storage reaching capacity (75%)',
    },
    {
      id: 4,
      type: 'New User',
      severity: 'info',
      time: '3 hours ago',
      message: 'New user account created',
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);

      if (onLogout) {
        onLogout();
      }
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'info':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case 'info':
        return <Activity className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor your system and manage users from one place
          </p>
        </motion.div>

        <div className="flex items-center gap-2">
          <Tabs value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={handleRefresh}
          >
            <Clock
              className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-red-500"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-medium text-gray-800">
                  System Health
                </CardTitle>
                <CardDescription>Overall status</CardDescription>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {systemHealth}%
            </div>
            <div className="mt-2 flex items-center text-sm">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">3.2%</span>
              <span className="text-gray-500 ml-1">from last week</span>
            </div>
            <div className="mt-4">
              <Progress value={systemHealth} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-medium text-gray-800">
                  CPU Usage
                </CardTitle>
                <CardDescription>Current load</CardDescription>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Cpu className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {cpuUsage}%
            </div>
            <div className="mt-2 flex items-center text-sm">
              <ArrowUp className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-yellow-600 font-medium">8.1%</span>
              <span className="text-gray-500 ml-1">from average</span>
            </div>
            <div className="mt-4">
              <Progress value={cpuUsage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-medium text-gray-800">
                  Memory
                </CardTitle>
                <CardDescription>RAM utilization</CardDescription>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {memoryUsage}%
            </div>
            <div className="mt-2 flex items-center text-sm">
              <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">2.3%</span>
              <span className="text-gray-500 ml-1">from yesterday</span>
            </div>
            <div className="mt-4">
              <Progress value={memoryUsage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-medium text-gray-800">
                  Storage
                </CardTitle>
                <CardDescription>Disk usage</CardDescription>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <Database className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {diskUsage}%
            </div>
            <div className="mt-2 flex items-center text-sm">
              <ArrowUp className="h-4 w-4 text-orange-500 mr-1" />
              <span className="text-orange-600 font-medium">0.8%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
            <div className="mt-4">
              <Progress value={diskUsage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* User Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="md:col-span-2 border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-semibold">
                User Activity
              </CardTitle>
              <CardDescription>
                Weekly overview of user engagement
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-medium">
              {selectedTimeRange === 'day'
                ? 'Last 24 hours'
                : selectedTimeRange === 'week'
                ? 'Last 7 days'
                : selectedTimeRange === 'month'
                ? 'Last 30 days'
                : 'Last 12 months'}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activityData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorLogins"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorActions"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.1}
                  />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="Active Users"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                  <Area
                    type="monotone"
                    dataKey="logins"
                    name="Login Events"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorLogins)"
                  />
                  <Area
                    type="monotone"
                    dataKey="actions"
                    name="User Actions"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorActions)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">
              User Distribution
            </CardTitle>
            <CardDescription>Breakdown by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} users`]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="flex flex-col items-center justify-center p-2 bg-red-50 rounded-lg">
                <span className="text-xs text-gray-500">Admins</span>
                <span className="text-lg font-bold text-red-600">
                  {adminCount}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 bg-blue-50 rounded-lg">
                <span className="text-xs text-gray-500">Super Users</span>
                <span className="text-lg font-bold text-blue-600">
                  {superUserCount}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 bg-green-50 rounded-lg">
                <span className="text-xs text-gray-500">Regular Users</span>
                <span className="text-lg font-bold text-green-600">
                  {regularUserCount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">
              System Performance
            </CardTitle>
            <CardDescription>24-hour monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.1}
                  />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cpu"
                    name="CPU Usage"
                    stroke="#ef4444"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="memory"
                    name="Memory Usage"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="network"
                    name="Network Traffic"
                    stroke="#10b981"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent User Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-semibold">
                    Recent User Activity
                  </CardTitle>
                  <CardDescription>
                    Latest user actions and logins
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.slice(0, 5).map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40`}
                          alt={user.username}
                        />
                        <AvatarFallback
                          className={
                            user.role === 'admin'
                              ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white'
                              : user.role === 'super'
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                              : 'bg-gradient-to-br from-green-500 to-teal-600 text-white'
                          }
                        >
                          {user.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={
                          user.role === 'admin'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : user.role === 'super'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-green-50 text-green-700 border-green-200'
                        }
                      >
                        {user.role}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleString()
                          : 'Never logged in'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-semibold">
                    System Alerts
                  </CardTitle>
                  <CardDescription>
                    Recent notifications and warnings
                  </CardDescription>
                </div>
                <Badge>{alertsCount} New</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            alert.severity === 'high'
                              ? 'bg-red-100'
                              : alert.severity === 'medium'
                              ? 'bg-yellow-100'
                              : alert.severity === 'low'
                              ? 'bg-blue-100'
                              : 'bg-green-100'
                          }`}
                        >
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium text-sm">
                              {alert.type}
                            </h3>
                            <Badge
                              className={`ml-2 ${getSeverityColor(
                                alert.severity
                              )}`}
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {alert.message}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {alert.time}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Server Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">
              Server Status
            </CardTitle>
            <CardDescription>
              Real-time monitoring of server resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Cpu className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="font-medium">CPU Load</span>
                  </div>
                  <span className="text-sm font-bold">{cpuUsage}%</span>
                </div>
                <Progress value={cpuUsage} className="h-2" />
                <p className="text-xs text-gray-500">4 cores @ 2.5GHz</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Server className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="font-medium">Memory Usage</span>
                  </div>
                  <span className="text-sm font-bold">{memoryUsage}%</span>
                </div>
                <Progress value={memoryUsage} className="h-2" />
                <p className="text-xs text-gray-500">16GB DDR4 RAM</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Network className="h-5 w-5 text-green-500 mr-2" />
                    <span className="font-medium">Network Traffic</span>
                  </div>
                  <span className="text-sm font-bold">45 Mbps</span>
                </div>
                <Progress value={45} className="h-2" />
                <p className="text-xs text-gray-500">1Gbps connection</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium mb-2">Active Services</h3>
                <div className="space-y-2">
                  {[
                    {
                      name: 'Web Server',
                      status: 'Running',
                      uptime: '45 days',
                    },
                    { name: 'Database', status: 'Running', uptime: '45 days' },
                    {
                      name: 'API Gateway',
                      status: 'Running',
                      uptime: '12 days',
                    },
                    {
                      name: 'Monitoring',
                      status: 'Running',
                      uptime: '45 days',
                    },
                  ].map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm">{service.name}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {service.uptime} uptime
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium mb-2">System Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Operating System:</span>
                    <span>Linux Ubuntu 22.04 LTS</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Kernel Version:</span>
                    <span>5.15.0-58-generic</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Last Reboot:</span>
                    <span>45 days ago</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">IP Address:</span>
                    <span>192.168.1.100</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;
