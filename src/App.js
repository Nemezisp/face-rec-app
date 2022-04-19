import React, {Component} from 'react';
import './App.css';
import Particles from "react-tsparticles";

import Navigation from './components/Navigation/Navigation.component';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.component';
import Rank from './components/Rank/Rank.component';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.component'
import SignIn from './components/SignIn/SignIn.component';
import Register from './components/Register/Register.component';
import Modal from './components/Modal/Modal.component';
import Profile from './components/Profile/Profile.component';

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
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      route: 'signin',
      isSignedIn: false,
      isProfileOpen: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem('token')
    if (token) {
      fetch('https://face-rec-server-api.herokuapp.com/signin', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.id) {
          fetch(`https://face-rec-server-api.herokuapp.com/profile/${data.id}`, {
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
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    if (data && data.outputs) {
      const regions = data.outputs[0].data.regions
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      let boxes = []
  
      for (let i = 0; i < regions.length; i++) {
        const clarifaiFace = regions[i].region_info.bounding_box;
        boxes.push({
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - (clarifaiFace.right_col * width),
          bottomRow: height - (clarifaiFace.bottom_row * height)
        })
      }
      return boxes
    }
    return
  }

  displayFaceBox = (boxes) => {
    if (boxes) {
      this.setState({boxes: boxes})
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onSubmit = () => {
    this.setState({imageUrl:this.state.input})
    fetch('https://face-rec-server-api.herokuapp.com/imageurl', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': window.sessionStorage.getItem('token')
      },
      body: JSON.stringify({
          input: this.state.input,
      })
    })
    .then(response => response.json())
    .then((response) => {
      if (response) {
        fetch('https://face-rec-server-api.herokuapp.com/image', {
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('token')
          },
          body: JSON.stringify({
              id:this.state.user.id,
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
        .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === "home") {
      this.setState({isSignedIn: true})
    } else if (route === "signout") {
      return this.setState(initialState)
    }
    this.setState({route: route})
  }

  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  render() {
    const  {isSignedIn, imageUrl, route, boxes, isProfileOpen, user} = this.state;
    return(
      <div className="App">
        <Particles className = 'particles' options={particlesOptions}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} toggleModal={this.toggleModal} />
        {route === "home" 
        ? <div>
            { isProfileOpen && 
              <Modal> 
                <Profile user={user} loadUser={this.loadUser} toggleModal={this.toggleModal}/> 
              </Modal> }
            <Rank userEntries={this.state.user.entries} userName={this.state.user.name} />
            <ImageLinkForm onSubmit={this.onSubmit} onInputChange={this.onInputChange} />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl}/>
          </div>  
        : ( this.state.route === 'signin' 
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    )
  }
}

export default App;
