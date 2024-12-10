import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Heatmaps() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Heatmaps</h2>
        <Select>
          <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entrance">Entrance</SelectItem>
            <SelectItem value="lobby">Lobby</SelectItem>
            <SelectItem value="office">Office Area</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="bg-white/10 border-white/20">
        <CardContent className="p-0">
          <div className="aspect-video bg-gradient-to-br from-red-900/50 to-blue-900/50 rounded-lg overflow-hidden">
            {/* Placeholder for heatmap visualization */}
            <div className="w-full h-full flex items-center justify-center text-white/50">
              Heatmap Visualization
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Peak Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 PM - 4 PM</div>
            <p className="text-xs text-white/70">Highest activity detected</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <p className="text-xs text-white/70">Across all areas</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Hotspot Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-white/70">Requiring attention</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

