import React from 'react';
import { ChartData } from '../types/presentation';

// Add type definition for the global Recharts object from the CDN
declare global {
  interface Window {
    Recharts: any;
  }
}

interface SlideChartProps {
  chartData: ChartData;
}

const SlideChart: React.FC<SlideChartProps> = ({ chartData }) => {
  // Wait until the component renders to access the global Recharts object.
  // This ensures the CDN script has had time to load.
  if (!window.Recharts) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Loading chart library...</p>
      </div>
    );
  }

  const {
    ResponsiveContainer,
    BarChart,
    LineChart,
    PieChart,
    Bar,
    Line,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
  } = window.Recharts;

  const { type, title, data, dataKey, color } = chartData;
  const isDark = document.documentElement.classList.contains('dark');
  const axisColor = isDark ? '#94a3b8' : '#64748b'; // slate-400, slate-500
  const gridColor = isDark ? '#334155' : '#e2e8f0'; // slate-700, slate-200

  const chartColor = color || (isDark ? '#f472b6' : '#db2777'); // pink-400, pink-600

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                borderColor: isDark ? '#334155' : '#e2e8f0',
              }}
            />
            <Legend />
            <Bar dataKey={dataKey} fill={chartColor} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                borderColor: isDark ? '#334155' : '#e2e8f0',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke={chartColor} activeDot={{ r: 8 }} />
          </LineChart>
        );
      case 'pie':
        const COLORS = ['#f472b6', '#818cf8', '#4ade80', '#fbbf24', '#60a5fa'];
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: { name: string, percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={'80%'}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                borderColor: isDark ? '#334155' : '#e2e8f0',
              }}
            />
          </PieChart>
        );
      default:
        return <p>Unsupported chart type</p>;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <h4 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4">{title}</h4>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default SlideChart;