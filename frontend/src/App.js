import React, { Component, useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom';
import Popover from '@material-ui/core/Popover'

import moment from 'moment'

import './App.scss'

import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Legend, Area, Label } from 'recharts'

import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import DateImg from './images/calendar_no_number_noborder.png'
import DateImgHover from './images/calendar_no_number_onhover.png'
import { subDays } from 'date-fns'

import ProfileIcon from './images/header-person-icon.png'
import CELCornerLogo from './images/cel-corner-logo.png'
import NotificationLogo from './images/cel-mock-ups-V4-18-red-empty.png'
import NotificationLogoHover from './images/cel-mock-ups-V4-18-red-selected.png'
import NotificationClicked from './images/cel-mock-ups-V4-18-green-selected.png'

import { getCombinedData, getNotifications, sendText } from './utils/dataService'
import Menu from './menu';

const CustomizedXAxisTick = ({x, y, stroke, payload,}) => {
  return (
    <g transform={`translate(${x * 1.03},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#999997">{payload.value}</text>
    </g>
  )
}

class ExampleCustomInput extends Component {
  render() {
    const {value, onClick} = this.props
    return (
      <div 
        className="DatepickerWrapper"
      >
        <div className="date-img-container">
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
        </div>
        <div className="date-text-container">
          <p className='Datepicker-txt'>Here's the deal for {value}</p>
        </div>
      </div>
    )
  }
}
// const combinedData = getCombinedData(null)

function App() {
  const [data, setData] = useState(null)
  const [startDate, setStartDate] = useState(new Date())
  const [anchorEl, setAnchorEl] = useState(null)
  const [notifications, setNotifications] = useState([])

  useEffect(async () => {
    setData(await getCombinedData(null))
  }, [])

  const handleDateChange = async (date) => {
    // removes time of day variance
    const newDate = moment(date).format('YYYY-MM-DD')

    setStartDate(new Date(date))
    setData(await getCombinedData(newDate))
  }

  const handleNotificationClick = event => {
    setAnchorEl(event.currentTarget)

    const formattedDate = moment(startDate).format('YYYY-MM-DD')
    getNotifications(formattedDate, data => {
      setNotifications(data)
    })
  }

  const handleNotificationClose = () => {
    setAnchorEl(null)
  }

  const handleTextSending = (messageToSend, event) => {
    event.preventDefault()
    sendText(messageToSend, () => {
      // update the notification state here
      const updatedNotifications = notifications.map(n => {
        if (n.message === messageToSend) {
          n.clicked = true
          return n
        }
        return n
      })
      setNotifications(updatedNotifications)
    })
  }

  const open = Boolean(anchorEl)
  const id = open ? 'notification-popover' : undefined

  return (
    <div className="App">
      <Switch>
        <Route exact path='/app' render={({ history }) => (
          <>
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
                  onClick={handleNotificationClick}
                />
              </div>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleNotificationClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                style={{ width: '45%' }}
              >
                <div className="notifications-container">
                  <h2 style={{ color: '#003E52', fontFamily: 'Lato, sans-serif', textAlign: 'center', marginBottom: '0' }}>Click if you want a text reminder</h2>
                    {notifications.map((row, i) => {
                      if (row.clicked && row.clicked === true) {
                        return (
                          <div
                            className="notification"
                            onClick={handleTextSending.bind(this, row.message)}
                            key={i}
                          >
                            <img className="not-img" src={NotificationClicked}
                              alt="notification logo" />
                            <p className="not-text">{row.message}</p>
                          </div>    
                        )
                      }

                      return (
                        <div
                          className="notification"
                          onClick={handleTextSending.bind(this, row.message)}
                          key={i}
                        >
                          <img className="not-img" src={NotificationLogo}
                            alt="notification logo" />
                          <p className="not-text">{row.message}</p>
                        </div>
                      )
                    }
                    )}
                </div>
              </Popover>
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
            width='100%'
            height={450} 
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
              >
                <Label value="Hours" position="bottom" offset={10} style={{
                  fontSize: '20px', fill: '#999997'
                }} />
              </XAxis>
              <YAxis 
                tick={false} 
                yAxisId="left"
                orientation="left"
                stroke='#999997'
                angle={-90}
                textAnchor="middle"
              >
              </YAxis>
              <YAxis 
                tick={false} 
                yAxisId="right" 
                orientation="right" 
                stroke='#999997'
              >
              </YAxis>
              <CartesianGrid 
                vertical={false}
                horizontal={false}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="You (Watts)" 
                stroke="#003E52" 
                strokeWidth={4}
                fillOpacity={0} 
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="Renewables (MW)" 
                stroke="#CCDB2A" 
                strokeWidth={4}
                fillOpacity={0} 
              />
              <Legend
                align='right'
                layout='vertical'
                verticalAlign='middle'
                iconType='plainline'
              />
            </AreaChart>
          </ResponsiveContainer>
          </>
        )}/>
        <Route exact path='/menu' render={({ history }) => (
          <Menu />
        )}/>
    </Switch>
    </div>
  )
}

export default App
