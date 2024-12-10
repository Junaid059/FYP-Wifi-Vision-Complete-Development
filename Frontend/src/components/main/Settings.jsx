import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bell, Mail, MessageSquare, Shield, Smartphone, User, Lock, Key, Clock, Database, Activity } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function Settings() {
  return (
    <div className="space-y-6">
      <motion.h2 
        className="text-2xl font-semibold text-gray-800 mb-4"
        {...fadeInUp}
      >
        System Settings
      </motion.h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={{
          initial: { opacity: 0 },
          animate: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeInUp}>
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg font-medium">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <Label className="flex flex-col">
                    <span className="font-medium">Email Notifications</span>
                    <span className="text-xs text-gray-500">Receive system alerts via email</span>
                  </Label>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-4">
                  <MessageSquare className="h-5 w-5 text-gray-500" />
                  <Label className="flex flex-col">
                    <span className="font-medium">SMS Notifications</span>
                    <span className="text-xs text-gray-500">Receive critical alerts via SMS</span>
                  </Label>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-4">
                  <Smartphone className="h-5 w-5 text-gray-500" />
                  <Label className="flex flex-col">
                    <span className="font-medium">Push Notifications</span>
                    <span className="text-xs text-gray-500">Receive alerts on your mobile device</span>
                  </Label>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg font-medium">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-2 hover:bg-purple-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-4">
                  <Key className="h-5 w-5 text-gray-500" />
                  <Label className="flex flex-col">
                    <span className="font-medium">Two-Factor Authentication</span>
                    <span className="text-xs text-gray-500">Add an extra layer of security</span>
                  </Label>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-2 hover:bg-purple-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-4">
                  <Lock className="h-5 w-5 text-gray-500" />
                  <Label className="flex flex-col">
                    <span className="font-medium">Password Requirements</span>
                    <span className="text-xs text-gray-500">Enforce strong passwords</span>
                  </Label>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-2 hover:bg-purple-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-4">
                  <Activity className="h-5 w-5 text-gray-500" />
                  <Label className="flex flex-col">
                    <span className="font-medium">Activity Logging</span>
                    <span className="text-xs text-gray-500">Track system activities</span>
                  </Label>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg font-medium">System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="font-medium">Motion Detection Sensitivity</Label>
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-medium">Data Retention Period</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="analytics" />
                <Label htmlFor="analytics" className="text-sm">Enable Analytics</Label>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg font-medium">User Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-medium">Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-medium">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-medium">Time Zone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div 
        className="flex justify-end"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
          Save Changes
        </Button>
      </motion.div>
    </div>
  )
}

