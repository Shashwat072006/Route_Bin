import { Recycle, TrendingUp, MapPin, BarChart3, Sparkles, Zap, Shield, Clock } from "lucide-react";
import { AddBinDialog } from "./AddBinDialog";

interface HeroSectionProps {
  onBinAdded: () => void;
}

export const HeroSection = ({ onBinAdded }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary-light min-h-[85vh] flex items-center">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-40"></div>
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary-light/30 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-white/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        
        {/* Radial Gradient Spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Status Badge */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/20 transition-all group">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </div>
              <span className="text-sm font-semibold text-white tracking-wide">Live Monitoring System Active</span>
              <Sparkles className="h-4 w-4 text-white/80 group-hover:text-white transition-colors" />
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center space-y-8">
            {/* Heading */}
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
                <span className="inline-block hover:scale-105 transition-transform">Smart</span>{" "}
                <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/80 hover:scale-105 transition-transform">
                  Waste
                </span>
                <br />
                <span className="inline-block hover:scale-105 transition-transform">Management</span>
              </h1>
              <p className="text-2xl md:text-3xl font-light text-white/95 tracking-wide">
                for Sustainable Cities
              </p>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/85 max-w-3xl mx-auto leading-relaxed animate-fade-in-up backdrop-blur-sm" style={{ animationDelay: "0.2s" }}>
              Monitor waste bins in real-time with AI-powered analytics. Optimize collection routes, predict overflow events, and reduce operational costs by up to <span className="font-bold text-white">40%</span>.
            </p>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up pt-4" style={{ animationDelay: "0.3s" }}>
              <AddBinDialog onBinAdded={onBinAdded} />
              <button className="group px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-semibold hover:bg-white/20 hover:border-white/50 transition-all hover:scale-105 shadow-lg flex items-center gap-2">
                <Zap className="h-5 w-5 group-hover:animate-pulse" />
                View Live Demo
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              {[
                { icon: MapPin, label: "Real-time GPS", value: "Live Tracking", color: "from-blue-400/20 to-cyan-400/20" },
                { icon: TrendingUp, label: "AI Predictions", value: "Smart Alerts", color: "from-green-400/20 to-emerald-400/20" },
                { icon: BarChart3, label: "Deep Analytics", value: "Insights", color: "from-purple-400/20 to-pink-400/20" },
                { icon: Recycle, label: "Route Optimization", value: "Efficiency", color: "from-orange-400/20 to-yellow-400/20" },
              ].map((feature, index) => (
                <div
                  key={feature.label}
                  className="group relative animate-fade-in-up"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity`}></div>
                  <div className="relative p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all hover:scale-105 hover:-translate-y-1 shadow-xl">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                        <feature.icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs md:text-sm font-medium text-white/70 mb-1">{feature.label}</div>
                        <div className="text-base md:text-lg font-bold text-white">{feature.value}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-12 pt-8 border-t border-white/10 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
              {[
                { icon: Shield, text: "ISO Certified" },
                { icon: Clock, text: "24/7 Support" },
                { icon: Sparkles, text: "AI-Powered" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                  <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
            className="drop-shadow-2xl"
          />
        </svg>
      </div>
    </section>
  );
};