import { useState } from 'react';
import { Link } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="dark bg-[#111316] text-[#e2e2e6] min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full blur-[80px] opacity-40 w-[600px] h-[600px] bg-[#aec6ff]/20 -top-[200px] -left-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute rounded-full blur-[80px] opacity-40 w-[800px] h-[800px] bg-[#451dc6]/20 -bottom-[300px] -right-[200px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
      </div>
      
      {/* Main Content Canvas */}
      <main className="relative z-10 w-full max-w-md px-4 md:px-0">
        {/* Login Card */}
        <div 
          className="rounded-[2rem] p-8 md:p-10 flex flex-col gap-8 relative overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Subtle Inner Glow Top Edge */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          {/* Header Section */}
          <div className="text-center flex flex-col gap-2">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#aec6ff] to-[#c9bfff]">ChatFlow</h1>
            <p className="text-base text-[#c2c6d5]">Sign in to continue your conversations.</p>
          </div>
          
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#c2c6d5] ml-1" htmlFor="email">Email</label>
              <div className="relative flex items-center rounded-xl bg-[#282a2d]/50 border border-[rgba(255,255,255,0.12)] transition-all duration-300 focus-within:shadow-[0_0_0_1px_#aec6ff,0_0_12px_rgba(174,198,255,0.2)] focus-within:border-transparent">
                <span className="material-symbols-outlined text-[#8c909f] ml-4 absolute pointer-events-none">mail</span>
                <input 
                  className="w-full bg-transparent border-none rounded-xl py-3 pl-12 pr-4 text-[#e2e2e6] placeholder:text-[#424753] focus:ring-0 text-base outline-none" 
                  id="email" 
                  name="email" 
                  placeholder="you@example.com" 
                  required 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            
            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center ml-1 pr-1">
                <label className="text-sm text-[#c2c6d5]" htmlFor="password">Password</label>
                <a className="text-sm text-[#aec6ff] hover:text-[#d8e2ff] transition-colors" href="#">Forgot?</a>
              </div>
              <div className="relative flex items-center rounded-xl bg-[#282a2d]/50 border border-[rgba(255,255,255,0.12)] transition-all duration-300 focus-within:shadow-[0_0_0_1px_#aec6ff,0_0_12px_rgba(174,198,255,0.2)] focus-within:border-transparent">
                <span className="material-symbols-outlined text-[#8c909f] ml-4 absolute pointer-events-none">lock</span>
                <input 
                  className="w-full bg-transparent border-none rounded-xl py-3 pl-12 pr-12 text-[#e2e2e6] placeholder:text-[#424753] focus:ring-0 text-base outline-none" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button 
                  aria-label="Toggle password visibility" 
                  className="absolute right-4 text-[#8c909f] hover:text-[#e2e2e6] transition-colors focus:outline-none" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Primary Action */}
            <button 
              className="w-full mt-2 py-4 rounded-full bg-gradient-to-r from-[#3578E5] to-[#7B61FF] text-white font-semibold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_8px_20px_-6px_rgba(53,120,229,0.5)] flex justify-center items-center gap-2 group disabled:opacity-50" 
              type="submit"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>Signing in...</>
              ) : (
                <>
                  Log In
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </>
              )}
            </button>
          </form>
          
          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-[rgba(255,255,255,0.12)]"></div>
            <span className="text-sm text-[#c2c6d5] uppercase tracking-widest">or continue with</span>
            <div className="h-[1px] flex-1 bg-[rgba(255,255,255,0.12)]"></div>
          </div>
          
          {/* Social Logins */}
          <div className="flex gap-4">
            <button className="flex-1 py-3 px-4 rounded-xl border border-[rgba(255,255,255,0.12)] hover:bg-[#333538] transition-colors flex justify-center items-center gap-2" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
              <span className="text-base font-medium text-[#e2e2e6]">Google</span>
            </button>
            <button className="flex-1 py-3 px-4 rounded-xl border border-[rgba(255,255,255,0.12)] hover:bg-[#333538] transition-colors flex justify-center items-center gap-2" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
              <span className="text-base font-medium text-[#e2e2e6]">Apple</span>
            </button>
          </div>
          
          {/* Footer Link */}
          <div className="text-center mt-2">
            <p className="text-sm text-[#c2c6d5]">
              Don't have an account?{' '}
              <Link className="text-[#aec6ff] hover:text-[#d8e2ff] font-semibold transition-colors" to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
