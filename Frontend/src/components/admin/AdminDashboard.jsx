'use client';

import { useEffect, useState, useCallback } from 'react';
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
  ArrowUp,
  Bell,
  Clock,
  Users,
  Eye,
  Box,
  Camera,
  Network,
  Server,
  Cpu,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getAuth, signOut } from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  where,
  getFirestore,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

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
  const [totalHumanDetections, setTotalHumanDetections] = useState(0);
  const [totalObjectDetections, setTotalObjectDetections] = useState(0);
  const [totalCameraEvents, setTotalCameraEvents] = useState(0);
  const [detectionAccuracy, setDetectionAccuracy] = useState({
    human: 0,
    object: 0,
  });
  const [alertsCount, setAlertsCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore(app);
  const [connectiondata, setConnectionData] = useState(0);
  const [connectionRequestData, setConnectionRequestData] = useState(0);
  const [alerts, setAlerts] = useState([]);

  // Server status metrics with simulated live data
  const [serverMetrics, setServerMetrics] = useState({
    cpu: 65,
    memory: 45,
    network: 45,
    disk: 72,
    temperature: 48,
    uptime: 45,
  });

  // Historical server metrics for charts
  const [serverHistory, setServerHistory] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('cpu');
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(true);

  // Fetch dashboard data from Firebase
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch human detections
        const humanDetectionsRef = collection(db, 'humanDetections');
        const humanSnapshot = await getDocs(humanDetectionsRef);
        setTotalHumanDetections(humanSnapshot.size);

        // Calculate human detection accuracy if available
        const humanAccuracy = humanSnapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          return data.accuracy ? acc + data.accuracy : acc;
        }, 0);

        // Fetch object detections
        const objectDetectionsRef = collection(db, 'objectDetections');
        const objectSnapshot = await getDocs(objectDetectionsRef);
        setTotalObjectDetections(objectSnapshot.size);

        // Calculate object detection accuracy if available
        const objectAccuracy = objectSnapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          return data.accuracy ? acc + data.accuracy : acc;
        }, 0);

        // Set accuracy percentages
        setDetectionAccuracy({
          human:
            humanSnapshot.size > 0
              ? Math.round((humanAccuracy / humanSnapshot.size) * 100)
              : 85,
          object:
            objectSnapshot.size > 0
              ? Math.round((objectAccuracy / objectSnapshot.size) * 100)
              : 92,
        });

        // Fetch camera events
        const cameraEventsRef = collection(db, 'cameraEvents');
        const eventsSnapshot = await getDocs(cameraEventsRef);
        setTotalCameraEvents(eventsSnapshot.size);

        // Fetch alerts
        const alertsRef = collection(db, 'alerts');
        const alertsQuery = query(alertsRef, where('read', '==', false));
        const alertsSnapshot = await getDocs(alertsQuery);
        setAlertsCount(alertsSnapshot.size);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
        setIsLoading(false);

        // Fallback to default values if Firebase fetch fails
        setTotalHumanDetections(0);
        setTotalObjectDetections(0);
        setTotalCameraEvents(0);
        setDetectionAccuracy({ human: 85, object: 92 });
        setAlertsCount(0);
      }
    };

    fetchDashboardData();

    // Set up a refresh interval (every 5 minutes)
    const refreshInterval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  const { users } = useUser();

  // Handle empty state (if users are undefined or null)
  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter((user) => user.isActive)?.length || 0;
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

  // Update the handleRefresh function to actually refresh the data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Fetch human detections
      const humanDetectionsRef = collection(db, 'humanDetections');
      const humanSnapshot = await getDocs(humanDetectionsRef);
      setTotalHumanDetections(humanSnapshot.size);

      // Fetch object detections
      const objectDetectionsRef = collection(db, 'objectDetections');
      const objectSnapshot = await getDocs(objectDetectionsRef);
      setTotalObjectDetections(objectSnapshot.size);

      // Fetch camera events
      const cameraEventsRef = collection(db, 'cameraEvents');
      const eventsSnapshot = await getDocs(cameraEventsRef);
      setTotalCameraEvents(eventsSnapshot.size);

      // Fetch alerts
      const alertsRef = collection(db, 'alerts');
      const alertsQuery = query(alertsRef, where('read', '==', false));
      const alertsSnapshot = await getDocs(alertsQuery);
      setAlertsCount(alertsSnapshot.size);

      // Fetch connections
      const connectionsRef = collection(db, 'connections');
      const connectionsSnapshot = await getDocs(connectionsRef);
      setConnectionData({ connectionscount: connectionsSnapshot.size });

      // Fetch connection requests
      const connectionRequestsRef = collection(db, 'connectionRequests');
      const connectionRequestsSnapshot = await getDocs(connectionRequestsRef);
      setConnectionRequestData({
        connectionrequestscount: connectionRequestsSnapshot.size,
      });

      // Update server metrics
      updateServerMetrics();
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 800);
    }
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

  useEffect(() => {
    const fetchConnectionsData = async () => {
      try {
        // Fetch connections
        const connectionsRef = collection(db, 'connections');
        const connectionsSnapshot = await getDocs(connectionsRef);
        setConnectionData({ connectionscount: connectionsSnapshot.size });

        // Fetch connection requests
        const connectionRequestsRef = collection(db, 'connectionRequests');
        const connectionRequestsSnapshot = await getDocs(connectionRequestsRef);
        setConnectionRequestData({
          connectionrequestscount: connectionRequestsSnapshot.size,
        });
      } catch (error) {
        console.error('Error fetching connection data:', error);
      }
    };

    fetchConnectionsData();

    // Set up a refresh interval (every 5 minutes)
    const refreshInterval = setInterval(() => {
      fetchConnectionsData();
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const alertsRef = collection(db, 'alerts');
        const alertsQuery = query(
          alertsRef,
          where('read', '==', false),
          orderBy('timestamp', 'desc')
        );

        // Set up a real-time listener for alerts
        const unsubscribe = onSnapshot(alertsQuery, (snapshot) => {
          const alertsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAlerts(alertsData);
          setAlertsCount(alertsData.length);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  // Function to update server metrics with simulated live data
  const updateServerMetrics = useCallback(() => {
    // Generate random fluctuations for metrics
    const randomFluctuation = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    setServerMetrics((prev) => {
      // Create new values with small random changes
      const newCpu = Math.min(
        100,
        Math.max(0, prev.cpu + randomFluctuation(-5, 5))
      );
      const newMemory = Math.min(
        100,
        Math.max(0, prev.memory + randomFluctuation(-3, 3))
      );
      const newNetwork = Math.min(
        100,
        Math.max(0, prev.network + randomFluctuation(-8, 8))
      );
      const newDisk = Math.min(
        100,
        Math.max(0, prev.disk + randomFluctuation(-1, 1))
      );
      const newTemp = Math.min(
        90,
        Math.max(35, prev.temperature + randomFluctuation(-2, 2))
      );

      // Add new data point to history
      const timestamp = new Date().toLocaleTimeString();
      setServerHistory((history) => {
        const newHistory = [
          ...history,
          {
            timestamp,
            cpu: newCpu,
            memory: newMemory,
            network: newNetwork,
            disk: newDisk,
            temperature: newTemp,
          },
        ];

        // Keep only the last 20 data points
        if (newHistory.length > 20) {
          return newHistory.slice(newHistory.length - 20);
        }
        return newHistory;
      });

      return {
        cpu: Math.round(newCpu),
        memory: Math.round(newMemory),
        network: Math.round(newNetwork),
        disk: Math.round(newDisk),
        temperature: Math.round(newTemp),
        uptime: prev.uptime,
      };
    });
  }, []);

  // Set up auto-refresh for server metrics
  useEffect(() => {
    let intervalId;

    if (isAutoRefreshing) {
      // Initial update
      updateServerMetrics();

      // Set interval for updates
      intervalId = setInterval(() => {
        updateServerMetrics();
      }, 3000); // Update every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoRefreshing, updateServerMetrics]);

  // Get color based on metric value
  const getMetricColor = (value) => {
    if (value < 50) return 'text-green-500';
    if (value < 80) return 'text-amber-500';
    return 'text-red-500';
  };

  // Get progress color based on metric value
  const getProgressColor = (value) => {
    if (value < 50) return 'bg-green-500';
    if (value < 80) return 'bg-amber-500';
    return 'bg-red-500';
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
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor your system and manage users from one place
          </p>
        </motion.div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {alertsCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                      {alertsCount > 9 ? '9+' : alertsCount}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-medium">Notifications</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      try {
                        const alertsRef = collection(db, 'alerts');
                        const alertsSnapshot = await getDocs(alertsRef);

                        // Update all alerts to read=true
                        const batch = db.batch();
                        alertsSnapshot.docs.forEach((doc) => {
                          batch.update(doc.ref, { read: true });
                        });

                        await batch.commit();
                        setAlertsCount(0);
                      } catch (error) {
                        console.error('Error marking alerts as read:', error);
                      }
                    }}
                  >
                    Mark all as read
                  </Button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center">Loading alerts...</div>
                  ) : alertsCount === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No new alerts
                    </div>
                  ) : (
                    <div className="p-2">
                      {/* We'll fetch and display actual alerts here */}
                      <div className="p-2 hover:bg-gray-50 rounded-md">
                        <div className="flex items-start gap-2">
                          <div className="h-2 w-2 mt-2 rounded-full bg-red-500"></div>
                          <div>
                            <p className="text-sm font-medium">
                              Security Alert
                            </p>
                            <p className="text-xs text-gray-500">
                              Unusual login detected from new location
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              2 minutes ago
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 hover:bg-gray-50 rounded-md">
                        <div className="flex items-start gap-2">
                          <div className="h-2 w-2 mt-2 rounded-full bg-amber-500"></div>
                          <div>
                            <p className="text-sm font-medium">
                              System Warning
                            </p>
                            <p className="text-xs text-gray-500">
                              High CPU usage detected on main server
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              15 minutes ago
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 hover:bg-gray-50 rounded-md">
                        <div className="flex items-start gap-2">
                          <div className="h-2 w-2 mt-2 rounded-full bg-blue-500"></div>
                          <div>
                            <p className="text-sm font-medium">
                              New User Registration
                            </p>
                            <p className="text-xs text-gray-500">
                              User John Doe has registered
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              1 hour ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-2 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
        </div>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mt-4"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Statistics Cards */}
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
                  Total Users
                </CardTitle>
                <CardDescription>Registered accounts</CardDescription>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalUsers}</div>
            {/* <div className="mt-2 flex items-center text-sm">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">Real-time</span>
              <span className="text-gray-500 ml-1">data from Firebase</span>
            </div> */}
            <div className="mt-4">
              <Progress
                value={(activeUsers / (totalUsers || 1)) * 100}
                className="h-2"
              />
              <div className="mt-1 text-xs text-gray-500 flex justify-between">
                <span>{activeUsers} active users</span>
                <span>{totalUsers - activeUsers} inactive</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-medium text-gray-800">
                  Total Connections
                </CardTitle>
                <CardDescription>Total Connections Count</CardDescription>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {isLoading ? (
                <div className="h-8 w-24 bg-purple-100 animate-pulse rounded"></div>
              ) : (
                JSON.stringify(connectiondata.connectionscount)
              )}
            </div>
            <div className="mt-2 flex items-center text-sm">
              {!isLoading && (
                <>
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">Real-time</span>
                  <span className="text-gray-500 ml-1">data from Firebase</span>
                </>
              )}
            </div>
            <div className="mt-4">
              <Progress value={detectionAccuracy.human} className="h-2" />
              <div className="mt-1 text-xs text-gray-500 flex justify-between">
                <span>{detectionAccuracy.human}% accuracy rate</span>
                {/* <span>24/7 monitoring</span> */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-medium text-gray-800">
                  Total Connection Requests
                </CardTitle>
                <CardDescription>Total Connection Requests</CardDescription>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Box className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {isLoading ? (
                <div className="h-8 w-24 bg-green-100 animate-pulse rounded"></div>
              ) : (
                JSON.stringify(connectionRequestData.connectionrequestscount)
              )}
            </div>
            <div className="mt-2 flex items-center text-sm">
              {!isLoading && (
                <>
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">Real-time</span>
                  <span className="text-gray-500 ml-1">data from Firebase</span>
                </>
              )}
            </div>
            <div className="mt-4">
              <Progress value={detectionAccuracy.object} className="h-2" />
              <div className="mt-1 text-xs text-gray-500 flex justify-between">
                <span>
                  {detectionAccuracy.object}% increase from last month
                </span>
                {/* <span>15 object categories</span> */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-medium text-gray-800">
                  Events
                </CardTitle>
                <CardDescription>Total recorded events</CardDescription>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <Camera className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {isLoading ? (
                <div className="h-8 w-24 bg-orange-100 animate-pulse rounded"></div>
              ) : (
                totalCameraEvents.toLocaleString()
              )}
            </div>
            <div className="mt-2 flex items-center text-sm">
              {!isLoading && (
                <>
                  <ArrowUp className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-orange-600 font-medium">Real-time</span>
                  <span className="text-gray-500 ml-1">data from Firebase</span>
                </>
              )}
            </div>
            <div className="mt-4">
              <Progress value={78} className="h-2" />
              <div className="mt-1 text-xs text-gray-500 flex justify-between">
                <span>78% alert rate</span>
                <span>22% false positives</span>
              </div>
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

      {/* Server Status - Enhanced Live Monitoring */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-semibold">
                  Server Status
                </CardTitle>
                <CardDescription>
                  Live monitoring of server resources
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={isAutoRefreshing ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsAutoRefreshing(!isAutoRefreshing)}
                  className="gap-2"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isAutoRefreshing ? 'animate-spin' : ''
                    }`}
                  />
                  {isAutoRefreshing ? 'Live' : 'Paused'}
                </Button>
                <Tabs
                  value={selectedMetric}
                  onValueChange={setSelectedMetric}
                  className="hidden md:block"
                >
                  <TabsList className="bg-gray-100">
                    <TabsTrigger value="cpu">CPU</TabsTrigger>
                    <TabsTrigger value="memory">Memory</TabsTrigger>
                    <TabsTrigger value="network">Network</TabsTrigger>
                    <TabsTrigger value="disk">Disk</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Live Metrics */}
              <div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Cpu
                          className={`h-5 w-5 ${getMetricColor(
                            serverMetrics.cpu
                          )} mr-2`}
                        />
                        <span className="font-medium">CPU Load</span>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={serverMetrics.cpu}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`text-lg font-bold ${getMetricColor(
                            serverMetrics.cpu
                          )}`}
                        >
                          {serverMetrics.cpu}%
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <Progress
                      value={serverMetrics.cpu}
                      className="h-2"
                      indicatorClassName={getProgressColor(serverMetrics.cpu)}
                    />
                    <div className="mt-2 text-xs text-gray-500 flex justify-between">
                      <span>4 cores @ 2.5GHz</span>
                      <span className={getMetricColor(serverMetrics.cpu)}>
                        {serverMetrics.cpu < 50
                          ? 'Normal'
                          : serverMetrics.cpu < 80
                          ? 'Moderate'
                          : 'High'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Server
                          className={`h-5 w-5 ${getMetricColor(
                            serverMetrics.memory
                          )} mr-2`}
                        />
                        <span className="font-medium">Memory</span>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={serverMetrics.memory}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`text-lg font-bold ${getMetricColor(
                            serverMetrics.memory
                          )}`}
                        >
                          {serverMetrics.memory}%
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <Progress
                      value={serverMetrics.memory}
                      className="h-2"
                      indicatorClassName={getProgressColor(
                        serverMetrics.memory
                      )}
                    />
                    <div className="mt-2 text-xs text-gray-500 flex justify-between">
                      <span>16GB DDR4 RAM</span>
                      <span className={getMetricColor(serverMetrics.memory)}>
                        {serverMetrics.memory < 50
                          ? 'Normal'
                          : serverMetrics.memory < 80
                          ? 'Moderate'
                          : 'High'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Network
                          className={`h-5 w-5 ${getMetricColor(
                            serverMetrics.network
                          )} mr-2`}
                        />
                        <span className="font-medium">Network</span>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={serverMetrics.network}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`text-lg font-bold ${getMetricColor(
                            serverMetrics.network
                          )}`}
                        >
                          {serverMetrics.network}%
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <Progress
                      value={serverMetrics.network}
                      className="h-2"
                      indicatorClassName={getProgressColor(
                        serverMetrics.network
                      )}
                    />
                    <div className="mt-2 text-xs text-gray-500 flex justify-between">
                      <span>1Gbps connection</span>
                      <span>{Math.round(serverMetrics.network * 10)} Mbps</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Activity
                          className={`h-5 w-5 ${getMetricColor(
                            serverMetrics.disk
                          )} mr-2`}
                        />
                        <span className="font-medium">Disk I/O</span>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={serverMetrics.disk}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`text-lg font-bold ${getMetricColor(
                            serverMetrics.disk
                          )}`}
                        >
                          {serverMetrics.disk}%
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <Progress
                      value={serverMetrics.disk}
                      className="h-2"
                      indicatorClassName={getProgressColor(serverMetrics.disk)}
                    />
                    <div className="mt-2 text-xs text-gray-500 flex justify-between">
                      <span>SSD Storage</span>
                      <span>{Math.round(serverMetrics.disk * 2)} MB/s</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="text-sm font-medium mb-2">Active Services</h3>
                  <div className="space-y-2">
                    {[
                      {
                        name: 'Web Server',
                        status: 'Running',
                        uptime: `${serverMetrics.uptime} days`,
                        load: Math.round(serverMetrics.cpu * 0.7),
                      },
                      {
                        name: 'Database',
                        status: 'Running',
                        uptime: `${serverMetrics.uptime} days`,
                        load: Math.round(serverMetrics.memory * 0.6),
                      },
                      {
                        name: 'API Gateway',
                        status: 'Running',
                        uptime: '12 days',
                        load: Math.round(serverMetrics.network * 0.8),
                      },
                      {
                        name: 'Monitoring',
                        status: 'Running',
                        uptime: `${serverMetrics.uptime} days`,
                        load: Math.round(serverMetrics.disk * 0.3),
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
                        <div className="flex items-center gap-2">
                          <Progress
                            value={service.load}
                            className="w-20 h-1.5"
                          />
                          <div className="text-xs text-gray-500">
                            {service.uptime}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metrics Chart */}
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={serverHistory}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      opacity={0.1}
                    />
                    <XAxis dataKey="timestamp" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                      }}
                    />
                    <Legend />
                    {selectedMetric === 'cpu' && (
                      <Line
                        type="monotone"
                        dataKey="cpu"
                        name="CPU Usage"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                        isAnimationActive={true}
                      />
                    )}
                    {selectedMetric === 'memory' && (
                      <Line
                        type="monotone"
                        dataKey="memory"
                        name="Memory Usage"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                        isAnimationActive={true}
                      />
                    )}
                    {selectedMetric === 'network' && (
                      <Line
                        type="monotone"
                        dataKey="network"
                        name="Network Traffic"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                        isAnimationActive={true}
                      />
                    )}
                    {selectedMetric === 'disk' && (
                      <Line
                        type="monotone"
                        dataKey="disk"
                        name="Disk I/O"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                        isAnimationActive={true}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="text-sm font-medium mb-2">System Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">
                    Operating System
                  </span>
                  <p className="text-sm font-medium">Linux Ubuntu 22.04 LTS</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">Kernel Version</span>
                  <p className="text-sm font-medium">5.15.0-58-generic</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">Last Reboot</span>
                  <p className="text-sm font-medium">
                    {serverMetrics.uptime} days ago
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">Temperature</span>
                  <p
                    className={`text-sm font-medium ${getMetricColor(
                      serverMetrics.temperature
                    )}`}
                  >
                    {serverMetrics.temperature}°C
                  </p>
                </div>
              </div>
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
                <div className="p-2 bg-red-50 rounded-md">
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-2 rounded-full bg-red-500"></div>
                    <div>
                      <p className="text-sm font-medium">Security Alert</p>
                      <p className="text-xs text-gray-500">
                        Unusual login detected from new location
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        2 minutes ago
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2 bg-amber-50 rounded-md">
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-2 rounded-full bg-amber-500"></div>
                    <div>
                      <p className="text-sm font-medium">System Warning</p>
                      <p className="text-xs text-gray-500">
                        High CPU usage detected on main server
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        15 minutes ago
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2 bg-blue-50 rounded-md">
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-2 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="text-sm font-medium">
                        New User Registration
                      </p>
                      <p className="text-xs text-gray-500">
                        User John Doe has registered
                      </p>
                      <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard;
