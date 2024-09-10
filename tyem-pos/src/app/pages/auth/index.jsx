import React from "react";
import Header from "./header";
import LoginForm from "./login";
import login_bg from '../../../assets/login_bg.png'
const Login = () => {
  return (
    <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-chicket-200  to-chicket-400"
     style={{
        backgroundImage: `url(${login_bg})`,
        backgroundSize: 'cover', // Cover the entire page
        backgroundPosition: 'center', // Center the background image
        backgroundRepeat: 'no-repeat', // Do not repeat the image
      }}>
      <div className="max-w-md w-full space-y-8 bg-white p-5 rounded-md">
        {" "}
        <Header
          heading="TM POS"
          paragraph="Enter your email and password to login"
          linkName="Signup"
          linkUrl="/signup"
        />
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
