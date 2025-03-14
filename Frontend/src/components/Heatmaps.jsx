import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  ArrowUpRight,
  Filter,
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

// Generate heatmap data
const generateHeatmapData = (width, height, hotspots = 3) => {
  const data = Array(height)
    .fill()
    .map(() => Array(width).fill(0));

  // Create hotspots
  for (let i = 0; i < hotspots; i++) {
    const centerX = Math.floor(Math.random() * width);
    const centerY = Math.floor(Math.random() * height);
    const intensity = 0.7 + Math.random() * 0.3; // 0.7 to 1.0
    const radius = 5 + Math.floor(Math.random() * 10); // 5 to 15

    // Fill the area around the hotspot
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const distance = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        if (distance < radius) {
          const value = intensity * (1 - distance / radius);
          data[y][x] = Math.max(data[y][x], value);
        }
      }
    }
  }

  // Add some random noise
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      data[y][x] += Math.random() * 0.1;
      data[y][x] = Math.min(1, data[y][x]);
    }
  }

  return data;
};

export default function Heatmaps() {
  const [selectedArea, setSelectedArea] = useState('lobby');
  const [timeRange, setTimeRange] = useState('day');
  const [heatmapData, setHeatmapData] = useState([]);
  const canvasRef = useRef(null);
  const [time, setTime] = useState(new Date());

  // Areas data
  const areas = {
    entrance: {
      name: 'Entrance',
      occupancy: '42%',
      peak: '9 AM - 11 AM',
      hotspots: 2,
    },
    lobby: {
      name: 'Lobby',
      occupancy: '65%',
      peak: '2 PM - 4 PM',
      hotspots: 3,
    },
    office: {
      name: 'Office Area',
      occupancy: '78%',
      peak: '10 AM - 12 PM',
      hotspots: 4,
    },
  };

  // Update time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Generate new heatmap data when area changes
  useEffect(() => {
    setHeatmapData(generateHeatmapData(50, 30, areas[selectedArea].hotspots));
  }, [selectedArea]);

  // Draw heatmap on canvas
  useEffect(() => {
    if (!canvasRef.current || heatmapData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate cell size
    const cellWidth = width / heatmapData[0].length;
    const cellHeight = height / heatmapData.length;

    // Draw heatmap
    for (let y = 0; y < heatmapData.length; y++) {
      for (let x = 0; x < heatmapData[0].length; x++) {
        const value = heatmapData[y][x];

        // Skip very low values
        if (value < 0.05) continue;

        // Calculate color based on value
        const r = Math.floor(255 * Math.min(1, value * 2));
        const g = Math.floor(255 * Math.min(1, 2 - value * 2));
        const b = Math.floor(100 * value);
        const a = value * 0.8;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.beginPath();
        ctx.arc(
          x * cellWidth + cellWidth / 2,
          y * cellHeight + cellHeight / 2,
          Math.max(cellWidth, cellHeight) * value * 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Draw room outline
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Draw entrance
    if (selectedArea === 'entrance' || selectedArea === 'lobby') {
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 30, height - 20);
      ctx.lineTo(width / 2 + 30, height - 20);
      ctx.stroke();

      // Label
      ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.font = '12px sans-serif';
      ctx.fillText('ENTRANCE', width / 2 - 30, height - 5);
    }

    // Draw furniture outlines based on area
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;

    if (selectedArea === 'lobby') {
      // Draw reception desk
      ctx.strokeRect(width / 2 - 60, 40, 120, 30);

      // Draw seating areas
      ctx.strokeRect(40, height / 2 - 40, 80, 80);
      ctx.strokeRect(width - 120, height / 2 - 40, 80, 80);
    } else if (selectedArea === 'office') {
      // Draw desks
      const deskWidth = 40;
      const deskHeight = 25;
      const startX = 60;
      const startY = 60;
      const spacingX = 80;
      const spacingY = 70;

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
          ctx.strokeRect(
            startX + col * spacingX,
            startY + row * spacingY,
            deskWidth,
            deskHeight
          );
        }
      }
    }
  }, [heatmapData, selectedArea]);

  // Handle area change
  const handleAreaChange = (value) => {
    setSelectedArea(value);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen text-white">
      <FloatingCard>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">Heatmaps</h2>
              <p className="text-purple-300 text-sm">
                {time.toLocaleTimeString()} - {areas[selectedArea].name}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <Select value={selectedArea} onValueChange={handleAreaChange}>
              <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrance">Entrance</SelectItem>
                <SelectItem value="lobby">Lobby</SelectItem>
                <SelectItem value="office">Office Area</SelectItem>
              </SelectContent>
            </Select>

            <Tabs
              value={timeRange}
              onValueChange={setTimeRange}
              className="bg-white/10 rounded-md"
            >
              <TabsList className="bg-transparent">
                <TabsTrigger
                  value="day"
                  className="data-[state=active]:bg-purple-500/30"
                >
                  Day
                </TabsTrigger>
                <TabsTrigger
                  value="week"
                  className="data-[state=active]:bg-purple-500/30"
                >
                  Week
                </TabsTrigger>
                <TabsTrigger
                  value="month"
                  className="data-[state=active]:bg-purple-500/30"
                >
                  Month
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </FloatingCard>

      <FloatingCard delay={0.1}>
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full aspect-video bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg"
              />

              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-slate-900/80 rounded-lg p-3 flex flex-col gap-2">
                <div className="text-xs font-medium text-white mb-1">
                  Activity Intensity
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>

              {/* Controls */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-slate-900/80 border-slate-700 text-white hover:bg-slate-800 h-8"
                >
                  <Filter className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Filter</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-slate-900/80 border-slate-700 text-white hover:bg-slate-800 h-8"
                >
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Date</span>
                </Button>
              </div>

              {/* Area name */}
              <div className="absolute top-4 left-4 bg-slate-900/80 rounded-lg px-3 py-1.5 text-sm font-medium text-white">
                {areas[selectedArea].name}
              </div>
            </div>
          </CardContent>
        </Card>
      </FloatingCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FloatingCard delay={0.2}>
          <FloatingElement className="h-full">
            <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30 h-full">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" />
                  Peak Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {areas[selectedArea].peak}
                </div>
                <p className="text-xs text-white/70 mt-1">
                  Highest activity detected
                </p>

                <div className="mt-4 grid grid-cols-12 gap-1">
                  {[...Array(12)].map((_, i) => {
                    const isPeak =
                      (selectedArea === 'entrance' && i >= 9 && i <= 11) ||
                      (selectedArea === 'lobby' && i >= 14 && i <= 16) ||
                      (selectedArea === 'office' && i >= 10 && i <= 12);

                    return (
                      <motion.div
                        key={i}
                        className={`h-12 rounded-md ${
                          isPeak ? 'bg-purple-500' : 'bg-purple-900/40'
                        }`}
                        initial={{ height: 0 }}
                        animate={{
                          height: isPeak ? 48 : 12 + Math.random() * 24,
                        }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>6AM</span>
                  <span>12PM</span>
                  <span>6PM</span>
                </div>
              </CardContent>
            </Card>
          </FloatingElement>
        </FloatingCard>

        <FloatingCard delay={0.3}>
          <FloatingElement className="h-full">
            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30 h-full">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  Average Occupancy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {areas[selectedArea].occupancy}
                </div>
                <p className="text-xs text-white/70 mt-1">Across all areas</p>

                <div className="mt-4 relative pt-5">
                  <div className="absolute -top-1 left-0 right-0 flex justify-between text-xs text-white/50">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                  <div className="h-2 w-full bg-blue-900/40 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500"
                      initial={{ width: '0%' }}
                      animate={{ width: areas[selectedArea].occupancy }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-green-400">
                      <ArrowUpRight className="h-3 w-3" />
                      <span>+12% from yesterday</span>
                    </div>
                    <div className="text-xs text-white/70">
                      <Clock className="h-3 w-3 inline mr-1" />
                      <span>Last 24h</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FloatingElement>
        </FloatingCard>

        <FloatingCard delay={0.4}>
          <FloatingElement className="h-full">
            <Card className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30 h-full">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  Hotspot Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {areas[selectedArea].hotspots}
                </div>
                <p className="text-xs text-white/70 mt-1">
                  Requiring attention
                </p>

                <div className="mt-4 space-y-2">
                  {[...Array(areas[selectedArea].hotspots)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <span className="text-xs text-white">
                          Hotspot {i + 1}
                        </span>
                      </div>
                      <div className="text-xs text-amber-300">
                        {Math.floor(70 + Math.random() * 30)}% activity
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 mt-2 border-t border-amber-500/20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70">Compared to average</span>
                      <span className="text-amber-300">+43%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FloatingElement>
        </FloatingCard>
      </div>

      <FloatingCard delay={0.5}>
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50">
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <CardTitle className="text-base font-medium">
              Activity Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-white mb-3">
                  Daily Distribution
                </h4>
                <div className="h-[120px] flex items-end gap-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                    (day, i) => (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <motion.div
                          className={`w-full rounded-t-sm ${
                            i === 3 ? 'bg-green-500' : 'bg-green-500/60'
                          }`}
                          initial={{ height: 0 }}
                          animate={{ height: `${20 + Math.random() * 80}px` }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                        />
                        <span className="text-xs text-slate-400">{day}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-3">
                  Activity by Area
                </h4>
                <div className="space-y-3">
                  {[
                    { name: 'Entrance', value: 42 },
                    { name: 'Lobby', value: 65 },
                    { name: 'Office', value: 78 },
                    { name: 'Meeting Rooms', value: 54 },
                  ].map((area, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">
                          {area.name}
                        </span>
                        <span className="text-xs font-medium text-white">
                          {area.value}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            area.name === selectedArea
                              ? 'bg-green-500'
                              : 'bg-green-500/60'
                          }`}
                          initial={{ width: '0%' }}
                          animate={{ width: `${area.value}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </FloatingCard>
    </div>
  );
}
