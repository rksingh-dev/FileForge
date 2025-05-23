import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileImage, FileText, Download, Zap, ArrowRight, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const GITHUB_LINK = "https://github.com/rksingh-dev/FileForge";
const TWITTER_LINK = "https://twitter.com/";
const LINKEDIN_LINK = "https://www.linkedin.com/in/rahul-kumar-singh-1a14401ba/";

const Index = () => {
  const tools = [
    {
      id: "compress-image",
      title: "Compress Images",
      description: "Reduce image file size while maintaining quality",
      icon: FileImage,
      color: "from-blue-500 to-cyan-500",
      route: "/compress-image"
    },
    {
      id: "compress-pdf",
      title: "Compress PDF",
      description: "Make your PDF files smaller and easier to share",
      icon: FileText,
      color: "from-purple-500 to-pink-500",
      route: "/compress-pdf"
    },
    {
      id: "image-to-pdf",
      title: "Image to PDF",
      description: "Convert JPG, PNG images to PDF format",
      icon: Download,
      color: "from-green-500 to-teal-500",
      route: "/image-to-pdf"
    },
    {
      id: "pdf-to-image",
      title: "PDF to Image",
      description: "Extract pages from PDF as high-quality images",
      icon: Upload,
      color: "from-orange-500 to-red-500",
      route: "/pdf-to-image"
    }
  ];

  // Scroll to tools grid
  const handleScrollToTools = () => {
    const el = document.getElementById("tools");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#23233a] to-[#18181b] text-white font-sans">
      {/* Header */}
      <header className="bg-transparent w-full">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white drop-shadow-glow" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                FileForge
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              {/* Social Media Buttons */}
              <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-[#23233a] transition">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2Z"/></svg>
              </a>
              <a href={TWITTER_LINK} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-[#23233a] transition">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M22.46 5.924c-.793.352-1.645.59-2.54.698a4.48 4.48 0 0 0 1.965-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 11.155 9.03c0 .35.04.692.116 1.02C7.728 9.89 4.1 8.1 1.67 5.149c-.384.66-.604 1.426-.604 2.243 0 1.548.788 2.915 1.99 3.717-.732-.023-1.42-.224-2.022-.56v.057c0 2.163 1.54 3.97 3.584 4.378-.375.102-.77.157-1.178.157-.288 0-.566-.028-.838-.08.567 1.77 2.213 3.06 4.166 3.095A8.98 8.98 0 0 1 2 19.54a12.67 12.67 0 0 0 6.88 2.017c8.253 0 12.774-6.833 12.774-12.76 0-.195-.004-.39-.013-.583A9.14 9.14 0 0 0 24 4.59a8.97 8.97 0 0 1-2.54.697z"/></svg>
              </a>
              <a href={LINKEDIN_LINK} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-[#23233a] transition">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
              </a>
              <Button variant="outline" className="hidden md:flex border-gray-700 bg-[#23233a] text-white hover:bg-[#23233a]/80 hover:border-blue-500" onClick={handleScrollToTools}>
                <ArrowRight className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Wagmi style */}
      <section className="w-full flex flex-col items-center justify-center min-h-[60vh] px-4 md:px-0">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 mx-auto py-16 relative">
          {/* Left: Text */}
          <div className="flex-1 flex flex-col items-start justify-center max-w-2xl z-10">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-left">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Your</span>{' '}
              Ultimate <br className="hidden md:block" />
              <span className="text-white">File Processing</span> <br className="hidden md:block" />
              <span className="text-white">Platform</span>
            </h2>
            <p className="text-2xl text-gray-300 mb-10 text-left max-w-xl">
              Compress, convert, and optimize your files with ease. Professional-grade tools that work instantly in your browser.
            </p>
            <div className="flex flex-row gap-4 w-full md:w-auto">
              <button className="rounded-full px-8 py-3 bg-[#3772ff] hover:bg-[#2851b6] text-white font-semibold text-lg transition" onClick={handleScrollToTools}>Get Started</button>
              <button className="rounded-full px-8 py-3 bg-[#23233a] text-gray-100 font-semibold text-lg transition border border-gray-700 hover:border-blue-500">Why FileForge</button>
              <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer" className="rounded-full px-8 py-3 bg-[#23233a] text-gray-300 font-semibold text-lg transition border border-gray-700 hover:border-gray-500 inline-block text-center">View on GitHub</a>
            </div>
          </div>
          {/* Right: Glowing Logo */}
          <div className="flex-1 flex items-center justify-center w-full md:w-auto mt-12 md:mt-0">
            <div className="relative flex items-center justify-center w-[380px] h-[260px] md:w-[420px] md:h-[320px]">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-transparent opacity-60 blur-3xl"></div>
              <span className="relative z-10 text-7xl md:text-8xl font-bold tracking-widest text-white select-none" style={{ fontFamily: 'monospace, monospace' }}>
                FileForge
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-white">
            Powerful Tools at Your Fingertips
          </h3>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Choose from our collection of professional file processing tools designed for speed and quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Link key={tool.id} to={tool.route}>
                <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-[#23233a] border border-gray-700 rounded-2xl overflow-hidden">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white drop-shadow-glow" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <CardDescription className="text-gray-300 mb-4">
                      {tool.description}
                    </CardDescription>
                    <Button
                      variant="ghost"
                      className="w-full bg-[#f4f6fa] text-gray-900 font-bold rounded-xl shadow border border-gray-200 transition hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-blue-400 group flex items-center justify-center"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#18181b]/80 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="w-8 h-8 text-white drop-shadow-glow" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Lightning Fast</h4>
              <p className="text-gray-300">Process your files in seconds with our optimized algorithms</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FileText className="w-8 h-8 text-white drop-shadow-glow" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">High Quality</h4>
              <p className="text-gray-300">Maintain excellent quality while reducing file sizes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Upload className="w-8 h-8 text-white drop-shadow-glow" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Secure & Private</h4>
              <p className="text-gray-300">Your files are processed locally and never stored on our servers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#18181b] text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white drop-shadow-glow" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">FileForge</span>
            </div>
            <div className="text-center md:text-right space-y-2">
              <p className="text-gray-500">© 2025 FileForge. All rights reserved.</p>
              <div className="text-gray-400 text-sm mt-2">
                <div className="font-semibold text-white">Contact Us</div>
                <div>Rahul Kumar Singh</div>
                <div>NIT RAIPUR, SIRPUR HOSTEL</div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Extra: Add a glowing/gradient animation utility if not present in your Tailwind config */}
      <style>{`
        .drop-shadow-glow {
          filter: drop-shadow(0 0 4px #a78bfa) drop-shadow(0 0 8px #6366f1);
        }
      `}</style>
    </div>
  );
};

export default Index;
