<h1>Built with</h1>

- React
- TailwindCSS
- Firebase Firestore

<h1>Running</h1>
<ol>
  <li> Make your own firebase project (https://console.firebase.google.com) </li>
  <li> Enable Firestore and email and password authentication in firebase </li>
  <li> Make a .env file in the root directory (<code>/</code>) (example below) </li>
  <li> Start with <code>npm start</code> </li>
</ol>


<h2>Example .env file</h2>

    REACT_APP_FIREBASE_API_KEY = <apiKey>
    REACT_APP_AUTH_DOMAIN = <authDomain>
    REACT_APP_DATABASE_URL = <databaseURL>
    REACT_APP_PROJECT_ID = <projectId>
    REACT_APP_STORAGE_BUCKET = <storageBucket>
    REACT_APP_MESSAGING_SENDER_ID = <messagingSenderId>
    REACT_APP_APP_ID = <appId>
    
TODO:

- password reset
- polish workflow
- polish UI/UX
- implement lazy loading
- reduce number of queries
