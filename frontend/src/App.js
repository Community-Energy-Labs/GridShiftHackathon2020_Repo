import React from 'react';
import './App.scss';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Legend, Area } from 'recharts';

const CustomizedXAxisTick = ({x, y, stroke, payload,}) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value}</text>
    </g>
  );
}

function App() {
  const data = [
    {
      Time: '0', Renewables: 4000, You: 2400,
    },
    {
      Time: '4', Renewables: 3000, You: 1398,
    },
    {
      Time: '8', Renewables: 2000, You: 9800,
    },
    {
      Time: '12', Renewables: 2780, You: 3908,
    },
    {
      Time: '16', Renewables: 1890, You: 4800,
    },
    {
      Time: '20', Renewables: 2390, You: 3800,
    },
    {
      Time: '24', Renewables: 3490, You: 4300,
    },
  ];
  return (
    <div className="App">
      <ResponsiveContainer
        className='ResponsiveContainer'
        width='95%'
        height={250} 
      >
        <AreaChart 
          data={data} 
          margin={{
            right: 50
          }} 
        >
          <XAxis 
            dataKey="Time" 
            tick={<CustomizedXAxisTick />} 
          />
          <YAxis 
            tick={false} 
            yAxisId="left" 
          />
          <YAxis 
            tick={false} 
            yAxisId="right" 
            orientation="right" 
          />
          <CartesianGrid 
            vertical={false} 
            horizontalPoints={[100]} 
          />
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="Renewables" 
            stroke="#CCDB2A" 
            strokeWidth={4}
            fillOpacity={0} 
          />
          <Area 
            yAxisId="right"
            type="monotone" 
            dataKey="You" 
            stroke="#003E52" 
            strokeWidth={4}
            fillOpacity={0} 
          />
          <Legend
            align='right'
            layout='vertical'
            iconType='plainline'
            wrapperStyle={{
              top: 80,
              right: 50
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
