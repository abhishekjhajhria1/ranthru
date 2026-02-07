// Button placeholder removed as it was unused.
// Actually I haven't created ui/button yet. I'll use standard elements for now or create the button component next. I'll use standard <a> or <button> with tailwind classes to avoid dependency error before creating components.

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020202] text-white overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none" />

        <div className="z-10 text-center space-y-12 px-4">
          <div className="space-y-4 animate-in fade-in zoom-in duration-1000">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              RANTHRU
              <span className="block text-lg md:text-2xl text-primary font-light tracking-[0.5em] mt-4 uppercase drop-shadow-none animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                Access The Elite
              </span>
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center pt-12">
            <a href="/register" className="group relative w-72 h-16 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-500 rounded flex items-center justify-between px-8 overflow-hidden backdrop-blur-md">
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-500" />
              <span className="relative z-10 font-bold uppercase tracking-widest text-white text-sm group-hover:text-primary transition-colors">Client Entry</span>
              <span className="relative z-10 text-xs text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
            </a>

            <a href="/register" className="group relative w-72 h-16 bg-white/5 border border-white/10 hover:border-white/50 hover:bg-white/10 transition-all duration-500 rounded flex items-center justify-between px-8 overflow-hidden backdrop-blur-md">
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-500" />
              <span className="relative z-10 font-bold uppercase tracking-widest text-white text-sm">Talent Portal</span>
              <span className="relative z-10 text-xs text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        {/* Footer / Disclaimer */}
        <div className="absolute bottom-8 text-center space-y-2">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
            By entering, you verify you are of legal age.
          </p>
          <div className="w-[1px] h-8 bg-zinc-800 mx-auto"></div>
        </div>
      </section>

      {/* Feature Section removed for cleaner look, less scrolling */}
    </main>
  );
}
