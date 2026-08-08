# Firebase Setup Instructions

Follow these steps to enable real Google OAuth authentication in your Finance Tracker app.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "Finance Tracker")
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
2. Enter an app nickname (e.g., "Finance Tracker Web")
3. Click **"Register app"**
4. You'll see your Firebase configuration - **keep this page open!**

## Step 3: Enable Google Authentication

1. In the Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"** if this is your first time
3. Go to the **"Sign-in method"** tab
4. Click on **"Google"**
5. Toggle the **"Enable"** switch
6. Select a support email from the dropdown
7. Click **"Save"**

## Step 4: Add Firebase Configuration to Your App

1. Open the file: `frontend/src/config/firebase.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Where to find these values:
- In Firebase Console, go to **Project Settings** (gear icon)
- Scroll down to **"Your apps"** section
- You'll see your web app with the config values
- Copy each value and paste into `firebase.js`

## Step 5: Test the Integration

1. Save the `firebase.js` file with your actual configuration
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Navigate to `http://localhost:5173`
4. Click the **"Google"** button
5. You should see a popup asking you to choose a Google account
6. Select an account and sign in
7. You'll be redirected back to the app, logged in!

## Troubleshooting

### Error: "Firebase not configured"
- Make sure you replaced ALL placeholder values in `firebase.js`
- Check that there are no typos in your config values

### Error: "Popup blocked"
- Allow popups for localhost in your browser settings
- Try using a different browser

### Error: "auth/unauthorized-domain"
- In Firebase Console → Authentication → Settings → Authorized domains
- Add `localhost` to the authorized domains list

## Security Notes

⚠️ **Important**: 
- The `apiKey` in Firebase config is safe to expose in client-side code
- Firebase security is handled by Security Rules, not by hiding the API key
- For production, add your actual domain to Firebase authorized domains

## Next Steps

Once Google OAuth is working:
- Test the sign-in flow
- Verify user data appears in Dashboard
- Test logout functionality
- (Optional) Enable additional providers like GitHub, Facebook, etc.

---

Need help? Check the [Firebase Documentation](https://firebase.google.com/docs/auth/web/google-signin)
