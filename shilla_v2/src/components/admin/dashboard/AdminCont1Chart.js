import axios from "axios";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
// Chart.js import 불러오기


// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const bkURL = process.env.REACT_APP_BACK_URL;

// 차트 옵션 설정
const options = {
  interaction: {
    intersect: true,
  },
  scales: {
    y: {
      ticks: {
        beginAtZero: {
          display: true,
        },
      }
    },
  },
  plugins: {
    legend: {
      position: "top",
    },
    datalabels: {
      display: false,
    },
  },
};


// chart1
const AdminCont1Chart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${bkURL}/admin/dashboard/person`)
        const labels =  response.data.map((item) => item.dateCalc)
        const personCnt = response.data.map((item) => item.personCnt)

        setChartData({
          labels: labels, 
          datasets: [
            {
              label: "월별 방문자 수",
              data: personCnt,
              backgroundColor: "#eebfd7",
              borderColor: "#eebfd7",
              fill: false,
              tension: 0.1,
            },
          ],
        })
      } catch (error) {
        console.error("데이터 가져오기 실패", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <Line options={options} data={chartData} width={350} height={350} />
    </div>
  )
}

export default AdminCont1Chart;