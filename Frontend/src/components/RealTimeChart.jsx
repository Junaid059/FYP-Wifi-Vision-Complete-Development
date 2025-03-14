import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  TimeScale
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

const options = {
  responsive: true,
  animation: {
    duration: 0
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
    },
  },
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Real-time System Metrics',
    },
  },
}

const initialData = {
  labels: [],
  datasets: [
    {
      label: 'CPU Usage',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Memory Usage',
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

export function RealTimeChart() {
  const [data, setData] = useState(initialData)

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = {
        labels: [...data.labels, new Date().toLocaleTimeString()].slice(-10),
        datasets: [
          {
            ...data.datasets[0],
            data: [...data.datasets[0].data, Math.random() * 100].slice(-10),
          },
          {
            ...data.datasets[1],
            data: [...data.datasets[1].data, Math.random() * 100].slice(-10),
          },
        ],
      }
      setData(newData)
    }, 2000)

    return () => clearInterval(interval)
  }, [data])

  return <Line options={options} data={data} />
}

