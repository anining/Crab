const DEVELOPER = 'Production';
const UA_ID = 10001;
const API_URL = DEVELOPER === 'Staging' ? 'https://dev-audit.librags.com/admin' : 'https://dev-audit.librags.com/admin';
const PRIVATE_KEY = DEVELOPER === 'Staging' ? 'sadasdasdasfadfdfgdghrthyt' : 'sadasdasdasfadfdfgdghrthyt';

export {DEVELOPER, UA_ID, API_URL, PRIVATE_KEY};
