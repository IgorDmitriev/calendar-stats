import React, { Component } from 'react';
import Profile from './Profile';
import Signin from './Signin';
import CalendarList from './CalendarList';

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

    if (profile === null)
      return <Signin onLoginSuccess={this.onLoginSuccess} />;

    const { calendars } = this.props;

    return (
      <div className="Menu">
        <Profile {...profile} />
        <CalendarList calendars={calendars} />
      </div>
    );
  }
}

export default Menu;
