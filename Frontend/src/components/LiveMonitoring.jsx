import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Users,
  Package,
  Wifi,
  AlertTriangle,
  Clock,
  Home,
} from 'lucide-react';

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

// Simulated data for the live feed
const generateRandomPositions = (count) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      strength: Math.random(),
      moving: Math.random() > 0.5,
    });
  }
  return positions;
};

export default function LiveMonitoring() {
  const [positions, setPositions] = useState(generateRandomPositions(7));
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('live');

  // Update positions every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.moving
            ? Math.max(0, Math.min(100, p.x + (Math.random() * 6 - 3)))
            : p.x,
          y: p.moving
            ? Math.max(0, Math.min(100, p.y + (Math.random() * 6 - 3)))
            : p.y,
          strength: Math.max(
            0.3,
            Math.min(1, p.strength + (Math.random() * 0.2 - 0.1))
          ),
          moving: Math.random() > 0.3 ? p.moving : !p.moving,
        }))
      );
    }, 3000);

    // Update time every second
    const timeInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen text-white">
      <FloatingCard>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Wifi className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Live Monitoring
              </h2>
              <p className="text-blue-300 text-sm">
                {time.toLocaleTimeString()} - Active Monitoring
              </p>
            </div>
          </div>

          <Select defaultValue="home">
            <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FloatingCard delay={0.1}>
          <FloatingElement className="h-full">
            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30 h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">
                  Active Devices
                </CardTitle>
                <div className="p-1.5 bg-blue-500/20 rounded-full">
                  <Activity className="h-4 w-4 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <div className="text-3xl font-bold text-white">12</div>
                  <div className="text-xl font-bold text-white/60">/15</div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                  <p className="text-xs text-red-300">3 devices offline</p>
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
          </FloatingElement>
        </FloatingCard>

        <FloatingCard delay={0.2}>
          <FloatingElement className="h-full">
            <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30 h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-100">
                  Detected Persons
                </CardTitle>
                <div className="p-1.5 bg-green-500/20 rounded-full">
                  <Users className="h-4 w-4 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">7</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <p className="text-xs text-amber-300">
                    2 in restricted areas
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-1">
                  {[...Array(7)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`h-6 rounded-full ${
                        i < 5 ? 'bg-green-400/80' : 'bg-amber-400/80'
                      }`}
                      initial={{ height: 0 }}
                      animate={{ height: 24 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </FloatingElement>
        </FloatingCard>

        <FloatingCard delay={0.3}>
          <FloatingElement className="h-full">
            <Card className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30 h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-amber-100">
                  Detected Objects
                </CardTitle>
                <div className="p-1.5 bg-amber-500/20 rounded-full">
                  <Package className="h-4 w-4 text-amber-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">23</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
                  <p className="text-xs text-purple-300">5 unidentified</p>
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
                  <span className="text-xs text-amber-300">78%</span>
                </div>
              </CardContent>
            </Card>
          </FloatingElement>
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
