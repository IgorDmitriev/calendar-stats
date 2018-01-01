import React from 'react';
import GoogleLogin from 'react-google-login';

const CLIENT_ID =
	'118876649158-jjsfa5kaitkgdaag2ai6btunru2ajpcc.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

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
