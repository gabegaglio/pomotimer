import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Input } from './components/ui/input';
import logo from './assets/logo.svg';
import GoogleLogo from './components/ui/google-logo';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

 const createUserDocument = async (user) => {
   try {
     const userDocRef = doc(db, 'users', user.uid);
     const docSnap = await getDoc(userDocRef);
    console.log('docSnap', docSnap.data());
     // Only create document if it doesn't exist
     if (!docSnap.exists()) {
       await setDoc(userDocRef, {
         email: user.email,
         timerSettings: {
           pomodoro: 25,
           shortBreak: 5,
           longBreak: 15,
         },
         preferences: {
           color: '#368CE7',
           backgroundPicture: null,
         },
         tasks: [],
         createdAt: new Date().toISOString(),
       });
     }
   } catch (error) {
     console.error('Error creating user document:', error);
   }
 };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const authFunction = isLogin
        ? signInWithEmailAndPassword
        : createUserWithEmailAndPassword;
      const result = await authFunction(auth, email, password);
      if (!isLogin) {
        await createUserDocument(result.user);
      }
      navigate('/home');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createUserDocument(result.user); 
      navigate('/home');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#368CE7]">
      <div className="flex justify-center items-center space-x-4 mb-8">
        <img src={logo} alt="Logo" className="w-24 h-24" />
        <h2 className="text-white text-6xl font-semibold">Gabes Pomo</h2>
      </div>

      <div className="w-96 p-8 bg-white bg-opacity-20 rounded-lg shadow-lg">
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {error && <div className="text-red-200 text-center">Error logging in</div>}

          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-0 border-none rounded-lg"
            placeholder="Email"
            required
          />

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-0 border-none rounded-lg"
            placeholder="Password"
            required
          />

          <button
            type="submit"
            className="w-full bg-white bg-opacity-20 text-white py-3 rounded-lg hover:bg-opacity-30 transition duration-200"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

          <div className="text-white text-center">or</div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white bg-opacity-20 text-white py-3 rounded-lg hover:bg-opacity-30 transition duration-200 flex items-center justify-center"
          >
            <GoogleLogo />
            Sign in with Google
          </button>

          <button
            type="button"
            className="w-full bg-white bg-opacity-20 text-white py-3 rounded-lg hover:bg-opacity-30 transition duration-200"
            onClick={() => navigate('/home')}
          >
            Continue as Guest
          </button>

          <button
            type="button"
            className="w-full text-white hover:underline text-sm"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
