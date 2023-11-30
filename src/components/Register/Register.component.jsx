import React from 'react'
import './Register.styles.css'
import { url } from '../../utils/apiUrl'

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            name: '',
            isLoading: false
        }
    }

    onEmailChange = (event) => {
        this.setState({email: event.target.value})
    }

    onPasswordChange = (event) => {
        this.setState({password: event.target.value})
    }

    onNameChange = (event) => {
        this.setState({name: event.target.value})
    }

    saveAuthTokenInSession = (token) => {
        window.sessionStorage.setItem('token', token)
    }

    toggleIsLoading = () => {
        this.setState({isLoading: !this.state.isLoading})
    }

    onSubmitRegister = () => {
        this.toggleIsLoading()
        fetch(`${url}/register`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.userId && data.success === 'true') {
                this.saveAuthTokenInSession(data.token)
                fetch(`${url}/profile/${data.userId}`, {
                    method: 'get',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': data.token
                    }
                })
                .then(res => res.json())
                .then(user => {
                    if (user && user.email) {
                        this.toggleIsLoading()
                        this.props.loadUser(user)
                        this.props.onRouteChange('home')
                    }
                })
                .catch(err => console.log(err))
            } 
        })
        .catch(err => {
            this.toggleIsLoading()
            alert('User with that email already exists!')
        })
    }

    render () {
        return (
            <article className="br3 ba b--black-10 mv4 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f2 fw6 ph0 mh0">Register</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black" 
                                   type="text" 
                                   name="name"  
                                   id="name"
                                   onChange={this.onNameChange}/>
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black" 
                                   type="email" 
                                   name="email-address"  
                                   id="email-address"
                                   onChange={this.onEmailChange}/>
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black" 
                                   type="password" 
                                   name="password"  
                                   id="password"
                                   onChange={this.onPasswordChange}/>
                        </div>
                        </fieldset>
                        <div className="">
                        <input 
                            onClick = {this.onSubmitRegister}
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                            type="submit" 
                            value={this.state.isLoading ? "Loading": "Register"}
                        />
                        </div>
                    </div>
                </main>
            </article>
        ) 
    }
}

export default Register;