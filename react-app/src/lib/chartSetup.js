import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, BarController, LineController, Title, Tooltip, Legend, ChartDataLabels)

export const endsOnly = (ctx) => ctx.dataIndex === 0 || ctx.dataIndex === ctx.dataset.data.length - 1
