import { Suspense } from 'react';
import WifiSignalAnimation from './WifiSignalAnimation';

// Main component that uses the WiFi signal animation
function AIModelVisualization() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white">
          Loading animation...
        </div>
      }
    >
      <WifiSignalAnimation />
    </Suspense>
  );
}

export default AIModelVisualization;
