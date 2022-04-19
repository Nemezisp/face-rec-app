import React from 'react'
import './Navigation.styles.css'
import ProfileIcon from '../ProfileIcon/ProfileIcon.component'
import Logo from '../Logo/Logo.component'

const Navigation = ({onRouteChange, isSignedIn, toggleModal}) => {
    if(isSignedIn) {
        return (
        <nav className='main-nav'>
            <div className='logo-container'>
                <Logo/>
            </div>
            <ProfileIcon onRouteChange={onRouteChange} toggleModal={toggleModal} />
        </nav>
        )
        } else {
            return (
        <nav className='main-nav'>
            <div className='logo-container'>
                <Logo/>
            </div>
            <span onClick={() => onRouteChange('signin')} className='f3-ns f4 link dim black underline pa3 pointer'>Sign In</span>
            <span onClick={() => onRouteChange('register')} className='f3-ns f4 link dim black underline pa3 pointer'>Register</span>
        </nav>
        )
    }
}

export default Navigation;