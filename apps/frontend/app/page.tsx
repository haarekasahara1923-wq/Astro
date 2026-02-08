import Link from "next/link";
import { Star, Moon, ArrowRight, MessageCircle, Phone, Video, Sparkles, FileText, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f]">
      {/* Navigation */}
      <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <Moon className="w-8 h-8 text-amber-400 fill-amber-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Jyotish
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-200">
          <Link href="/astrologers" className="hover:text-amber-400 transition-colors">
            Our Astrologers
          </Link>
          <Link href="/plans" className="hover:text-amber-400 transition-colors">
            Plans
          </Link>
          <Link href="/horoscope" className="hover:text-amber-400 transition-colors">
            Horoscope
          </Link>
          <Link href="/kundali" className="hover:text-amber-400 transition-colors">
            Free Kundali
          </Link>
          <Link href="/shop" className="hover:text-amber-400 transition-colors text-amber-300 font-bold border border-amber-500/30 px-3 py-1 rounded-full bg-amber-500/10">
            Cosmic Gems
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-sm">
            Login
          </Link>
          <Link href="/signup" className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-medium hover:opacity-90 transition-opacity text-sm shadow-lg shadow-amber-500/20">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 py-16 relative overflow-hidden">

        {/* Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-amber-400 uppercase tracking-wider mb-4">
            <Star className="w-3 h-3 fill-amber-400" />
            Vedic Wisdom for Modern Life
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Discover Your <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Cosmic Path
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Connect with verified Vedic astrologers for instant guidance on love, career, and personal growth through chat, voice, or video.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/astrologers" className="group relative px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black rounded-full font-bold text-lg hover:shadow-xl hover:shadow-amber-500/20 transition-all flex items-center gap-2">
              Chat with Astrologer
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/plans" className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-all text-lg font-medium backdrop-blur-sm">
              View Plans
            </Link>
          </div>
        </div>

        {/* Free Services CTA Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-3xl w-full px-4">
          {/* Today's Horoscope */}
          <Link href="/horoscope" className="group glass-panel p-6 rounded-2xl text-left hover:border-purple-500/50 transition-all border border-white/5 hover:scale-[1.02]">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 uppercase">Free</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 uppercase">AI Generated</span>
                </div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-purple-400 transition-colors">Today's Horoscope</h3>
                <p className="text-gray-400 text-sm">Daily predictions for all 12 rashis. Updated every day.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-purple-400 font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              Check Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Free Kundali */}
          <Link href="/kundali" className="group glass-panel p-6 rounded-2xl text-left hover:border-amber-500/50 transition-all border border-white/5 hover:scale-[1.02]">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 uppercase">Free</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 uppercase">PDF Download</span>
                </div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-amber-400 transition-colors">Free Kundali</h3>
                <p className="text-gray-400 text-sm">Generate your Janam Kundali instantly. Download as PDF.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-amber-400 font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              Generate Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full px-4">
          {[
            { icon: MessageCircle, title: "Chat Consultation", desc: "Instant text chat with detailed analysis." },
            { icon: Phone, title: "Voice Call", desc: "Speak directly for quick answers and clarity." },
            { icon: Video, title: "Video Session", desc: "Face-to-face consultation for deep connection." }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl text-left hover:border-amber-400/30 transition-colors group cursor-pointer border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-gray-200 group-hover:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>4.8 Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">1M+</span>
            <span>Happy Users</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">500+</span>
            <span>Expert Astrologers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">24/7</span>
            <span>Available</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 border-t border-white/5 bg-black/20 backdrop-blur-lg">
        <p>&copy; {new Date().getFullYear()} Jyotish. All rights reserved.</p>
      </footer>
    </div>
  );
}
