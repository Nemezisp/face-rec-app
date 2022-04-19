import React from "react";
import './Profile.styles.css'

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.user.name
        }
    }

    onFormChange = (event) => {
        this.setState({name: event.target.value})
    }

    onProfileUpdate = (data) => {
        fetch(`http://localhost:3000/profile/${this.props.user.id}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({formInput: data})
        }).then(res => {
            if (res.status === 200 || res.status === 304) {
                this.props.toggleModal();
                this.props.loadUser({...this.props.user, ...data});
            }
        }).catch(console.log)
    }
 
    render () {
        const { user, toggleModal } = this.props;
        return (
            <div className="profile-modal">
                <article className="bg-white br3 ba b--black-10 mv4 w-50-m w-25-l mw6 shadow-5 center">
                    <main className="pa4 black-80 w-80">
                        <img 
                            src="https://st3.depositphotos.com/6672868/14083/v/450/depositphotos_140830032-stock-illustration-user-profile-group.jpg"
                            className="w3 dib" alt="avatar" />
                        <h1>{this.state.name}</h1>
                        <h4>{`Images Submitted: ${user.entries}`}</h4>
                        <p>{`Member since: ${new Date(user.joined).toLocaleDateString()}`}</p>
                        <label className="mt2 fw6" htmlFor="user-name">Name:</label>
                        <input className="pa2 ba w-100 " 
                                type="text" 
                                placeholder={user.name}
                                name="user-name"  
                                id="name"
                                onChange={this.onFormChange}
                                />
                        <div className="mt4" style={{display: 'flex', justifyContent: 'space-evenly'}}>
                            <button className="b pa2 grow pointer hover-white w-40 bg-light-green b--black-20"
                                onClick={() => this.onProfileUpdate({"name": this.state.name})}>
                                Save
                            </button>
                            <button className="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20"
                                onClick={toggleModal}>
                                Cancel
                            </button>
                        </div>
                    </main>
                    <div className="modal-close" onClick={toggleModal}>&times;</div>
                </article>
            </div>
        )
    }
}

export default Profile