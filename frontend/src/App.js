import React, { Component, useState } from 'react'
import './App.scss'

import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Legend, Area } from 'recharts'

import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import DateImg from './images/calendar_no_number_noborder.png'
import DateImgHover from './images/calendar_no_number_onhover.png'
import { format, subDays } from 'date-fns'

import ProfileIcon from './images/header-person-icon.png'
import CELCornerLogo from './images/cel-corner-logo.png'
import NotificationLogo from './images/cel-mock-ups-V4-18-red-empty.png'
import NotificationLogoHover from './images/cel-mock-ups-V4-18-red-selected.png'

import { getCombinedData } from './utils/dataService'

const CustomizedXAxisTick = ({x, y, stroke, payload,}) => {
  return (
    <g transform={`translate(${x * 1.03},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#999997">{payload.value}</text>
    </g>
  )
}
const CustomizedXLabel = (props) => {
  return (
    <text 
      x={240}  
      y={275} 
      fill="#999997" 
      style={{
        fontSize: '20px'
      }}
    >
      Hour
    </text>
  )
}
const CustomizedY1Label = (props) => {
  return (
    <text 
      x={-130}  
      y={50} 
      fill="#003E52" 
      transform="rotate(-90)"
      style={{
        fontSize: '20px'
      }}
    >
      Watts
    </text>
  )
}
const CustomizedY2Label = (props) => {
  return (
    <text 
      className='CustomizedY2Label'
      x={80} 
      y={-470} 
      fill="#CCDB2A" 
      transform="rotate(90)"
      style={{
        fontSize: '20px',
      }}
    >
      MW
    </text>
  )
}
class ExampleCustomInput extends Component {
  render() {
    const {value, onClick} = this.props
    return (
      <div 
        className="DatepickerWrapper"
      >
        <img 
          className='DatepickerImg'
          src={DateImg} 
          alt="date"
        />
        <img 
          className='DatepickerImg-hover'
          src={DateImgHover} 
          alt="date-hover"
          onClick={onClick} 
        />
        <p className='Datepicker-txt'>Here's the deal for<br/>{value}</p>
      </div>
    )
  }
}
const combinedData = getCombinedData()

function App() {
  const [data, setData] = useState(combinedData)
  const [startDate, setStartDate] = useState(subDays(new Date(), 1))

  const handleDateChange = (date) => {
    // removes time of day variance
    date = format(date, 'yyyy-MM-dd')
    setStartDate(new Date(date))
    setData(getCombinedData())
  }

  return (
    <div className="App">
      <div className="nav-bar-container">
        <img 
          className='CELCornerLogo'
          src={CELCornerLogo} 
          alt="cel logo"
        />
        <header
          className='Header'
        >
          <img 
            className='ProfileIcon'
            src={ProfileIcon} 
            alt="profile icon"
          />
          <div className="NotificationWrapper">
            <img 
              className='NotificationLogo'
              src={NotificationLogo} 
              alt="notification logo"
            />
            <img 
              className='NotificationLogoHover'
              src={NotificationLogoHover} 
              alt="notification logo hover"
            />
          </div>
        </header>
      </div>

      <div className="date-container">
        <DatePicker 
          selected={startDate} 
          onChange={handleDateChange}
          customInput={<ExampleCustomInput />}
          maxDate={subDays(new Date(), 1)}
          placeholderText="Select a date that isn't in the future"
        />
      </div>

      <ResponsiveContainer
        className='ResponsiveContainer'
        width='95%'
        height={280} 
      >
        <AreaChart 
          data={data} 
          margin={{
            right: 50,
            bottom: 30
          }} 
        >
          <XAxis
            dataKey="Time" 
            tick={<CustomizedXAxisTick />} 
            allowDecimals={false}
            type='number'
            tickCount={13}
            stroke='#999997'
            label={<CustomizedXLabel />}
          >
          </XAxis>
          <YAxis 
            tick={false} 
            yAxisId="left" 
            label={<CustomizedY1Label />}
            stroke='#999997'
          />
          <YAxis 
            tick={false} 
            yAxisId="right" 
            orientation="right" 
            label={<CustomizedY2Label />}
            stroke='#999997'
          />
          <CartesianGrid 
            vertical={false}
            horizontal={false}
          />
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="You" 
            stroke="#003E52" 
            strokeWidth={4}
            fillOpacity={0} 
          />
          <Area 
            yAxisId="right"
            type="monotone" 
            dataKey="Renewables" 
            stroke="#CCDB2A" 
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
  )
}

export default App
