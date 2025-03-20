import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import LiveMonitoring from './LiveMonitoring';
import Heatmaps from './Heatmaps';
import { Activity, Map } from 'lucide-react';

export default function UserDashboard({ user }) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('live');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Welcome, {user?.username}
      </motion.h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></span>
        </div>
      ) : (
        <Tabs
          defaultValue="live"
          className="space-y-4"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
            <TabsTrigger
              value="live"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <Activity className="mr-2 h-4 w-4" />
              <span>Live Monitoring</span>
            </TabsTrigger>
            <TabsTrigger
              value="heatmaps"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <Map className="mr-2 h-4 w-4" />
              <span>Heatmaps</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <TabsContent value="live">
                    <LiveMonitoring />
                  </TabsContent>
                  <TabsContent value="heatmaps">
                    <Heatmaps />
                  </TabsContent>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      )}
    </div>
  );
}
