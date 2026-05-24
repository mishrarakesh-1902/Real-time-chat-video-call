import { useState } from 'react';
import { Link } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';

function SignUpPage() {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '',
    confirmPassword: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="dark bg-[#0c0e11] text-[#e2e2e6] antialiased min-h-screen flex items-center justify-center p-4 md:p-10 relative overflow-hidden selection:bg-[#aec6ff] selection:text-[#002e6a]">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#3578E5] opacity-10 blur-[120px] mix-blend-screen"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-[#7B61FF] opacity-10 blur-[120px] mix-blend-screen"></div>
      </div>
      
      {/* Main Card Container */}
      <main className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Glass Card Surface */}
        <div 
          className="backdrop-blur-[20px] border border-[rgba(255,255,255,0.12)] rounded-[24px] p-8 md:p-10 shadow-2xl flex flex-col gap-8"
          style={{ background: 'rgba(255, 255, 255, 0.08)', boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
        >
          {/* Header Section */}
          <header className="flex flex-col items-center text-center gap-4">
            {/* App Icon/Logo */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3578E5] to-[#7B61FF] p-[1px] shadow-lg shadow-[#3578E5]/20">
              <div 
                className="w-full h-full rounded-2xl bg-[#1a1c1f] flex items-center justify-center"
                style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)' }}
              >
                <span className="material-symbols-outlined text-[#aec6ff] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <h1 className="text-2xl md:text-3xl font-bold text-[#e2e2e6]">Create Account</h1>
              <p className="text-base text-[#c2c6d5]">Join ChatFlow to connect instantly.</p>
            </div>
          </header>
          
          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Full Name Field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold tracking-wider text-[#c2c6d5] ml-1 uppercase" htmlFor="fullName">Full Name</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8c909f] group-focus-within:text-[#aec6ff] transition-colors pointer-events-none">person</span>
                <input 
                  className="w-full bg-[#1a1c1f]/50 border border-[rgba(255,255,255,0.12)] rounded-xl py-3 pl-12 pr-4 text-base text-[#e2e2e6] placeholder:text-[#8c909f] focus:outline-none focus:border-[#aec6ff]/50 focus:ring-1 focus:ring-[#aec6ff]/50 focus:bg-[#1a1c1f] transition-all duration-300" 
                  id="fullName" 
                  name="fullName" 
                  placeholder="Alex Rivers" 
                  required 
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>
            
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold tracking-wider text-[#c2c6d5] ml-1 uppercase" htmlFor="email">Email</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8c909f] group-focus-within:text-[#aec6ff] transition-colors pointer-events-none">mail</span>
                <input 
                  className="w-full bg-[#1a1c1f]/50 border border-[rgba(255,255,255,0.12)] rounded-xl py-3 pl-12 pr-4 text-base text-[#e2e2e6] placeholder:text-[#8c909f] focus:outline-none focus:border-[#aec6ff]/50 focus:ring-1 focus:ring-[#aec6ff]/50 focus:bg-[#1a1c1f] transition-all duration-300" 
                  id="email" 
                  name="email" 
                  placeholder="alex@example.com" 
                  required 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold tracking-wider text-[#c2c6d5] ml-1 uppercase" htmlFor="password">Password</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8c909f] group-focus-within:text-[#aec6ff] transition-colors pointer-events-none">lock</span>
                <input 
                  className="w-full bg-[#1a1c1f]/50 border border-[rgba(255,255,255,0.12)] rounded-xl py-3 pl-12 pr-12 text-base text-[#e2e2e6] placeholder:text-[#8c909f] focus:outline-none focus:border-[#aec6ff]/50 focus:ring-1 focus:ring-[#aec6ff]/50 focus:bg-[#1a1c1f] transition-all duration-300" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c909f] hover:text-[#e2e2e6] focus:text-[#e2e2e6] transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(255,255,255,0.12)]" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Submit Button */}
            <button 
              className="w-full mt-2 bg-gradient-to-r from-[#3578E5] to-[#7B61FF] hover:from-[#508efc] hover:to-[#451dc6] text-white font-semibold text-xl rounded-full py-3.5 shadow-[0_4px_14px_0_rgba(53,120,229,0.39)] hover:shadow-[0_6px_20px_rgba(53,120,229,0.23)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 relative overflow-hidden group disabled:opacity-50" 
              type="submit"
              disabled={isSigningUp}
              style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)' }}
            >
              <span className="relative z-10">{isSigningUp ? 'Creating...' : 'Create Account'}</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full blur-md"></div>
            </button>
          </form>
          
          {/* Footer Link */}
          <footer className="text-center mt-2">
            <p className="text-sm text-[#c2c6d5]">
              Already have an account?{' '}
              <Link className="text-[#aec6ff] hover:text-[#d8e2ff] hover:underline underline-offset-4 transition-colors font-medium ml-1 focus:outline-none focus:ring-2 focus:ring-[#aec6ff] rounded-sm" to="/login">Log in</Link>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default SignUpPage;
