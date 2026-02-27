import { useState, useEffect } from "react";

export default function WorkSection({
  isVisible,
  onClose,
  heroBackgroundSvg,
  characterImage,
  secondSectionBackground,
  secondCharacterPng,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setMounted(true);
    }
  }, [isVisible]);

  return (
    <>
      <style>{`
        @keyframes slideUpFast {
          0% {
            transform: translateY(100vh);
            animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          }
          60% {
            transform: translateY(-2vh);
            animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          80% {
            transform: translateY(1vh);
          }
          100% {
            transform: translateY(0);
          }
        }

        .slide-up-container {
          animation: slideUpFast 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .content-reveal {
          animation: fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        .russo-font {
          font-family: 'Russo One', sans-serif;
        }

        .rostex-font {
          font-family: 'Rostex', sans-serif;
        }
      `}</style>

      <div
        className={`fixed inset-0 z-50 ${!mounted ? "pointer-events-none" : ""}`}
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(100vh)",
          transition: !mounted ? "none" : undefined,
        }}
      >
        <div
          className={`h-[200vh] w-full ${mounted && isVisible ? "slide-up-container" : ""}`}
        >
          {/* First 100vh - Hero Section */}
          <div className="h-screen w-screen relative overflow-hidden">
            {/* Background SVG */}
            <div className="absolute inset-0">
              {heroBackgroundSvg ? (
                <img
                  src={heroBackgroundSvg}
                  alt="Background"
                  className="w-full h-full  object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
              )}
            </div>

            {/* Navigation */}
            <nav className="relative z-10 flex justify-between items-center px-8 lg:px-12 py-6">
              {/* Logo */}
              <div className="flex items-center">
                <div className="text-2xl font-bold text-gray-800">Logo</div>
              </div>

              {/* Nav Links */}
              <div className="hidden md:flex items-center gap-8">
                <a
                  href="#"
                  className="russo-font text-gray-700 hover:text-gray-900 transition-colors text-sm"
                >
                  About
                </a>
                <a
                  href="#"
                  className="russo-font text-gray-700 hover:text-gray-900 transition-colors text-sm"
                >
                  Bespoke Web Design
                </a>
                <a
                  href="#"
                  className="russo-font text-gray-700 hover:text-gray-900 transition-colors text-sm"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="russo-font text-gray-700 hover:text-gray-900 transition-colors text-sm"
                >
                  Insights
                </a>
                <button className="russo-font bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors">
                  Book a Free Consultation
                </button>
              </div>

              {/* Back Button for Mobile */}
              <button
                onClick={onClose}
                className="md:hidden rostex-font text-gray-700 hover:text-gray-900 transition-colors tracking-wider text-sm flex items-center gap-2"
              >
                <span>←</span> BACK
              </button>
            </nav>

            {/* Main Content */}
            <div className="relative z-10 h-[calc(100%-80px)] flex items-center px-8 lg:px-12">
              <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div
                  className="content-reveal"
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="rostex-font text-blue-600 text-xs tracking-[0.3em] mb-4 uppercase font-semibold">
                    A Good Software / Web App
                  </div>

                  <h1
                    className="text-gray-900 font-bold mb-6"
                    style={{
                      fontSize: "clamp(2rem, 4.5vw, 4rem)",
                      lineHeight: "1.1",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Attract more business with{" "}
                    <span className="italic font-normal">results-driven</span>,
                    <br />
                    custom web design
                  </h1>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="russo-font text-gray-700 text-sm">
                        Build Customer Trust
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="russo-font text-gray-700 text-sm">
                        Drive Organic Traffic
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="russo-font text-gray-700 text-sm">
                        Maximize Conversions
                      </span>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"></div>
                      <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white"></div>
                      <div className="w-10 h-10 rounded-full bg-gray-500 border-2 border-white"></div>
                      <div className="w-10 h-10 rounded-full bg-gray-600 border-2 border-white"></div>
                      <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-white"></div>
                    </div>
                    <div>
                      <div className="flex gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="russo-font text-xs text-gray-600">
                        Trusted Web Design Service Worldwide
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Content - Character Image */}
                <div
                  className="relative content-reveal"
                  style={{ animationDelay: "0.5s" }}
                >
                  {characterImage ? (
                    <img
                      src={characterImage}
                      alt="Character"
                      className="w-full h-screen max-w-full mx-auto"
                    />
                  ) : (
                    <div className="w-full h-screen bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Character Image</span>
                    </div>
                  )}

                  {/* Years of Experience Badge */}
                  <div className="absolute bottom-40 right-40  ">
                    <p className="russo-font text-white text-4xl font-bold">
                      years of experience
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Icons */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-10">
              <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
              <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
              <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>
              <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </button>
              <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Second 100vh - Black Section */}
          <div className="h-screen w-screen relative overflow-hidden">
            {/* Background Image/SVG */}
            <div className="absolute inset-0">
              {secondSectionBackground ? (
                <img
                  src={secondSectionBackground}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black"></div>
              )}
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center px-8 lg:px-12">
              <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div>
                  <h2
                    className="text-white font-bold mb-8"
                    style={{
                      fontSize: "clamp(2rem, 4vw, 3.5rem)",
                      lineHeight: "1.2",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Is Your <br />
                    Getting You Business?
                  </h2>

                  {/* Tabs */}
                  <div className="flex gap-2 mb-6">
                    <button className="russo-font bg-yellow-400 text-gray-900 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-yellow-300 transition-colors">
                      Info
                    </button>
                    <button className="russo-font bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                      Elements
                    </button>
                    <button className="russo-font bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                      Votes
                    </button>
                  </div>

                  <button className="russo-font bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-3 rounded-lg text-base font-semibold transition-colors">
                    Visit Site
                  </button>
                </div>

                {/* Right Content - Character Image & Website Mockups */}
                <div className="relative">
                  {secondCharacterPng ? (
                    <img
                      src={secondCharacterPng}
                      alt="Character"
                      className="w-full h-auto max-w-2xl mx-auto"
                    />
                  ) : (
                    <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Character & Mockups</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
