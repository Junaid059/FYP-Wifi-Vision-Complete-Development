import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'

export default function HistoricalData() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Historical Data</h2>
        <Select>
          <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select data type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="motion">Motion Events</SelectItem>
            <SelectItem value="access">Access Logs</SelectItem>
            <SelectItem value="alarms">Alarm Triggers</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 border-white/20 col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Event Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-white/50">
              Event timeline visualization goes here
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Select Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="range"
              className="bg-white/10 border-white/20 rounded-md"
            />
          </CardContent>
        </Card>
      </div>
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] overflow-y-auto">
            {/* Placeholder for event details table */}
            <div className="text-center text-white/50 py-4">
              Select an event to view details
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

