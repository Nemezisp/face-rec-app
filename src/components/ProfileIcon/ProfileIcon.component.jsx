import React from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './ProfileIcon.styles.css'
import { StoreContext } from '../../context/store-context';


class ProfileIcon extends React.Component {
    constructor(props) {
        super(props)

         this.state = {
            dropdownOpen: false
        }
    }

    static contextType = StoreContext;

    toggle = () => {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
    }
    
    handleSignOut = () => {
        this.props.onRouteChange('signout')
        window.sessionStorage.removeItem('token')
    }

    render() {
        const {user} = this.context.state

        return (
            <div className='pa3 tc'>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle
                    tag="span"
                    data-toggle="dropdown"
                    aria-expanded={this.state.dropdownOpen}
                    >
                    <img 
                        src={user.profile_picture_url ? `${user.profile_picture_url + '?' +  Date.now()}` : "https://st3.depositphotos.com/6672868/14083/v/450/depositphotos_140830032-stock-illustration-user-profile-group.jpg"}
                        className="br4 dib profile-icon" alt="avatar" />
                </DropdownToggle>
                    <DropdownMenu 
                        className='b--transaprent shadow-5'
                        style={{marginTop: '36px', backgroundColor: 'rgba(255, 255, 255, 0.9)'}}>
                    <DropdownItem onClick={this.props.toggleModal}>View Profile</DropdownItem>
                    <DropdownItem onClick={this.handleSignOut}>Sign Out</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        )
    }
}

export default ProfileIcon;