import React from 'react';
import GoogleLogin from 'react-google-login';
import logo from './logo.png';
import './Signin.css';

const CLIENT_ID =
	'118876649158-jjsfa5kaitkgdaag2ai6btunru2ajpcc.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

export const Signin = ({ onLoginSuccess }) => (
	<div className="Signin">
		<img src={logo} alt="Analytics tool for calendar" />
		<GoogleLogin
			clientId={CLIENT_ID}
			scope={SCOPES}
			buttonText="Connect Google Calendar"
			onSuccess={response => onLoginSuccess(response)}
			offline={false}
			approvalPrompt="force"
		/>
	</div>
);

export default Signin;
