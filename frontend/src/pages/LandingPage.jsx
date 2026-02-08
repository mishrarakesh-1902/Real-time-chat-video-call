import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  MessageCircle, Video, Shield, Zap, Users, ChevronRight,
  Star, ArrowRight, CheckCircle, Menu, X
} from 'lucide-react';

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: MessageCircle,
      title: 'Real-time Messaging',
      description: 'Instant messaging with lightning-fast delivery. Stay connected with friends and colleagues worldwide.',
      color: 'bg-primary-100 text-primary-600'
    },
    {
      icon: Video,
      title: 'HD Video Calls',
      description: 'Crystal-clear video calls with up to 4 participants. Perfect for meetings and catching up.',
      color: 'bg-accent-100 text-accent-600'
    },
    {
      icon: Shield,
      title: 'End-to-End Encryption',
      description: 'Your privacy is our priority. All messages and calls are securely encrypted.',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built for speed with optimized servers globally. Never miss a moment.',
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Sign up in seconds with your email or social accounts. No complex setup required.'
    },
    {
      number: '02',
      title: 'Add Your Contacts',
      description: 'Import your contacts or find friends easily. Connect with anyone instantly.'
    },
    {
      number: '03',
      title: 'Start Chatting',
      description: 'Send messages, make calls, and share files. Communication made simple.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      content: 'This app has transformed how our team communicates. The video calls are incredibly clear!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      content: 'Best chat experience I\'ve had. The interface is beautiful and super intuitive.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Designer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      content: 'Love the design! It\'s so easy to use and the encryption gives me peace of mind.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-lg shadow-soft' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-surface-900">ChatFlow</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="nav-link">Features</a>
              <a href="#how-it-works" className="nav-link">How it Works</a>
              <a href="#testimonials" className="nav-link">Testimonials</a>
              <Link to="/login" className="btn-ghost">Log In</Link>
              <Link to="/signup" className="btn-primary">Get Started</Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-surface-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-surface-100 animate-slide-up">
            <div className="px-4 py-4 space-y-2">
              <a href="#features" className="block nav-link">Features</a>
              <a href="#how-it-works" className="block nav-link">How it Works</a>
              <a href="#testimonials" className="block nav-link">Testimonials</a>
              <Link to="/login" className="block nav-link">Log In</Link>
              <Link to="/signup" className="block btn-primary text-center">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Zap className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Now with HD Video Calls</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-900 mb-6 animate-slide-up">
              Connect Seamlessly with{' '}
              <span className="text-gradient">ChatFlow</span>
            </h1>
            
            <p className="text-xl text-surface-500 mb-8 max-w-2xl mx-auto animate-slide-up">
              Experience the future of communication. Beautiful design, powerful features, 
              and uncompromising privacy — all in one app.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
              <Link to="/signup" className="btn-primary text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a href="#features" className="btn-secondary text-lg px-8 py-4">
                Learn More
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 relative animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-t from-surface-50 via-transparent to-transparent z-10" />
            <div className="bg-white rounded-2xl shadow-elevated border border-surface-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-surface-50 border-b border-surface-100">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm text-surface-400">ChatFlow</span>
                </div>
              </div>
              <div className="aspect-[16/9] bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-24 h-24 text-primary-300 mx-auto mb-4" />
                  <p className="text-surface-400">Preview of ChatFlow Interface</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle">
              Powerful features designed to make your communication effortless and enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card-hover p-6 text-center group"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 
                              group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{feature.title}</h3>
                <p className="text-surface-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section bg-surface-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Get Started in Minutes</h2>
            <p className="section-subtitle">
              Three simple steps to start communicating with your world.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative"
              >
                <div className="text-8xl font-bold text-surface-100 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold text-surface-900 mb-2">{step.title}</h3>
                <p className="text-surface-500">{step.description}</p>
                {index < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-surface-300 w-8 h-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Loved by Thousands</h2>
            <p className="section-subtitle">
              See what our users are saying about ChatFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="card p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-surface-600 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-surface-900">{testimonial.name}</p>
                    <p className="text-sm text-surface-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Join millions of users already enjoying seamless communication.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/signup" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-surface-100 transition-colors"
            >
              Create Free Account
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-900 text-surface-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ChatFlow</span>
              </div>
              <p className="text-sm">
                Beautiful, secure, and fast communication for everyone.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-surface-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm">&copy; 2024 ChatFlow. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <CheckCircle className="w-5 h-5 text-accent-500" />
              <span className="text-sm">End-to-end encrypted</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
