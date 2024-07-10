import { createEffect, createSignal, onMount } from "solid-js";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  Colors,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Bar } from "solid-chartjs";
import initDB from "../../../lib/storage/sqljs";
import { AccountTotal } from "../../../lib/storage";

export const Dashboard = () => {
  /**
   * You must register optional elements before using the chart,
   * otherwise you will have the most primitive UI
   */
  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors);
  });

  const { database } = initDB;
  const [chartData, setChartData] =
    createSignal<ChartData<"bar", { name: string; runningTotal: number }[]>>();

  createEffect(() => {
    const db = database();
    if (db) {
      const res = AccountTotal.getTotal(db);
      const chartData = {
        datasets: [
          {
            barThickness: 24,
            data: res.map((data) => ({
              name: data.name,
              runningTotal: data.startingBalance + data.currentBalance,
            })),
          },
        ],
      };
      setChartData(chartData);
      console.log(res);
    }
  });

  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    parsing: {
      yAxisKey: "name",
      xAxisKey: "runningTotal",
    },
    indexAxis: "y",
  };

  return (
    <div>
      <Bar data={chartData()} options={chartOptions} width={500} height={500} />
    </div>
  );
};
