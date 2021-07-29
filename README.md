# FunChat

FunChat is an chat application

# Tech Stack 📋
  
  1. `react.js`
  2. `express.js`
  3. `mongodb`
  4. `socket.io`

# How to run locally 
  
  1. Create `.env` file and paste below code.
     
     <pre>
      <code>
          PORT: 3000,
          MONGO_URI = Mongodb uri
          SESSION_SECRET = session secret
          GOOGLE_CLIENTID = Google client ID
          GOOGLE_CLIENTSECRET = Google client Secret
          GITHUB_CLIENTID = Github client ID
          GITHUB_CLIENTSECRET = Github client secret
          LOCAL_URL = http://localhost:3000
          LOCAL_REDIRECT_URL = http://localhost:3000
          GOOGLE_CALLBACK_URL = http://localhost:5000/google/callback
          GITHUB_CALLBACK_URL = http://localhost:5000/github/callback
      </code>
     </pre>
     
   2. To get Google clientID and Google client secret you must create oauth in [Google Developer Console](https://console.developers.google.com)
   3. To get Github clientID and Github client secret you must create oauth in Github Developer in settings
   4. Authentication is done through google-oauth20 and github-oauth.
   5. Run the following command `npm install`
   6. To run client run below command ( In client dir )
      > npm run start
   7. To run server run below command ( In server dir )
      > npm run start
