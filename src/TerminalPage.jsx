import { useRef, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import robotpic from "./assets/robotpics.svg";
import gitasset from "./assets/gitasset.svg";
import assettext from "./assets/assettext.svg";


function Terminal({ onNavigate }) {
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const PROMPT = "C:\\Users\\james>";
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const commands = {
    start: `Available commands:
about
skills
experience
projects
education
contact
clear
all
back`,
    about: `Full-stack Software Engineer with 4+ years building enterprise fintech platforms across West Africa.
99.8% uptime. <200ms latency. $50M+ daily operations.`,
    skills: `Frontend: React, TypeScript, Next.js
Backend: Java, Spring Boot, Node.js
Cloud: AWS, Docker, CI/CD
Database: MSSQL, PostgreSQL, MongoDB`,
    experience: `Software Engineer — Aristack Technology Solutions
Architected FX & trading platforms across 3 countries.`,
    projects: `AI Proctoring System
BIME Chrome Extension
Enterprise FX Trading Platform`,
    education: `ND Business Administration
Semicolon Africa — Software Engineering`,
    contact: `Email: jamesasuelimen77@gmail.com
GitHub: github.com/jamesking77-create`,
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    });
  };

  const typeOutput = (text, type = "output", callback) => {
    setIsTyping(true);
    let index = 0;
    let buffer = "";
    setLines((prev) => [...prev, { content: "", type }]);
    const interval = setInterval(() => {
      buffer += text.charAt(index);
      index++;
      setLines((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { content: buffer, type };
        return updated;
      });
      scrollToBottom();
      if (index >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        if (callback) callback();
      }
    }, 8);
  };

  const executeCommand = () => {
    if (!input.trim() || isTyping) return;
    const cmd = input.trim().toLowerCase();
    setLines((prev) => [
      ...prev,
      { content: `${PROMPT} ${input}`, type: "command" },
    ]);
    setInput("");
    scrollToBottom();

    if (cmd === "clear" || cmd === "cls") {
      setTimeout(() => setLines([]), 50);
      return;
    }

    if (cmd === "back") {
      onNavigate();
      return;
    }

    if (cmd === "all") {
      const commandKeys = Object.keys(commands).filter((k) => k !== "start");
      let currentIndex = 0;

      const typeNext = () => {
        if (currentIndex < commandKeys.length) {
          const key = commandKeys[currentIndex];
          setLines((prev) => [
            ...prev,
            { content: `\n=== ${key.toUpperCase()} ===`, type: "output" },
          ]);
          currentIndex++;
          typeOutput(commands[key], "output", typeNext);
        }
      };

      typeNext();
      return;
    }

    if (!commands[cmd]) {
      typeOutput(
        `'${cmd}' is not recognized as an internal or external command, operable program or batch file.`,
        "error",
      );
      return;
    }
    typeOutput(commands[cmd]);
  };

  useEffect(() => {
    setLines([
      {
        content: `Jamessoft Windows [Version 10.0.19045.3803]
(c) Jamessoft Corporation. All rights reserved.

Type 'start' to get started.
`,
        type: "output",
      },
    ]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(scrollToBottom, [lines]);

  return (
    <div className="w-full h-full bg-black/80 backdrop-blur-sm overflow-hidden border border-white/10 rounded-lg shadow-2xl">
      <div
        ref={terminalRef}
        className="h-full overflow-y-auto p-3 font-mono text-[15px]"
        onClick={() => inputRef.current?.focus()}
        style={{ fontFamily: 'Consolas, "Courier New", monospace' }}
      >
        {lines.map((line, i) => (
          <pre
            key={i}
            className={`whitespace-pre-wrap leading-[1.2] m-0 ${
              line.type === "error"
                ? "text-red-400"
                : line.type === "command"
                  ? "text-green-400"
                  : "text-white"
            }`}
          >
            {line.content}
          </pre>
        ))}
        <div className="flex items-start leading-[1.2]">
          <span className="text-green-400 whitespace-nowrap">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && executeCommand()}
            className="bg-transparent outline-none flex-1 text-white font-mono ml-1"
            style={{
              fontFamily: 'Consolas, "Courier New", monospace',
              caretColor: "white",
            }}
            spellCheck={false}
            autoComplete="off"
            disabled={isTyping}
          />
        </div>
      </div>
    </div>
  );
}

export default function TerminalPage({ onMenuClick, onBack }) {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
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
      
        @keyframes robotSlideUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          85% {
            transform: translateY(0%);
          }
          92% {
            transform: translateY(-0.5%);
          }
          100% {
            transform: translateY(0%);
          }
        }
        
        @keyframes terminalFadeIn {
          0% {
            opacity: 0;
            transform: translateX(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(0px) scale(1);
          }
        }
        
        @keyframes gitSlideIn {
          0% {
            opacity: 0;
            transform: translateX(100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0px);
          }
        }
        
        @keyframes backButtonFade {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
          }
        }
        
        .robot-slide-up {
          animation: robotSlideUp 2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
          transform: translateY(100%);
        }
        
        .terminal-fade-in {
          animation: terminalFadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) 1.4s forwards;
          opacity: 0;
          transform: translateX(30px) scale(0.95);
        }
        
        .git-slide-in {
          animation: gitSlideIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards;
          opacity: 0;
          transform: translateX(100px);
        }
        
        .back-button-fade {
          animation: backButtonFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
          opacity: 0;
          transform: translateY(-10px);
        }
      `}</style>

      <div className="h-screen w-screen relative overflow-hidden bg-[#3a3d4410]">
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

        {/* Back Button - Top Left */}
        <button
          onClick={onBack}
          className={`absolute top-36 left-24 z-30 group flex items-center gap-3 px-6 py-3 border border-white/30 text-white font-light text-sm tracking-[0.15em] uppercase hover:bg-white hover:border-none hover:text-[#2d352f] transition-all duration-300 ${
            pageLoaded ? "back-button-fade" : "opacity-0"
          }`}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back</span>
        </button>

        {/* Robot Image - Left Center */}
        <div
          className={`absolute left-16 top-28 z-20 ${
            pageLoaded ? "robot-slide-up" : "opacity-0"
          }`}
        >
          <img
            src={robotpic}
            alt="Robot"
            className="h-[800px] w-auto opacity-80"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Asset Text - Bottom Left */}
        <div
          className={`absolute left-16 bottom-16 z-20 ${
            pageLoaded ? "robot-slide-up" : "opacity-0" 
          }`}
        >
          <img
            src={assettext}
            alt="Asset Text"
            className="h-[400px] w-auto opacity-90"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Terminal - Right Center */}
        <div
          className={`absolute right-28 top-60 -translate-y-1/2 z-10 ${
            pageLoaded ? "terminal-fade-in" : "opacity-0"
          }`}
        >
          <div className="w-[810px] h-[500px]">
            <Terminal onNavigate={onBack} />
          </div>

          <button
            onClick={onMenuClick}
            className="mt-6 w-1/2 ml-48 group flex items-center justify-center gap-3 px-6 py-4 border border-white/30 text-white font-light text-sm tracking-[0.15em] uppercase hover:bg-white hover:border-none hover:text-[#191d1a] transition-all duration-300"
          >
            <span>Explore Menu</span>
            <span className="text-lg group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </button>
        </div>

        {/* Git Asset - Right Side */}
        <div
          className={`absolute right-12 top-28 -translate-y-1/2 z-5 ${
            pageLoaded ? "git-slide-in" : "opacity-0"
          }`}
        >
          <img
            src={gitasset}
            alt="Git Asset"
            className="h-[800px] w-auto opacity-90"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      </div>
    </>
  );
}
  