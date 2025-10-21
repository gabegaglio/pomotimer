import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Input } from '../components/ui/input';
import logo from '../assets/logo.svg';
import GoogleLogo from '../components/ui/google-logo';

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
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#368CE7] to-[#2563eb] p-4 py-8">
      <div className="w-full max-w-5xl">
        {/* Main Container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16">
          {/* Logo - Mobile first: smaller, Desktop: larger */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <img
              src={logo}
              alt="Pomotimer Logo"
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-64 md:h-64 lg:w-72 lg:h-72 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Login Form - Responsive padding and sizing */}
          <div className="w-full md:w-1/2 max-w-md">
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 text-center">
                Welcome Back
              </h2>
              <p className="text-white text-opacity-70 text-center text-sm sm:text-base mb-6 sm:mb-8">
                Sign in
              </p>

              <form
                onSubmit={handleEmailAuth}
                className="space-y-4 sm:space-y-5"
              >
                {/* Error Message */}
                {error && (
                  <div className="bg-red-500 bg-opacity-20 text-red-100 text-center py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm border border-red-300 border-opacity-30">
                    {error.includes('auth/') ? 'Invalid credentials' : error}
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 border-none rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 transition-all text-sm sm:text-base"
                    placeholder="Email"
                    required
                  />
                </div>

                {/* Password Input */}
                <div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 border-none rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 transition-all text-sm sm:text-base"
                    placeholder="Password"
                    required
                  />
                </div>

                {/* Login/Sign Up Button */}
                <button
                  type="submit"
                  className="w-full bg-white bg-opacity-30 hover:bg-opacity-40 text-white font-semibold py-3 sm:py-3.5 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg text-sm sm:text-base"
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                </button>

                {/* Divider */}
                <div className="relative py-2 sm:py-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white border-opacity-30"></div>
                  </div>
                  <div className="relative flex justify-center text-xs sm:text-sm">
                    <span className="px-3 sm:px-4 bg-transparent text-white text-opacity-80 font-medium">
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white bg-opacity-25 hover:bg-opacity-35 text-white py-3 sm:py-3.5 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 sm:gap-3 font-semibold text-sm sm:text-base"
                >
                  <GoogleLogo />
                  Google
                </button>

                {/* Guest Access */}
                <button
                  type="button"
                  className="w-full bg-white bg-opacity-15 hover:bg-opacity-25 text-white py-3 sm:py-3.5 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-semibold text-sm sm:text-base"
                  onClick={() => navigate('/home')}
                >
                  Continue as Guest
                </button>

                {/* Toggle Login/Sign Up */}
                <div className="text-center pt-1 sm:pt-2">
                  <button
                    type="button"
                    className="text-white text-xs sm:text-sm hover:text-opacity-80 transition-colors underline-offset-4 hover:underline"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin
                      ? "Don't have an account? Sign up"
                      : 'Already have an account? Login'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
