import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Zap, Shield, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white dark:bg-[#0b0f19] overflow-x-hidden">
      {/* =======================
          HERO SECTION (Apple Style)
      ======================== */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6">
        {/* Background Image/Video - Use a high-quality dark BMW image here */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://bmw.scene7.com/is/image/BMW/BMW-MY26-X1-Homepage-FMA-000065102-Retouched?wid=2560&hei=1794"
            alt="BMW Hero"
            className="w-full h-full object-cover brightness-50 dark:brightness-[0.4]"
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-[#0b0f19] via-transparent to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto space-y-6 animate-fade-in-up">
          <h2 className="text-[#1C69D2] font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-2">
            The Ultimate Driving Machine
          </h2>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-tight">
            Future Driven.
          </h1>
          <p className="text-gray-200 text-lg md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">
            Experience the next generation of electric luxury and performance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              to="/models"
              className="px-8 py-4 bg-[#1C69D2] hover:bg-[#1652a7] text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_40px_-10px_rgba(28,105,210,0.6)]"
            >
              Explore Models
            </Link>
            <Link
              to="/compare"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-lg transition-all flex items-center gap-2 group"
            >
              Compare Cars
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* =======================
          BENTO GRID FEATURES
      ======================== */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Beyond the Drive.
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xl">
            Technology that feels like magic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
          {/* Card 1: Large Span - Interior */}
          <div className="md:col-span-2 relative rounded-3xl overflow-hidden group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2400&auto=format&fit=crop"
              alt="Interior"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex flex-col justify-end p-10">
              <h3 className="text-3xl font-bold text-white mb-2">
                Luxury Interior
              </h3>
              <p className="text-gray-300 mb-6">
                Crafted with sustainable materials and intelligent ambiance.
              </p>
              <span className="text-white font-bold flex items-center gap-2 underline decoration-[#1C69D2] underline-offset-4">
                View Gallery <ArrowRight size={16} />
              </span>
            </div>
          </div>

          {/* Card 2: Performance */}
          <div className="relative rounded-3xl overflow-hidden bg-gray-100 dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-8 flex flex-col justify-between group">
            <div>
              <Zap className="text-[#1C69D2] mb-4" size={40} />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Electric
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                0-60 mph in 3.5s. <br />
                100% Electric. <br />
                Zero Emissions.
              </p>
            </div>
            <div className="w-full h-32 mt-4 relative">
              {/* Abstract decorative element representing speed */}
              <div className="absolute inset-0 bg-linear-to-r from-[#1C69D2]/0 via-[#1C69D2]/20 to-[#1C69D2]/0 blur-xl transition-opacity group-hover:opacity-100 opacity-50" />
            </div>
          </div>

          {/* Card 3: Technology */}
          <div className="relative rounded-3xl overflow-hidden bg-[#1C69D2] text-white p-8 flex flex-col justify-center items-center text-center group">
            <div className="mb-6 p-4 rounded-full bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
              <Play fill="white" size={32} />
            </div>
            <h3 className="text-3xl font-bold mb-2">iDrive 9</h3>
            <p className="text-white/80">
              The most advanced operating system ever in a vehicle.
            </p>
          </div>

          {/* Card 4: Safety/Structure */}
          <div className="md:col-span-2 relative rounded-3xl overflow-hidden group">
            <img
              src="https://cdn.bmwblog.com/wp-content/uploads/2022/02/BMW-M8-Competition-Coupe-Wheelsandmore-3-scaled.jpg"
              alt="Exterior"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-75"
            />
            <div className="absolute top-8 left-8">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-widest border border-white/20">
                M Series
              </span>
            </div>
            <div className="absolute bottom-8 left-8">
              <h3 className="text-3xl font-bold text-white">
                Precision Engineering
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* =======================
          CALL TO ACTION (Apple Footer Style)
      ======================== */}
      <section className="py-20 bg-gray-100 dark:bg-[#111827]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            Find the BMW that matches you.
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto">
            From the sporty M series to the all-electric i series, build a
            machine that fits your lifestyle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/models"
              className="px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Browse All Models
            </Link>
            <Link
              to="/signup"
              className="px-10 py-4 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
