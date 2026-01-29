import Link from "next/link";
import { Star, Moon, Sun, ArrowRight, MessageCircle, Phone, Video } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moon className="w-8 h-8 text-accent fill-accent" />
          <span className="text-2xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
            Jyotish
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-200">
          <Link href="/astrologers" className="hover:text-accent transition-colors">
            Our Astrologers
          </Link>
          <Link href="/horoscope" className="hover:text-accent transition-colors">
            Horoscope
          </Link>
          <Link href="/blog" className="hover:text-accent transition-colors">
            Blog
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 rounded-full border border-card-border hover:bg-white/10 transition-colors text-sm">
            Login
          </Link>
          <Link href="/signup" className="px-5 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity text-sm shadow-lg shadow-primary/25">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 relative overflow-hidden">
        
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-accent uppercase tracking-wider mb-4">
            <Star className="w-3 h-3 fill-accent" />
            Vedic Wisdom for Modern Life
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Discover Your <br />
            <span className="bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
              Cosmic Path
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Connect with verified Vedic astrologers for instant guidance on love, career, and personal growth through chat, voice, or video.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/astrologers" className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all flex items-center gap-2">
              Chat with Astrologer
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/how-it-works" className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-all text-lg font-medium backdrop-blur-sm">
              How it works
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full px-4">
          {[
            { icon: MessageCircle, title: "Chat Consultation", desc: "Instant text chat with detailed analysis." },
            { icon: Phone, title: "Voice Call", desc: "Speak directly for quick answers and clarity." },
            { icon: Video, title: "Video Session", desc: "Face-to-face consultation for deep connection." }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl text-left hover:border-accent/50 transition-colors group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-6 h-6 text-gray-200 group-hover:text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 border-t border-white/5 bg-black/20 backdrop-blur-lg">
        <p>&copy; {new Date().getFullYear()} Jyotish. All rights reserved.</p>
      </footer>
    </div>
  );
}
