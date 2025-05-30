
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

function CategoryPieChart({ data }) {
  if (data.length === 0) return <p className="text-center text-gray-500">No expense data</p>;

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        dataKey="amount"
        nameKey="category"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}

export default CategoryPieChart;
