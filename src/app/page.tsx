import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Clock, Smartphone, Zap } from 'lucide-react';
import Hero3DBackground from '@/components/Hero3DBackground';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session.user.role === 'admin') {
      redirect('/admin');
    } else {
      redirect('/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] relative overflow-hidden text-foreground">
      
      {/* Premium 3D Background */}
      <Hero3DBackground />

      <div className="z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-12 animate-fade-in pt-16 pb-24">

        {/* Hero Section */}
        <div className="space-y-6 max-w-4xl backdrop-blur-sm bg-black/10 p-8 rounded-3xl border border-white/5 shadow-2xl">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-semibold mb-2 animate-slide-up shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Zap className="h-4 w-4 mr-2 text-blue-400" />
            Smart Parking System v2.0
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white drop-shadow-2xl">
            Parking Made <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-pulse">
              Effortless
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-medium drop-shadow-md">
            Experience the future of urban mobility with our real-time smart parking solution. Find, book, and park your vehicle in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 w-full max-w-lg mx-auto pt-8">
            <Link
              href="/auth/signin"
              className="flex-1 flex items-center justify-center py-4 px-8 text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] hover:-translate-y-1 group"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <Link
              href="/auth/signup"
              className="flex-1 flex items-center justify-center py-4 px-8 text-lg font-bold rounded-2xl text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md hover:-translate-y-1"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full text-left">
          <div className="glass-card p-8 space-y-4 group cursor-default">
            <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <Clock className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Real-time Availability</h3>
            <p className="text-slate-400 text-base leading-relaxed">
              Live updates on parking slots so you never have to circle around looking for space. Powered by our ultra-fast IoT bridge.
            </p>
          </div>
          
          <div className="glass-card p-8 space-y-4 group cursor-default">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Secure Booking</h3>
            <p className="text-slate-400 text-base leading-relaxed">
              Instant guaranteed reservations with our secure booking system. Your spot is locked and protected cryptographically.
            </p>
          </div>
          
          <div className="glass-card p-8 space-y-4 group cursor-default">
            <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <Smartphone className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Digital Twin UI</h3>
            <p className="text-slate-400 text-base leading-relaxed">
              Experience our fully immersive 3D Digital Twin dashboard. Monitor slots visually like never before across any device.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
