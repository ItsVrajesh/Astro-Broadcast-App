import React, { useState } from 'react';
import { auth } from '../firebase'; // Adjust this import based on your setup
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import emailjs from '@emailjs/browser';

export default function Login({ setUser }) {
  // State for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  
  // State for flow control
  const [step, setStep] = useState(1); // 1 = Form, 2 = OTP Input
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [error, setError] = useState('');

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  // Step 1: Send the OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Please enter your name and email.");
      return;
    }
    setError('');

    // Generate a random 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    // Send email using EmailJS
    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        to_name: name,
        to_email: email,
        otp: newOtp,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      // Only move to step 2 if the email actually sends successfully
      setStep(2);
    })
    .catch((error) => {
      console.error("Email sending failed:", error);
      setError("Failed to send verification email. Please try again.");
    });
  };

  // Step 2: Verify the OTP and Create the Firebase Account
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (otp !== generatedOtp) {
      setError("Invalid OTP. Please try again.");
      return;
    }

    try {
      // Because your UI has no password field, we create a dummy password 
      // just to satisfy Firebase Auth requirements.
      const dummyPassword = email + "OTP123!"; 
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, dummyPassword);
      
      // Update your app state to log the user in
      setUser({
        ...userCredential.user,
        displayName: name // Attach the name they typed
      });
      
    } catch (error) {
      console.error("Error creating account:", error);
      // If the email is already in use, handle that error gracefully
      if (error.code === 'auth/email-already-in-use') {
         setError("An account with this email already exists.");
      } else {
         setError("Failed to create account.");
      }
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md">
      
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {step === 1 ? "Create your account" : "Verify your email"}
        </h1>
        <p className="text-gray-500 text-sm">
          {step === 1 
            ? "Join Astro and start your journey to the stars." 
            : `We sent a 6-digit code to ${email}`}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {/* STEP 1: Name and Email Form */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium rounded-xl px-4 py-3 mt-4 transition-colors"
          >
            Create Account
          </button>
        </form>
      )}

      {/* STEP 2: OTP Verification Form */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium rounded-xl px-4 py-3 mt-4 transition-colors"
          >
            Verify & Continue
          </button>
          
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-sm text-gray-500 hover:text-gray-800 transition-colors mt-2"
          >
            Back to edit email
          </button>
        </form>
      )}

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="px-4 text-xs text-gray-400 uppercase">or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* Google Button */}
      <button
        onClick={handleGoogleSignIn}
        className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign in with Google
      </button>

    </div>
  );
}