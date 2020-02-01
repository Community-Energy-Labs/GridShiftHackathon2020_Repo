import React, { useState } from 'react'
import './Menu.scss'
import Battery from './images/Icon_Battery.png'
import ElectricVehicle from './images/Icon_ElectricVehicle.png'
import GeneratorBackup from './images/Icon_GeneratorBackup.png'
import HeatPump from './images/Icon_HeatPump.png'
import HomeEnergyMonitor from './images/Icon_HomeEnergyMonitor.png'
import PoolPump from './images/Icon_PoolPump.png'
import SmartMeter from './images/Icon_SmartMeter.png'
import Solar from './images/Icon_Solar.png'
import CELCornerLogo from './images/cel-corner-logo.png'
import ProfileIcon from './images/header-person-icon.png'

const iconsArray = [
  Battery, 
  ElectricVehicle, 
  GeneratorBackup, 
  HeatPump,
  HomeEnergyMonitor,
  PoolPump,
  SmartMeter,
  Solar
]

const Menu = ({ history }) => {
  const [anyClicked, setAnyClicked] = useState(false);
  const handleUserIconClick = e => {
    e.preventDefault()
    // setAnyClicked(true)
    // e.target.classList.toggle('icon-clicked')
    history.push('/app')
  }
  return (
    <div className='Menu'>
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
        </header>
      </div>
      <div className='Menu-content'>
        {!anyClicked ? (
          <h2 className='user-input-hdr'>
            Do you have any of these? <br/>
            Don't fret if you don't!
          </h2>
        ) : (
          <h2 className='user-input-hdr'>
            Great! We'll make suggestions for how to save and use cleaner, greener energy.
          </h2>
        )}
        <div className='Logos-ctnr'>
          {iconsArray.map((icon, idx) => (
            <img 
              className='user-input-icon'
              src={icon} 
              alt={`icon-${idx}`}
              onClick={handleUserIconClick}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Menu
