import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../lib/context/AuthContext';
import { login as apiLogin } from '../lib/services/api';

const Login = () => {
  const [role, setRole] = useState<'owner' | 'admin'>('owner');
  const [email, setEmail] = useState('akash@gmail.com');
  const [password, setPassword] = useState('akash123');

  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const response = await apiLogin({ email, password, role });
      
      login(
        response.access_token,
        response.user,
        response.business
      );

      if (role === 'admin') {
        navigate('/super-admin');
      } else {
        // Business owner login
        const b = response.business;
        navigate(`/dashboard/owner?businessId=${b.id}&ownerName=${encodeURIComponent(response.user.name)}`);
      }
    } catch (err: any) {
      setLoginError(err.response?.data?.detail || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
        <div className="p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                <span className="text-blue-600">Biz</span><span className="text-orange-500">Dial</span>
              </h1>
            </Link>
            <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 mt-2 text-sm">Enter your credentials to access your account</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button 
              type="button"
              onClick={() => {
                setRole('owner');
                setEmail('akash@gmail.com');
                setPassword('akash123');
              }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'owner' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Business Owner
            </button>
            <button 
              type="button"
              onClick={() => {
                setRole('admin');
                setEmail('admin@bizdial.com');
                setPassword('admin123');
              }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Super Admin
            </button>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={role === 'admin' ? "admin@bizdial.com" : "owner@business.com"}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">Forgot password?</a>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-600/30 mt-4"
            >
              Sign In as {role === 'admin' ? 'Admin' : 'Owner'}
            </button>
            {loginError && <p className="text-sm text-red-500 font-medium">{loginError}</p>}
          </form>


          
          {role === 'owner' && (
            <div className="mt-8 text-center text-sm font-medium text-slate-600">
              Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register your business</Link>
            </div>
          )}
        </div>
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">Use the toggle above to switch login portals.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
