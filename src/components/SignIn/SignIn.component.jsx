import React from 'react'
import './SignIn.styles.css'

class SignIn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            signInEmail: '',
            signInPassword: '',
            isLoading: false
        }
    }

    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value})
    }

    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value})
    }

    saveAuthTokenInSession = (token) => {
        window.sessionStorage.setItem('token', token)
    }

    toggleIsLoading = () => {
        this.setState({isLoading: !this.state.isLoading})
    }

    onSubmitSignIn = () => {
        let url = process.env.NODE_ENV === 'production' ? 'https://face-rec-server-api.herokuapp.com' : 'http://localhost:3000'

        this.toggleIsLoading()
        fetch(`${url}/signin`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
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
            alert('Wrong credentials')
        })
    }

    render () {
        const {onRouteChange} = this.props

        return (
            <article className="br3 ba b--black-10 mv4 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f2 fw6 ph0 mh0">Sign In</legend>
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
                            onClick = {this.onSubmitSignIn}
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                            type="submit" 
                            value={this.state.isLoading ? "Loading user" : "Sign in"}
                        />
                        </div>
                        <div className="lh-copy mt3">
                        <p onClick = {() => onRouteChange('register')} className="b f6 link dim black db pointer">Register</p>
                        </div>
                    </div>
                </main>
            </article>
        )
    }
}

export default SignIn;