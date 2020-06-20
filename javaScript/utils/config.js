const DEVELOPER = 'Staging';
const UA_ID = 10011;
const API_URL = DEVELOPER === 'Staging' ? 'https://dev-realman.librags.com/api' : 'https://dev-realman.librags.com/api';
const PRIVATE_KEY = DEVELOPER === 'Staging' ? '80TD9QXUGHOEZLkcmB5h3uSpWvqNlfoM' : '80TD9QXUGHOEZLkcmB5h3uSpWvqNlfoM';

export { DEVELOPER, UA_ID, API_URL, PRIVATE_KEY };
