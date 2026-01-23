import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function MenuPage({ onBack, onNavigate }) {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const menuItems = [
    { id: "about", label: "ABOUT", number: "01" },
    { id: "skills", label: "SKILLS", number: "02" },
    { id: "experience", label: "EXPERIENCE", number: "03" },
    { id: "projects", label: "PROJECTS", number: "04" },
    { id: "education", label: "EDUCATION", number: "05" },
    { id: "contact", label: "CONTACT", number: "06" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        .menu-title {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.05em;
        }

        .menu-item-text {
          font-family: 'Rostex';
          letter-spacing: 0.02em;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .menu-item:hover .menu-item-text {
          letter-spacing: 0.06em;
        }

        .menu-number {
          font-family: 'Courier New', monospace;
          font-size: 0.7rem;
          opacity: 0.5;
        }

        .blob-bg {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(80px);
          animation: float 8s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(50px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-50px, 50px) scale(0.9);
          }
        }

        .social-link {
          font-family: 'Courier New', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }

        .social-link:hover {
          opacity: 1;
        }
      `}</style>

      <div className="h-screen w-screen relative overflow-hidden bg-[#3a3d44]">
        {/* Animated blob backgrounds */}
        <div className="blob-bg top-[-100px] left-[-100px]"></div>
        <div
          className="blob-bg bottom-[-100px] right-[-100px]"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="blob-bg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Header */}
        <div
          className={`absolute top-8 left-12 z-30 ${pageLoaded ? "animate-fadeIn" : "opacity-0"}`}
        >
          <div className="text-white/60 text-sm tracking-wider font-light">
            sharlee / james asuelimen
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onBack}
          className={`absolute top-8 right-12 z-30 group text-white/60 hover:text-white transition-colors duration-300 ${
            pageLoaded ? "animate-fadeIn" : "opacity-0"
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          <X className="w-8 h-8" strokeWidth={1.5} />
        </button>

        {/* Main Content */}
        <div className="relative z-10 h-full flex items-center pl-32">
          {/* Menu Items */}
          <div className="flex flex-col items-start space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`menu-item group ${
                  pageLoaded ? "animate-fadeInUp" : "opacity-0"
                }`}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="flex items-center gap-8">
                  <span className="menu-number text-white/50 whitespace-nowrap">
                    {item.number}
                  </span>
                  <span className="menu-item-text text-white text-5xl font-bold tracking-wide">
                    {item.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`absolute bottom-8 left-12 right-12 flex justify-between items-center z-20 ${
            pageLoaded ? "animate-fadeIn" : "opacity-0"
          }`}
          style={{ animationDelay: "0.8s" }}
        >
          <div className="social-link text-white">↗ instagram</div>
          <div className="social-link text-white">↗ github</div>
        </div>
      </div>
    </>
  );
}
