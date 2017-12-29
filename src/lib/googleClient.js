import google from 'googleapis';

export const CLIENT_ID =
  '1034471881815-lv7d5vaepq8a1eujbbfo831r6a8dgqbc.apps.googleusercontent.com';
const CLIENT_SECRET = 'SEUtiszUqO_3PI4XQVp6wKoc';
const REDIRECT_URL = 'http://localhost:3000';
export const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const OAuth2 = google.auth.OAuth2;

export const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
