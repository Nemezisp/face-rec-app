import React, {Component} from 'react';
import './App.css';
import Particles from "react-tsparticles";

import Navigation from './components/Navigation/Navigation.component';
import SignIn from './components/SignIn/SignIn.component';
import Register from './components/Register/Register.component';
import Modal from './components/Modal/Modal.component';
import Profile from './components/Profile/Profile.component';
import ChooseMode from './components/ChooseMode/ChooseMode.component';
import ModeContainer from './components/ModeContainer/ModeContainer.component';

import { StoreContext, ACTION_TYPES } from './context/store-context';

const particlesOptions = {
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        enable: true,
        opacity: 0.5,
      },
      move: {
        enable: true,
        outMode: "bounce",
        speed: 2,
      },
      number: {
        value: 50,
      },
      opacity: {
        value: 0.5,
      },
    },
}

const initialState = {
  isSignedIn: false,
  isProfileOpen: false,
  isChoosingMode: false,
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      isSignedIn: false,
      isProfileOpen: false,
      isChoosingMode: false,
    }
  }

  static contextType = StoreContext;

  componentDidMount() {
    let url = process.env.API_URL || 'http://localhost:3000'
    const token = window.sessionStorage.getItem('token')
    if (token) {
      fetch(`${url}/signin`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.id) {
          fetch(`${url}/profile/${data.id}`, {
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            }
          })
          .then(res => res.json())
          .then(user => {
            if (user && user.email) {
              this.loadUser(user)
              this.onRouteChange('home')
            }
          })
        }
      })
      .catch(console.log)
    }
  }

  loadUser = (data) => {
    this.context.dispatch({
      type: ACTION_TYPES.SET_USER,
      payload: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
        profile_picture_url: data.profile_picture_url
      }
    })
  }

  onRouteChange = (route) => {
    if (route === "home") {
      this.setState({isSignedIn: true})
    } else if (route === "signout") {
      this.setState(initialState)
    }
    this.context.dispatch({
      type: ACTION_TYPES.SET_ROUTE,
      payload: route
    })
  }

  onModeChange = (mode) => {
    this.context.dispatch({
      type: ACTION_TYPES.SET_MODE,
      payload: mode
    })
    this.context.dispatch({
      type: ACTION_TYPES.SET_CURRENT_FACE,
      payload: null
    })
  }

  toggleProfileModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  toggleModeModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isChoosingMode: !prevState.isChoosingMode
    }))
  }

  render() {
    const {mode, user, route} = this.context.state
    const {isSignedIn, isProfileOpen, isChoosingMode} = this.state;
    return(
      <div className="App">
        <Particles className = 'particles' options={particlesOptions}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} toggleModal={this.toggleProfileModal} />
        {route === "home" 
        ? <div>
            { isProfileOpen && 
              <Modal> 
                <Profile user={user} loadUser={this.loadUser} toggleModal={this.toggleProfileModal}/> 
              </Modal> }
            { isChoosingMode &&
              <Modal>
                <ChooseMode onModeChange={this.onModeChange} toggleModal={this.toggleModeModal}/>
              </Modal>
            }
            <div className='choose-header'>
              <button className='choose-button grow' onClick={this.toggleModeModal}>Change app mode</button>
              <h3 className='current-mode-heading'>Current mode: {mode}</h3>
              <hr/>
            </div>
            <ModeContainer />
          </div>  
        : ( route === 'signin' 
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    )
  }
}

export default App;