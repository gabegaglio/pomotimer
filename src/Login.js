import React from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from './hooks/useLogin';
import { Input } from './components/ui/input';
import logo from './assets/logo.svg';


function Login() {

    const navigate = useNavigate();

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: '#368CE7' }}
    >
      <div className="flex justify-center items-center space-x-4 mb-4">
        <img src={logo} alt="Logo" className="w-20 h-20" />
        <h2 className="align-middle text-5xl font-semibold text-white">
          Gabes Pomo
        </h2>
      </div>
      
      <div className="p-8 rounded-lg shadow-lg w-full max-w-sm bg-white bg-opacity-20">
        {/* Email Input */}
        <div className="mb-4">
          <Input
            type="email"
            className="text-white placeholder-white not-italic outline-none"
            placeholder="Email"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <Input
            type="password"
            className="text-white placeholder-white outline-none"
            placeholder="Password"
          />
        </div>

        {/* Buttons */}
        <button
          className="w-full bg-white bg-opacity-20 text-white py-2 rounded-md hover:bg-opacity-30 transition"
          onClick={() => navigate('/home')}
        >
          Login
        </button>

        <div className="text-center my-4 text-white">or</div>

        <button
          className="w-full bg-white bg-opacity-20 text-white py-2 rounded-md hover:bg-opacity-30 transition"
          onClick={() => navigate('/home')}
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}

export default Login;