import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Package } from 'lucide-react';

export default function LiveMonitoring() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Live Monitoring
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Devices
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">12/15</div>
            <p className="text-xs text-gray-500">3 devices offline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Detected Persons
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">7</div>
            <p className="text-xs text-gray-500">2 in restricted areas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Detected Objects
            </CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">23</div>
            <p className="text-xs text-gray-500">5 unidentified</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Live Feed
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
