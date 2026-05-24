import { useState, useEffect } from 'react';
import { Link } from 'react-router';

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="dark text-[#e2e2e6] antialiased font-sans overflow-x-hidden min-h-screen flex flex-col"
         style={{
           backgroundColor: '#111316',
           backgroundImage: 'radial-gradient(circle at top right, rgba(53, 120, 229, 0.15) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(123, 97, 255, 0.15) 0%, transparent 40%)',
           backgroundAttachment: 'fixed'
         }}>
      
      {/* Top Navigation */}
      <nav 
        className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-[rgba(255,255,255,0.12)] shadow-sm flex justify-between items-center px-4 md:px-10 h-16 transition-all duration-300"
        style={{ backgroundColor: scrolled ? 'rgba(17, 19, 22, 0.8)' : 'rgba(255, 255, 255, 0.08)' }}
      >
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="material-symbols-outlined text-[#aec6ff] text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
          <span className="text-2xl font-bold text-[#aec6ff] tracking-tight">ChatFlow</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm">
          <a className="text-[#c2c6d5] hover:text-[#e2e2e6] transition-colors duration-200" href="#features">Features</a>
          <a className="text-[#c2c6d5] hover:text-[#e2e2e6] transition-colors duration-200" href="#how-it-works">How it Works</a>
          <a className="text-[#c2c6d5] hover:text-[#e2e2e6] transition-colors duration-200" href="#testimonials">Testimonials</a>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link className="text-[#e2e2e6] hover:text-[#aec6ff] transition-colors duration-200" to="/login">Log In</Link>
          <Link className="text-white px-6 py-2 rounded-full font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#508efc]/20" style={{ background: 'linear-gradient(135deg, #3578E5, #7B61FF)' }} to="/signup">
            Get Started
          </Link>
        </div>
        
        <button className="md:hidden text-[#e2e2e6]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="material-symbols-outlined text-[28px]">{isMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </nav>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-[#1a1c1f]/95 backdrop-blur-xl border-b border-[rgba(255,255,255,0.12)] p-4 flex flex-col gap-4 text-center md:hidden">
          <a className="text-[#c2c6d5] hover:text-[#e2e2e6] py-2" href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
          <a className="text-[#c2c6d5] hover:text-[#e2e2e6] py-2" href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How it Works</a>
          <Link className="text-[#e2e2e6] hover:text-[#aec6ff] py-2" to="/login" onClick={() => setIsMenuOpen(false)}>Log In</Link>
          <Link className="text-white px-6 py-3 rounded-full font-bold mx-auto mt-2" style={{ background: 'linear-gradient(135deg, #3578E5, #7B61FF)' }} to="/signup" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
        </div>
      )}

      <main className="flex-grow pt-24 md:pt-32 pb-16 px-4 md:px-10 max-w-[1440px] mx-auto w-full flex flex-col gap-16 md:gap-24">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center gap-16 min-h-[calc(100vh-200px)]">
          <div className="flex-1 flex flex-col gap-8 z-10">
            <div className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.12)] rounded-full px-4 py-1.5 w-fit" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
              <span className="w-2 h-2 rounded-full bg-[#25C2A0] shadow-[0_0_8px_rgba(37,194,160,0.6)] animate-pulse"></span>
              <span className="text-xs text-[#c2c6d5] uppercase tracking-wider font-bold">Now in Public Beta</span>
            </div>
            
            <h1 className="text-[40px] leading-[48px] md:text-5xl lg:text-6xl font-bold">
              Connect Seamlessly with <br className="hidden md:block"/>
              <span style={{ background: 'linear-gradient(135deg, #aec6ff, #c9bfff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ChatFlow</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#c2c6d5] max-w-xl">
              Experience lightning-fast, secure communication. Designed for high-performance teams who demand premium design and uncompromised privacy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 pt-2">
              <Link className="text-white px-8 py-3 rounded-full font-bold text-lg hover:shadow-[0_0_20px_rgba(80,142,252,0.4)] active:scale-95 transition-all w-full sm:w-auto flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #3578E5, #7B61FF)' }} to="/signup">
                Start Free Trial
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
              <a href="#features" className="text-[#e2e2e6] px-8 py-3 rounded-full font-bold text-lg hover:bg-[rgba(255,255,255,0.08)] active:scale-95 transition-all w-full sm:w-auto border border-[rgba(255,255,255,0.12)] text-center cursor-pointer" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                Learn More
              </a>
            </div>
            
            <div className="flex items-center gap-4 mt-8 opacity-70">
              <div className="flex -space-x-3">
                <img alt="User" className="w-10 h-10 rounded-full border-2 border-[#111316] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3tKneSPu3wnp8E62xreUWDiN1Pnx1gAMiDC4DsMNIiOZgcqYC5I3tkf322Bf0Xgc7g2jTa-vlMDvD2yGE9s0bFm5i9kJNpWFbL6VYIiSOF7UUD_IueAGCji9L814MWXf7v1hnMoAhMhpXlOSgfzj-339RB9s5e5ZhDb1oa85km9VOUjtxQL-Ul_4aAUoPWI3aS-U390q9CdXXdIzVJPLR_RU4hsLCSp-L-74904XVh3qSK3anhTuZwwDdnaX4tGHcQGX6PCktZl4"/>
                <img alt="User" className="w-10 h-10 rounded-full border-2 border-[#111316] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtcKYRb_Di-m5sPHd6RBGfn6s7igxAf4slpMCn623rKmjoCTQnJAY1Y85XgzlrLvJGLCN9bzxDUg_Q8Gxe8Ut8v2mlL-bZnAWAkcIPseSoGYzRvmAMEeTKjP9uGh6pAgcd9i5H1IjprFEBO5feD-vb9Xi7Ier8zrpUjajQIDLJ6BNOoBh-4Moyvre2dlLwdw_F0BJY_0Zo4s3Y3mbhYcpLCQUahbpW4_oA7-pDP20V7fUfQUC1LfMDPCkCwi1DnCYc9tdRYOXCnJ8"/>
                <img alt="User" className="w-10 h-10 rounded-full border-2 border-[#111316] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEjpJ4IidgoQSHdcxs9eVfiEahuan9WioUNv9ZGJCK0AIU5s5fK-6F8JKdVhvEF5NKRmQkMsy5mBB6UpQfv11rbNuUNWjmHU_8TnC8_1iszxKYPcumbt86toSTs0pYX7ZkC5BgWu6Zxvw_PHvtD1eJes-Dj0K53l2RyDjFK3-NqG0b1vTyhlxJ2yaeN7y924j5ICVJ2-tFDZIzn2Y2rOm5LklZgoSQSdsCl008eavKoTbcLplzn0gcnLHUskXZKbhfjAAOJ7TGEE4"/>
              </div>
              <span className="text-sm text-[#c2c6d5]">Joined by 10,000+ teams</span>
            </div>
          </div>
          
          <div className="flex-1 relative w-full flex justify-center lg:justify-end mt-12 md:mt-0" style={{ perspective: '1000px' }}>
            {/* Abstract Glow Behind Mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#508efc] rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>
            
            {/* Dashboard Mockup */}
            <div 
              className="relative w-full max-w-[500px] aspect-[4/3] rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.12)] shadow-2xl shadow-[#508efc]/10 transform -rotate-y-6 rotate-x-6 hover:rotate-0 transition-transform duration-700"
              style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)' }}
            >
              {/* Mockup Header */}
              <div className="h-12 border-b border-[rgba(255,255,255,0.12)] flex items-center px-4 justify-between bg-[#1a1c1f]/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ffb4ab]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFB800]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#25C2A0]"></div>
                </div>
                <div className="text-xs text-[#c2c6d5] font-medium">ChatFlow Dashboard</div>
                <div className="w-12"></div>
              </div>
              
              {/* Mockup Content Area */}
              <div className="flex h-[calc(100%-3rem)] bg-[#111316]/50 backdrop-blur-md">
                {/* Sidebar Mock */}
                <div className="w-1/3 border-r border-[rgba(255,255,255,0.12)] p-3 flex flex-col gap-3">
                  <div className="h-8 rounded-full border border-[rgba(255,255,255,0.12)] w-full" style={{ background: 'rgba(255, 255, 255, 0.08)' }}></div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-8 h-8 rounded-full bg-[#aec6ff]/20"></div>
                    <div className="flex-col flex gap-1 flex-1">
                      <div className="h-2 rounded bg-[#e2e2e6] w-3/4"></div>
                      <div className="h-2 rounded bg-[#c2c6d5] w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#c9bfff]/20"></div>
                    <div className="flex-col flex gap-1 flex-1">
                      <div className="h-2 rounded bg-[#c2c6d5] w-2/3"></div>
                      <div className="h-2 rounded bg-[rgba(255,255,255,0.12)] w-1/3"></div>
                    </div>
                  </div>
                </div>
                
                {/* Main Chat Mock */}
                <div className="flex-1 p-4 flex flex-col gap-4 relative">
                  {/* Floating Video Call Pip Mock */}
                  <div className="absolute top-4 right-4 w-24 h-32 rounded-lg border border-[rgba(255,255,255,0.12)] overflow-hidden shadow-lg shadow-black/50 z-10 bg-black" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)' }}>
                    <img alt="Video Call" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGWap6pcUI9ytnTJpWamICgh2tgYieUJz2NX7EEeXH8BiPNuc7LQANut27WnqVE073L0vEbnOQeI68NPniIvFXBepj6a4ucbHIZAMbhnDM2Wzrn7aSJ0IwLdQdWVwlIYZvaokh3l4-HlCr3iA1d2OjZcsS094rUxmwHO1xBAN57SJSYwbC51rVmMt7rArsgPrZAvn58KzL9CiOguEdmXN9i2C7SvBQK9xTHfkJb-s1Ddy1zQn7NfGNe1mPHYEIUmC700ZMZUttz_s"/>
                  </div>
                  
                  <div className="flex gap-2 items-end w-3/4">
                    <div className="w-6 h-6 rounded-full bg-[#aec6ff]/30 flex-shrink-0"></div>
                    <div className="p-3 rounded-2xl rounded-bl-none text-xs text-[#c2c6d5] border border-[rgba(255,255,255,0.12)]" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                      Hey team, are we ready for the launch?
                    </div>
                  </div>
                  <div className="flex gap-2 items-end w-3/4 self-end flex-row-reverse">
                    <div className="p-3 rounded-2xl rounded-br-none text-xs text-white shadow-md" style={{ background: 'linear-gradient(135deg, #3578E5, #7B61FF)' }}>
                      Everything is deployed and looking stable! 🚀
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="flex flex-col gap-8 pt-8" id="features">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
            <h2 className="text-3xl font-bold">Uncompromising Features</h2>
            <p className="text-[#c2c6d5] text-lg">Built for speed, designed for security. Everything you need to communicate without friction.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {/* Feature 1 */}
            <div className="rounded-xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300 group border border-[rgba(255,255,255,0.12)]" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)' }}>
              <div className="w-12 h-12 rounded-full bg-[#508efc]/10 flex items-center justify-center text-[#aec6ff] group-hover:bg-[#508efc]/20 transition-colors">
                <span className="material-symbols-outlined text-[24px]">forum</span>
              </div>
              <h3 className="text-xl font-semibold text-[#e2e2e6]">Real-time Messaging</h3>
              <p className="text-sm text-[#c2c6d5]">Instant delivery with zero latency. See typing indicators and read receipts in real-time.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="rounded-xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300 group border border-[rgba(255,255,255,0.12)]" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)' }}>
              <div className="w-12 h-12 rounded-full bg-[#451dc6]/10 flex items-center justify-center text-[#c9bfff] group-hover:bg-[#451dc6]/20 transition-colors">
                <span className="material-symbols-outlined text-[24px]">videocam</span>
              </div>
              <h3 className="text-xl font-semibold text-[#e2e2e6]">HD Video Calls</h3>
              <p className="text-sm text-[#c2c6d5]">Crystal clear video and audio. Built-in noise suppression for professional meetings.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="rounded-xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300 group border border-[rgba(255,255,255,0.12)]" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)' }}>
              <div className="w-12 h-12 rounded-full bg-[#00a484]/10 flex items-center justify-center text-[#3edeb7] group-hover:bg-[#00a484]/20 transition-colors">
                <span className="material-symbols-outlined text-[24px]">lock</span>
              </div>
              <h3 className="text-xl font-semibold text-[#e2e2e6]">End-to-End Encryption</h3>
              <p className="text-sm text-[#c2c6d5]">Military-grade security. Your conversations are private and impenetrable.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="rounded-xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300 group border border-[rgba(255,255,255,0.12)]" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)' }}>
              <div className="w-12 h-12 rounded-full bg-[#93000a]/10 flex items-center justify-center text-[#ffb4ab] group-hover:bg-[#93000a]/20 transition-colors">
                <span className="material-symbols-outlined text-[24px]">bolt</span>
              </div>
              <h3 className="text-xl font-semibold text-[#e2e2e6]">Lightning Fast Speed</h3>
              <p className="text-sm text-[#c2c6d5]">Optimized global edge network ensures your data travels the shortest path.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
