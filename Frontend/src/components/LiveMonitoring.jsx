import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Lottie from 'lottie-react';
import {
  Activity,
  Users,
  Package,
  Wifi,
  AlertTriangle,
  Clock,
  Home,
} from 'lucide-react';

// Import Lottie animations
// These are placeholders - you'll need to replace these with your actual Lottie JSON files
import bedAnimation from '../animations/bed.json';
import fallAnimation from '../animations/fall.json';
import pickupAnimation from '../animations/pickup.json';
import runAnimation from '../animations/run.json';
import sitdownAnimation from '../animations/sitdown.json';
import standupAnimation from '../animations/standup.json';
import walkAnimation from '../animations/walk.json';

// Animation mapping object
const activityAnimations = {
  bed: bedAnimation,
  fall: fallAnimation,
  pickup: pickupAnimation,
  run: runAnimation,
  sitdown: sitdownAnimation, 
  standup: standupAnimation,
  walk: walkAnimation
};

// Floating animation components
export function FloatingCard({ children, className, delay = 0 }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.5,
        y: {
          type: 'spring',
          damping: 10,
          stiffness: 100,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FloatingElement({ children, className }) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PulsingElement({ children, className }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.03, 1],
        opacity: [0.9, 1, 0.9],
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Define activities that should have static positions
const staticActivities = ['sitdown', 'pickup'];
const minorMovementActivities = ['walk', 'standup'];
const majorMovementActivities = ['run', 'fall'];

// Store the last position to prevent rapid changes
let lastPosition = null;

// Modified position generation with activity-based stability
const generatePositionFromSignal = (rssi, noise, activity) => {
  // If we have a last position and this is a static activity, return the same position
  if (lastPosition && staticActivities.includes(activity)) {
    return lastPosition;
  }

  // RSSI typically ranges from -30 dBm (very close) to -90 dBm (very far)
  const MIN_RSSI = -90;
  const MAX_RSSI = -30;
  
  // Normalize RSSI to a range between 0 and 1
  const normalizedRssi = Math.max(0, Math.min(1, 
    (rssi - MIN_RSSI) / (MAX_RSSI - MIN_RSSI)));
  
  // Calculate distance from center
  const maxDistance = 0.5;
  const distance = maxDistance * (1 - normalizedRssi);
  
  // Add reduced randomness based on noise and activity
  const noiseLevel = Math.min(1, Math.max(0, (noise + 100) / 50));
  
  // Adjust randomness based on activity type
  let randomFactor = 0;
  if (majorMovementActivities.includes(activity)) {
    randomFactor = noiseLevel * 0.15; // Less random for major movement activities
  } else if (minorMovementActivities.includes(activity)) {
    randomFactor = noiseLevel * 0.05; // Very slight movement for minor movement activities
  } else {
    randomFactor = noiseLevel * 0.02; // Almost no randomness for other activities
  }
  
  // If we have a last position, make changes more gradual
  if (lastPosition) {
    // Calculate new position with minimal movement
    const newX = lastPosition.x + (Math.random() * 2 - 1) * randomFactor * 5;
    const newY = lastPosition.y + (Math.random() * 2 - 1) * randomFactor * 5;
    
    const newPosition = {
      id: 0,
      x: Math.max(0, Math.min(100, newX)),
      y: Math.max(0, Math.min(100, newY)),
      strength: normalizedRssi,
      moving: !staticActivities.includes(activity) && Math.random() > 0.7 // Less likely to be moving for stability
    };
    
    lastPosition = newPosition;
    return newPosition;
  }
  
  // Generate a position from scratch if there's no last position
  const angle = Math.random() * 2 * Math.PI;
  const randomDistance = distance * (1 + (Math.random() * 2 - 1) * randomFactor);
  
  // Convert to cartesian coordinates
  const x = 50 + randomDistance * Math.cos(angle) * 100;
  const y = 50 + randomDistance * Math.sin(angle) * 100;
  
  const newPosition = {
    id: 0,
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
    strength: normalizedRssi,
    moving: !staticActivities.includes(activity) && Math.random() > 0.7
  };
  
  lastPosition = newPosition;
  return newPosition;
};

// Activity Recognition Component
function ActivityRecognition({ activityData }) {
  const { prediction, confidence, rssi, noise, probabilities } = activityData || {};
  
  if (!prediction) {
    return (
      <Card className="bg-gradient-to-br from-white-500/20 to-white-600/10 border-purple-500/30 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black-100">
            Activity Recognition
          </CardTitle>
          <div className="p-1.5 bg-purple-500/20 rounded-full">
            <Activity className="h-4 w-4 text-black-400" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <p>Waiting for activity data...</p>
        </CardContent>
      </Card>
    );
  }

  // Get the right animation based on prediction
  const currentAnimation = activityAnimations[prediction] || activityAnimations.standup;

  return (
    <Card className="bg-gradient-to-br from-white-500/20 to-white-600/10 border-purple-500/30 h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-black-100">
          Activity Recognition
        </CardTitle>
        <div className="p-1.5 bg-purple-500/20 rounded-full">
          <Activity className="h-4 w-4 text-black-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {/* Lottie Animation */}
          <div className="w-40 h-40">
            <Lottie animationData={currentAnimation} loop={true} />
          </div>
          
          {/* Activity Label */}
          <h3 className="text-xl font-bold capitalize text-black mt-2">
            {prediction}
          </h3>
          
          {/* Confidence */}
          <div className="mt-2 w-full">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-black">Confidence</span>
              <span className="text-xs font-bold text-black">
                {(confidence * 100).toFixed(2)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-700/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-purple-400"
                initial={{ width: '0%' }}
                animate={{ width: `${confidence * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          {/* Signal Strength */}
          <div className="mt-3 flex justify-between w-full items-center">
            <div className="flex items-center gap-1">
              <Wifi className="h-3 w-3 text-black" />
              <span className="text-xs text-black">RSSI: {rssi} dBm</span>
            </div>
            <span className="text-xs text-black">SNR: {rssi - noise} dB</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LiveMonitoring() {
  const [positions, setPositions] = useState([]);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('live');
  const [activityData, setActivityData] = useState(null);
  const [lastPositionUpdateTime, setLastPositionUpdateTime] = useState(null);

  // Update positions when new activity data comes in
  useEffect(() => {
    if (activityData && activityData.rssi && activityData.noise) {
      // Only update position every 3 seconds to maintain stability
      const shouldUpdatePosition = !lastPositionUpdateTime || 
        (new Date().getTime() - lastPositionUpdateTime.getTime()) > 3000;
      
      if (shouldUpdatePosition) {
        const newPosition = generatePositionFromSignal(
          activityData.rssi, 
          activityData.noise,
          activityData.prediction
        );
        setPositions([newPosition]);
        setLastPositionUpdateTime(new Date());
      }
    }
  }, [activityData]);

  // SSE connection for activity data
  useEffect(() => {
    let eventSource = null;
    
    const connectToStream = () => {
      console.log('Connecting to SSE stream...');
      
      // Close any existing connection
      if (eventSource) {
        eventSource.close();
      }
      
      // Create a new EventSource connection
      eventSource = new EventSource('http://localhost:5000/stream');
      
      // Connection opened
      eventSource.onopen = () => {
        console.log('SSE connection established');
      };
      
      // Message received
      eventSource.onmessage = (event) => {
        try {
          console.log('Raw SSE data:', event.data);
          const data = JSON.parse(event.data);
          console.log('Parsed activity data:', data);
          setActivityData(data);
        } catch (err) {
          console.error('Error parsing SSE data:', err);
        }
      };
      
      // Error handling
      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        eventSource.close();
        
        // Try to reconnect after a delay
        setTimeout(() => {
          console.log('Attempting to reconnect...');
          connectToStream();
        }, 3000);
      };
    };
    
    // Initial connection
    connectToStream();
    
    // Cleanup on component unmount
    return () => {
      if (eventSource) {
        console.log('Closing SSE connection');
        eventSource.close();
      }
    };
  }, []);

  // Update time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="space-y-6 p-6 min-h-screen text-black">
      {/* Existing header */}
      <FloatingCard>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Wifi className="h-6 w-6 text-black-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-black">
                Live Monitoring
              </h2>
              <p className="text-black-300 text-sm">
                {time.toLocaleTimeString()} - Active Monitoring
              </p>
            </div>
          </div>

          <Select defaultValue="home">
            <SelectTrigger className="w-[180px] bg-black/10 border-black/20 text-black">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="backyard">Backyard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FloatingCard>

      {/* Top row of cards - add Activity Recognition */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FloatingCard delay={0.4}>
          <ActivityRecognition activityData={activityData} />
        </FloatingCard>
        <FloatingCard delay={0.1}>
          <Card className="bg-gradient-to-br from-white-500/20 to-white-600/10 border-blue-500/30 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black-100">
                Active Devices
              </CardTitle>
              <div className="p-1.5 bg-blue-500/20 rounded-full">
                <Activity className="h-4 w-4 text-blacl-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-bold text-black">1</div>
                <div className="text-xl font-bold text-black/60">/3</div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-900 animate-pulse"></div>
                <p className="text-xs text-red-300">2 devices offline</p>
              </div>
              <div className="mt-4 h-1 w-full bg-blue-900/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-400"
                  initial={{ width: '0%' }}
                  animate={{ width: '80%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </CardContent>
          </Card>
        </FloatingCard>

        <FloatingCard delay={0.2}>
          <Card className="bg-gradient-to-br from-white-500/20 to-white-600/10 border-green-500/30 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black-100">
                Detected Persons
              </CardTitle>
              <div className="p-1.5 bg-green-500/20 rounded-full">
                <Users className="h-4 w-4 text-black-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">1</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
                <p className="text-xs text-black">
                  0 in restricted areas
                </p>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-1">
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-6 rounded-full ${
                      i < 5 ? 'bg-blue-400/80' : 'bg-amber-400/80'
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: 24 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </FloatingCard>

        <FloatingCard delay={0.3}>
          <Card className="bg-gradient-to-br from-white-500/20 to-white-600/10 border-amber-500/30 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">
                Detected Objects
              </CardTitle>
              <div className="p-1.5 bg-amber-500/20 rounded-full">
                <Package className="h-4 w-4 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">0</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
                <p className="text-xs text-black">0 unidentified</p>
              </div>
              <div className="mt-4 flex items-center gap-1">
                <div className="flex-1 h-1 bg-amber-900/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-amber-400"
                    initial={{ width: '0%' }}
                    animate={{ width: '78%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-xs text-amber-300">0%</span>
              </div>
            </CardContent>
          </Card>
        </FloatingCard>
      </div>

      <FloatingCard delay={0.4}>
        <Tabs
          defaultValue="live"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-white/10">
              <TabsTrigger
                value="live"
                className="data-[state=active]:bg-blue-500/30"
              >
                Live Feed
              </TabsTrigger>
              <TabsTrigger
                value="floorplan"
                className="data-[state=active]:bg-blue-500/30"
              >
                Floor Plan
              </TabsTrigger>
              <TabsTrigger
                value="alerts"
                className="data-[state=active]:bg-blue-500/30"
              >
                Alerts
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300">Last updated: Just now</span>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50">
            <CardContent className="p-0">
              <TabsContent value="live" className="m-0">
                <div className="aspect-video bg-slate-950/50 rounded-lg overflow-hidden relative p-4">
                  {/* WiFi signal visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* Home floor plan outline */}
                      <div className="absolute inset-4 border-2 border-blue-500/30 rounded-xl"></div>

                      {/* WiFi source */}
                      <PulsingElement className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                          <div className="relative h-8 w-8 bg-blue-500/40 rounded-full flex items-center justify-center">
                            <Wifi className="h-4 w-4 text-blue-300" />
                          </div>
                        </div>
                      </PulsingElement>

                      {/* WiFi rings */}
                      {[1, 2, 3, 4].map((ring) => (
                        <motion.div
                          key={ring}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/30"
                          initial={{ width: 0, height: 0, opacity: 0.8 }}
                          animate={{
                            width: `${ring * 25}%`,
                            height: `${ring * 25}%`,
                            opacity: 0.1,
                          }}
                          transition={{
                            duration: 4,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: ring * 0.5,
                            ease: 'linear',
                          }}
                        />
                      ))}

                      {/* Detected persons */}
                      {positions.map((person) => (
                        <motion.div
                          key={person.id}
                          className="absolute"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{
                            left: `${person.x}%`,
                            top: `${person.y}%`,
                          }}
                        >
                          <motion.div
                            className={`h-4 w-4 rounded-full ${
                              person.moving ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.7, 1, 0.7],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: 'easeInOut',
                            }}
                          />
                          <motion.div
                            className={`absolute -inset-1 rounded-full ${
                              person.moving
                                ? 'border-green-500/30'
                                : 'border-blue-500/30'
                            } border`}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: 'easeInOut',
                            }}
                          />
                        </motion.div>
                      ))}

                      {/* Alert for restricted area */}
                      <motion.div
                        className="absolute bottom-[20%] right-[15%] text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-md flex items-center gap-1"
                        animate={{
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: 'easeInOut',
                        }}
                      >
                        <AlertTriangle className="h-3 w-3" />
                        <span>Restricted Area</span>
                      </motion.div>

                      {/* Activity Information Panel */}
                      {activityData && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3 w-64 shadow-lg"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="h-4 w-4 text-purple-400" />
                            <h3 className="text-sm font-medium text-white">Current Activity</h3>
                          </div>
                          
                          {/* Add Lottie animation in the panel */}
                          <div className="flex justify-center mb-2">
                            <div className="w-24 h-24">
                              <Lottie 
                                animationData={activityAnimations[activityData.prediction] || activityAnimations.standup} 
                                loop={true} 
                              />
                            </div>
                          </div>
                          
                          <div className="text-xs text-slate-300">
                            <div className="flex justify-between mb-1">
                              <span>Activity:</span>
                              <span className="font-bold capitalize">{activityData.prediction}</span>
                            </div>
                            
                            {/* Confidence bar */}
                            <div className="mb-2">
                              <div className="flex justify-between items-center mb-1">
                                <span>Confidence:</span>
                                <span>{(activityData.confidence * 100).toFixed(1)}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-purple-400"
                                  initial={{ width: '0%' }}
                                  animate={{ width: `${activityData.confidence * 100}%` }}
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                            </div>
                            
                            {/* Signal metrics */}
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="bg-slate-700/30 p-1 rounded">
                                <div className="flex items-center gap-1">
                                  <Wifi className="h-3 w-3 text-blue-400" />
                                  <span>RSSI</span>
                                </div>
                                <div className="text-right font-mono">{activityData.rssi} dBm</div>
                              </div>
                              <div className="bg-slate-700/30 p-1 rounded">
                                <div className="flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3 text-amber-400" />
                                  <span>Noise</span>
                                </div>
                                <div className="text-right font-mono">{activityData.noise} dBm</div>
                              </div>
                              <div className="bg-slate-700/30 p-1 rounded col-span-2">
                                <div className="flex items-center gap-1">
                                  <Activity className="h-3 w-3 text-green-400" />
                                  <span>SNR</span>
                                </div>
                                <div className="text-right font-mono">{activityData.rssi - activityData.noise} dB</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 text-xs text-blue-300 bg-slate-900/70 px-2 py-1 rounded flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    <span>Main Floor</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="floorplan" className="m-0">
                <div className="aspect-video bg-slate-950/50 rounded-lg overflow-hidden flex items-center justify-center text-slate-400">
                  Floor Plan View
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="m-0">
                <div className="aspect-video bg-slate-950/50 rounded-lg overflow-hidden flex items-center justify-center text-slate-400">
                  Alerts Panel
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </FloatingCard>

      <FloatingCard delay={0.5}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Activity className="h-5 w-5 text-purple-400" />
              </div>
              <CardTitle className="text-base font-medium">
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  time: '14:32',
                  event: 'Person detected in living room',
                  status: 'normal',
                },
                {
                  time: '14:15',
                  event: 'Movement in restricted area',
                  status: 'warning',
                },
                {
                  time: '13:50',
                  event: 'New device connected',
                  status: 'info',
                },
                {
                  time: '13:22',
                  event: 'Signal strength decreased',
                  status: 'info',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`h-3 w-3 mt-1.5 rounded-full ${
                      item.status === 'warning'
                        ? 'bg-amber-500'
                        : item.status === 'normal'
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-white">
                        {item.event}
                      </p>
                      <span className="text-xs text-slate-400">
                        {item.time}
                      </span>
                    </div>
                    <div className="h-px w-full bg-slate-700/50 mt-3"></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Wifi className="h-5 w-5 text-blue-400" />
              </div>
              <CardTitle className="text-base font-medium">
                Signal Strength
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Living Room', strength: 92 },
                  { name: 'Kitchen', strength: 78 },
                  { name: 'Bedroom', strength: 65 },
                  { name: 'Basement', strength: 45 },
                ].map((area, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">
                        {area.name}
                      </span>
                      <span className="text-sm font-medium text-white">
                        {area.strength}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          area.strength > 80
                            ? 'bg-green-500'
                            : area.strength > 60
                            ? 'bg-blue-500'
                            : area.strength > 40
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        initial={{ width: '0%' }}
                        animate={{ width: `${area.strength}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </FloatingCard>
    </div>
  );
}
