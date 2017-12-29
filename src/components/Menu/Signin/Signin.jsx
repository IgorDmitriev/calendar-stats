import React from 'react';
import GoogleLogin from 'react-google-login';
import { CLIENT_ID, SCOPES } from '../../../lib/googleClient';

export const Signin = ({ onLoginSuccess }) => (
  <GoogleLogin
    clientId={CLIENT_ID}
    scope={SCOPES}
    buttonText="Connect Google Calendar"
    onSuccess={response => onLoginSuccess(response)}
    offline={false}
    approvalPrompt="force"
  />
);

export default Signin;
