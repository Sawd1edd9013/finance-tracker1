import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export const LineChartComponent = ({ data, height = 250 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="income" stroke="#16a34a" />
        <Line type="monotone" dataKey="expense" stroke="#dc2626" />
      </LineChart>
    </ResponsiveContainer>
  );
};
