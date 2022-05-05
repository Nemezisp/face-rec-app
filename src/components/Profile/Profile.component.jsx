import React from "react";
import Resizer from "react-image-file-resizer";
import './Profile.styles.css'
import { StoreContext } from '../../context/store-context';

class Profile extends React.Component {
    static contextType = StoreContext;

    constructor(props) {
        super(props);

        this.state = {
            name: this.props.user.name,
            picture: null
        }
    }

    resizePicture = (picture) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                picture,
                300,
                300,
                "JPEG",
                80,
                0,
                (uri) => {
                    resolve(uri);
                },
                "file",
            );
        }
    );

    handlePictureInputChange = async (event) => {
        const picture = event.target.files[0]

        if (picture.type !== "image/jpeg" && picture.type !== "image/png") {
            alert('Wrong file type! Use jpeg or png.')
            return
        }

        if (picture.size > 314572800) {
            alert('File too big!')
            return
        }
        
        const resizedPicture = await this.resizePicture(picture)
        this.setState({picture: resizedPicture})
   }

    changeProfilePicture = () => {
        fetch(`https://face-rec-server-api.herokuapp.com/S3url?name=${this.context.state.user.id + '.jpeg'}`, {
                headers: {'Authorization': window.sessionStorage.getItem('token')},
                method: 'get'
            })
        .then(response => response.json())
        .then(data => {
            const s3putUrl = data.url
            fetch(s3putUrl, {
                method: 'put',
                headers: {"Content-Type": "multipart/form-data"},
                body: this.state.picture
            })
            .then(response => {
                const s3imageUrl = response.url.split('?')[0]
                fetch(`https://face-rec-server-api.herokuapp.com/profilepicture/${this.context.state.user.id}`, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': window.sessionStorage.getItem('token')
                    },
                    body: JSON.stringify({profile_picture_url: s3imageUrl})
                })
                .then(response => {
                    if (response.status === 200 || response.status === 304) {
                        this.props.loadUser({...this.context.state.user, profile_picture_url: s3imageUrl});
                        this.setState({picture: null})
                    }
                })
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }

    onFormChange = (event) => {
        this.setState({name: event.target.value})
    }

    onProfileUpdate = (data) => {
        fetch(`https://face-rec-server-api.herokuapp.com/profile/${this.context.state.user.id}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({formInput: data})
        }).then(res => {
            if (res.status === 200 || res.status === 304) {
                //this.props.toggleModal();
                this.props.loadUser({...this.context.state.user, ...data});
            }
        }).catch(console.log)
        this.state.picture && this.changeProfilePicture()
        this.props.toggleModal()
    }
 
    render () {
        const { toggleModal } = this.props;
        const { user } = this.context.state;

        return (
            <div className="profile-modal">
                <article className="bg-white br3 ba b--black-10 mv4 w-75-m w-50-l mw6 shadow-5 center">
                    <main className="pa4 black-80 w-80">
                        <div className="profile-picture-container">
                            <img 
                                src={user.profile_picture_url ? `${user.profile_picture_url + '?' +  Date.now()}` : "https://st3.depositphotos.com/6672868/14083/v/450/depositphotos_140830032-stock-illustration-user-profile-group.jpg"}
                                className="br4 dib profile-picture" alt="avatar" />
                        </div>
                        <h1 className="profile-name">{this.state.name}</h1>
                        <h4>{`Images Submitted: ${user.entries}`}</h4>
                        <p>{`Member since: ${new Date(user.joined).toLocaleDateString()}`}</p>
                        <label className="mt2 fw6" htmlFor="user-name">Change name:</label>
                        <input className="pa2 ba w-100 mb2" 
                                type="text" 
                                placeholder={user.name}
                                name="user-name"  
                                id="name"
                                onChange={this.onFormChange}
                                />
                        <div className = 'mt2 fw6'>Change profile picture <span className = 'fw2'>(png or jpeg, best 1:1 ratio)</span>:</div>
                        <div>
                            <form className='profile-picture-form'>
                                <label htmlFor="profile-picture-upload" className="b pa2 grow pointer hover-white bg-light-green profile-pic-upload-button">
                                    Upload image
                                </label>
                                <input
                                    type="file"
                                    id="profile-picture-upload"
                                    accept="image/jpeg, image/png" 
                                    name="image"
                                    onChange={event => this.handlePictureInputChange(event)}
                                />
                                {this.state.picture && <span className='picture-name-container'>{this.state.picture.name.length>30 ? this.state.picture.name.substring(0, 30) + '...' : this.state.picture.name}</span>}       
                            </form> 
                        </div>
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