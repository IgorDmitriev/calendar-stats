import React, { Component } from 'react';
import Profile from './Profile';
import Signin from './Signin';
import CalendarList from './CalendarList';
import './Menu.css';

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: null,
    };

    this.onLoginSuccess = this.onLoginSuccess.bind(this);
  }

  onLoginSuccess({ accessToken, profileObj }) {
    const { setAccessToken } = this.props;

    this.setState({
      profile: profileObj,
    });
    setAccessToken(accessToken);
  }

  isSignedIn() {
    return Boolean(this.state.profile.email);
  }

  render() {
    const { profile } = this.state;
    const { calendars, toggleCalendar } = this.props;

    return (
      <div className="Menu">
        {profile === null ? (
          <Signin onLoginSuccess={this.onLoginSuccess} />
        ) : (
          <Profile {...profile} />
        )}
        <CalendarList
          calendars={calendars}
          onCalendarListItemClick={toggleCalendar}
        />
      </div>
    );
  }
}

export default Menu;
