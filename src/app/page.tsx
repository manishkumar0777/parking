import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Clock, Smartphone } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-8 animate-fade-in">

        {/* Hero Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium mb-4 animate-slide-up">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Smart Parking System v2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground bg-clip-text">
            Parking Made <span className="text-primary">Effortless</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of urban mobility with our real-time smart parking solution.
            Find, book, and park in seconds.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto pt-4">
          <Link
            href="/auth/signin"
            className="flex-1 flex items-center justify-center py-3 px-6 text-base font-medium rounded-xl text-primary-foreground bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 group"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/auth/signup"
            className="flex-1 flex items-center justify-center py-3 px-6 text-base font-medium rounded-xl text-foreground bg-card border border-border hover:bg-accent transition-all hover:shadow-md"
          >
            Create Account
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full text-left">
          <div className="glass-card p-6 rounded-2xl space-y-3 hover:-translate-y-1 transition-transform duration-300">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Real-time Availability</h3>
            <p className="text-muted-foreground text-sm">
              Live updates on parking slots so you never have to circle around looking for space.
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl space-y-3 hover:-translate-y-1 transition-transform duration-300">
            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Secure Booking</h3>
            <p className="text-muted-foreground text-sm">
              Instant guaranteed reservations with our secure booking system.
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl space-y-3 hover:-translate-y-1 transition-transform duration-300">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Smartphone className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Mobile First</h3>
            <p className="text-muted-foreground text-sm">
              Designed for any device, manage your parking on the go with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
