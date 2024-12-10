import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import LiveMonitoring from './LiveMonitoring'
import Heatmaps from './Heatmaps'
import SystemStatus from './SystemStatus'
import Settings from './Settings'
import HistoricalData from './HistoricalData'
import { Activity, Map, SettingsIcon, Clock, BarChart2 } from 'lucide-react'
import { HourglassLoader } from './HourglassLoader'

export default function Dashboard({ user }) {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('live')

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Welcome, {user.username}
      </motion.h1>

      {isLoading ? (
        <HourglassLoader />
      ) : (
        <Tabs 
          defaultValue="live" 
          className="space-y-4"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-gray-100 rounded-lg p-1">
            <TabsTrigger 
              value="live" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <Activity className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Live</span>
            </TabsTrigger>
            <TabsTrigger 
              value="heatmaps" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <Map className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Heatmaps</span>
            </TabsTrigger>
            <TabsTrigger 
              value="status" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Status</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger 
              value="historical" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <Clock className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">History</span>
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
                  <TabsContent value="status">
                    <SystemStatus />
                  </TabsContent>
                  <TabsContent value="settings">
                    <Settings />
                  </TabsContent>
                  <TabsContent value="historical">
                    <HistoricalData />
                  </TabsContent>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      )}
    </div>
  )
}

