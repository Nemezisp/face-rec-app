import React from 'react'
import Tilt from 'react-parallax-tilt';
import './Logo.styles.css'
import logo from './logo.png'

const Logo = () => {
    return (
        <Tilt className='tilt-logo ma2' perspective={1000}>
            <div className='bs2'>
                <img className='logo-image' alt='logo' src={logo}/>
            </div>
        </Tilt>
    )
}

export default Logo;