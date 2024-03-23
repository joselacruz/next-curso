import { Chart as Chartjs, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

Chartjs.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Chart({ ChartData }) {
  return (
    <>
      <Bar
        data={ChartData}
        options={{
          title: { display: true, text: 'Categorys', fontSize: 20 },
          legend: {
            display: true,
            position: 'right',
          },
        }}
      ></Bar>
    </>
  );
}
