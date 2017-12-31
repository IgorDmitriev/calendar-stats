import React from 'react';
import './Profile.css';

const Profile = ({ name, imageUrl }) => (
  <div className="Profile">
    <img src={imageUrl} />
    <span>{name}</span>
  </div>
);

export default Profile;
