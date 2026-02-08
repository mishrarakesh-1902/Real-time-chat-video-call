import { useState } from 'react';
import { Link } from 'react-router';
import { MessageCircle, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, Check } from 'lucide-react';
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

  const passwordRequirements = [
    { met: formData.password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(formData.password), text: 'One number' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 to-accent-600 items-center justify-center p-12">
        <div className="max-w-lg text-center text-white">
          <MessageCircle className="w-24 h-24 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Join ChatFlow Today</h2>
          <p className="text-lg opacity-80 mb-8">
            Create your account and start connecting with friends, family, and colleagues in seconds.
          </p>

          {/* Benefits */}
          <div className="space-y-4 text-left">
            {[
              'Unlimited message history',
              'HD video calls up to 4 participants',
              'End-to-end encryption',
              'Cross-platform sync',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <Check className="w-5 h-5 text-accent-300" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900">ChatFlow</span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-surface-900 mb-2">Create an account</h1>
            <p className="text-surface-500">Get started with ChatFlow — it's free</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-field pl-12"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-12"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-12 pr-12"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-2 text-xs ${
                        req.met ? 'text-accent-600' : 'text-surface-400'
                      }`}
                    >
                      <Check className={`w-3 h-3 ${req.met ? 'opacity-100' : 'opacity-50'}`} />
                      {req.text}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                id="terms"
                className="w-4 h-4 mt-0.5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-surface-600">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn-primary w-full py-3.5 text-lg"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-surface-200" />
            <span className="text-sm text-surface-400">or</span>
            <div className="flex-1 h-px bg-surface-200" />
          </div>

          {/* Sign In Link */}
          <p className="text-center text-surface-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-surface-400 hover:text-surface-600">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
