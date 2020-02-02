import React from 'react'
import { Button } from '@material-ui/core'
import './User.scss'

import ProfileIcon from './images/header-person-icon.png'
import CELCornerLogo from './images/cel-corner-logo.png'
import EnergyLogo from './images/Icon_HomeEnergyMonitor.png'

function User({ history }) {
  return (
    <div className="User">
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
          </header>
        </div>
      </>

      <div className="Userinputcontainer">
        <img
          src={EnergyLogo}
          alt="cel logo"
        />
        <form className="UserInputForm" onSubmit={() => history.push('/app')}>
          <div>
          <label>
            <h2 style={{ color: '#003E52', textAlign: 'center', marginBottom: '0' }}>
              Enter your account number </h2>
            <input type="text" name="name"/>
          </label>
          </div>
          {/* <input type="submit" value="Submit" className="UserInputBox"/> */}
          <Button
            type="submit"
            color="#00B189"
            variant="contained"
            size="large"
            style={{
              width: '3rem', width: '18rem', height: '3rem',
              letterSpacing: '3px',
          backgroundColor: '#00B189',
          color: 'white',
          fontWeight: 'bold',
          marginTop: '2rem', fontSize: '1.2rem' }}
                >
                Submit
          </Button>
        </form>
      </div>
    </div>
  )
}

export default User
