import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@radix-ui/react-progress'
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const generateData = () => {
  const now = new Date()
  return Array.from({ length: 10 }, (_, i) => ({
    time: new Date(now.getTime() - (9 - i) * 1000).toLocaleTimeString(),
    cpu: Math.floor(Math.random() * 100),
    memory: Math.floor(Math.random() * 100),
    network: Math.floor(Math.random() * 100),
  }))
}

export default function SystemStatus() {
  const [data, setData] = React.useState(generateData())

  React.useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [
          ...prev.slice(1),
          {
            time: new Date().toLocaleTimeString(),
            cpu: Math.floor(Math.random() * 100),
            memory: Math.floor(Math.random() * 100),
            network: Math.floor(Math.random() * 100),
          },
        ]
        return newData
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Get the latest data point for progress
  const latestData = data[data.length - 1]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">System Status</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Operational</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-gray-500">Systems running smoothly</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Warnings</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-gray-500">Require attention</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Card className="bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-gray-500">Immediate action needed</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">CPU Usage</p>
                <Progress value={latestData.cpu} className="h-2 rounded bg-gray-200" />
                <p className="text-xs text-gray-500 mt-1">{latestData.cpu}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Memory Usage</p>
                <Progress value={latestData.memory} className="h-2 rounded bg-gray-200" />
                <p className="text-xs text-gray-500 mt-1">{latestData.memory}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Network Usage</p>
                <Progress value={latestData.network} className="h-2 rounded bg-gray-200" />
                <p className="text-xs text-gray-500 mt-1">{latestData.network}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium">System Metrics Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cpu"
                    stroke="#ef4444"
                    name="CPU Usage"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="memory"
                    stroke="#3b82f6"
                    name="Memory Usage"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="network"
                    stroke="#10b981"
                    name="Network Usage"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
