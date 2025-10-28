import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const SocialButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition-colors">
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </button>
);

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  const handleSocialLogin = () => {
    onLogin(selectedRole);
  };

  const RoleButton: React.FC<{role: UserRole, label: string}> = ({ role, label }) => (
    <button
      type="button"
      onClick={() => setSelectedRole(role)}
      className={`w-full py-3 px-2 text-center font-semibold rounded-md transition-all duration-300 text-sm ${
        selectedRole === role
          ? 'bg-indigo-600 text-white shadow-lg'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">{isSignUp ? 'Create an Account' : 'Welcome Back'}</h2>
          <p className="mt-2 text-gray-400">Please {isSignUp ? 'sign up' : 'sign in'} to your portal</p>
        </div>
        
        <div>
            <label className="text-sm font-bold text-gray-400 block mb-2 text-center">I am a...</label>
            <div className="grid grid-cols-2 gap-2 bg-gray-900/50 p-1 rounded-lg">
                <RoleButton role={UserRole.STUDENT} label="Student" />
                <RoleButton role={UserRole.TEACHER} label="Teacher" />
                <RoleButton role={UserRole.MANAGEMENT} label="Management" />
                <RoleButton role={UserRole.ADVERTISER} label="Advertiser" />
            </div>
          </div>

        <div className="flex items-center justify-center gap-4">
            <SocialButton onClick={handleSocialLogin} icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>} label="Google" />
            <SocialButton onClick={handleSocialLogin} icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.01 1.97c-2.73 0-4.66 1.83-4.66 4.32 0 2.4 1.89 4.31 4.58 4.31 2.74 0 4.67-1.88 4.67-4.31 0-2.45-1.99-4.32-4.59-4.32zm0 7.1c-1.57 0-2.82-1.25-2.82-2.82s1.25-2.83 2.82-2.83 2.83 1.25 2.83 2.83-1.26 2.82-2.83 2.82zM12 11.53c-4.43 0-7.86 3.2-7.86 8.57h15.72c0-5.37-3.43-8.57-7.86-8.57z"/></svg>} label="Apple" />
        </div>

        <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-800 text-gray-400">Or continue with email</span></div>
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          
          <div>
             <label className="text-sm font-bold text-gray-400 block mb-2" htmlFor="email">
                Email Address
             </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder={`demo@${selectedRole.toLowerCase()}.com`}
              defaultValue={`demo@${selectedRole.toLowerCase()}.com`}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-400 block mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
              defaultValue="password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {isSignUp && (
             <div>
                <label className="text-sm font-bold text-gray-400 block mb-2" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  defaultValue="password"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
          )}


          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold transition-colors"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        </form>
        <div className="text-center text-sm space-y-2">
           {isSignUp ? (
                 <div>
                    <span className="text-gray-400">Already have an account?</span>
                    <button onClick={() => setIsSignUp(false)} className="font-semibold text-indigo-400 hover:text-indigo-300 ml-1">
                        Sign In
                    </button>
                </div>
            ) : (
                <>
                    <div>
                        <span className="text-gray-400">Don't have an account?</span>
                        <button onClick={() => setIsSignUp(true)} className="font-semibold text-indigo-400 hover:text-indigo-300 ml-1">
                            Sign Up
                        </button>
                    </div>
                    <div className="border-t border-gray-700 pt-3 mt-3">
                        <span className="text-gray-400">Are you a teacher? </span>
                        <button 
                            onClick={() => {
                                setIsSignUp(true);
                                setSelectedRole(UserRole.TEACHER);
                            }} 
                            className="font-semibold text-green-400 hover:text-green-300 ml-1"
                        >
                            Register Here
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default Login;