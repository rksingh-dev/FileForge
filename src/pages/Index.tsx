import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileImage, FileText, Download, Zap, ArrowRight, Upload, Github, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#23233a] to-[#18181b] text-white font-sans relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>

      {/* Header */}
      <motion.header 
        className="bg-transparent w-full"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white drop-shadow-glow" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                FileForge
              </h1>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
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
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center min-h-[60vh] px-4 md:px-0">
        <div className="max-w-7xl w-full flex flex-col-reverse md:flex-row items-center justify-center gap-8 mx-auto py-16 relative">
          {/* Left: Text */}
          <motion.div 
            className="flex-1 flex flex-col items-center md:items-start justify-center max-w-2xl z-10"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-center md:text-left"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Your</span>{' '}
              Ultimate <br className="hidden md:block" />
              <span className="text-white">File Processing</span> <br className="hidden md:block" />
              <span className="text-white">Platform</span>
            </motion.h2>
            <motion.p 
              className="text-2xl text-gray-300 mb-10 text-center md:text-left max-w-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Compress, convert, and optimize your files with ease. Professional-grade tools that work instantly in your browser.
            </motion.p>
            <motion.div 
              className="flex flex-row gap-4 w-full md:w-auto justify-center md:justify-start"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <button className="rounded-full px-8 py-3 bg-[#3772ff] hover:bg-[#2851b6] text-white font-semibold text-lg transition" onClick={handleScrollToTools}>Get Started</button>
              <button className="rounded-full px-8 py-3 bg-[#23233a] text-gray-100 font-semibold text-lg transition border border-gray-700 hover:border-blue-500">Why FileForge</button>
              <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer" className="rounded-full px-8 py-3 bg-[#23233a] text-gray-300 font-semibold text-lg transition border border-gray-700 hover:border-gray-500 inline-block text-center">View on GitHub</a>
            </motion.div>
          </motion.div>

          {/* Right: Glowing Logo */}
          <motion.div 
            className="flex-1 flex items-center justify-center"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] flex items-center justify-center">
              {/* Glowing Circle */}
              <motion.div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-transparent opacity-60 blur-3xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 0.7, 0.6]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              {/* Centered Text */}
              <motion.span 
                className="relative z-10 text-6xl md:text-8xl font-bold tracking-widest text-white select-none text-center"
                style={{ fontFamily: 'monospace, monospace' }}
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.9, 1, 0.9]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                FileForge
              </motion.span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <motion.section 
        id="tools"
        className="w-full py-20 px-4 md:px-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Our Tools
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <motion.div
                  key={tool.title}
                  className="bg-[#23233a] rounded-2xl p-6 hover:bg-[#2a2a45] transition-colors duration-300"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{tool.title}</h3>
                  </div>
                  <p className="text-gray-400 mb-4">{tool.description}</p>
                  <Link
                    to={tool.route}
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Try it now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="w-full py-20 px-4 md:px-0 bg-[#1a1a2e]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Choose FileForge?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Process your files in seconds with our optimized algorithms",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: FileText,
                title: "High Quality",
                description: "Maintain excellent quality while reducing file sizes",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Upload,
                title: "Secure & Private",
                description: "Your files are processed locally and never stored on our servers",
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="bg-[#23233a] rounded-2xl p-6"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="w-full py-12 px-4 md:px-0 bg-[#1a1a2e] border-t border-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  FileForge
                </h3>
              </div>
              <p className="text-gray-400 mb-4">
                Professional file processing tools that work instantly in your browser.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href={GITHUB_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href={TWITTER_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Twitter className="w-6 h-6" />
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Tools</h4>
              <ul className="space-y-2">
                {tools.map((tool, index) => (
                  <motion.li
                    key={tool.title}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      to={tool.route}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {tool.title}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <motion.li
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <a
                    href={GITHUB_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </motion.li>
                <motion.li
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <a
                    href={GITHUB_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </motion.li>
                <motion.li
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <a
                    href={TWITTER_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Twitter
                  </a>
                </motion.li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <motion.li
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </motion.li>
                <motion.li
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </motion.li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 pt-8 border-t border-gray-800 text-center"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-gray-400">
              © {new Date().getFullYear()} FileForge. All rights reserved.
            </p>
          </motion.div>
        </div>
      </motion.footer>

      {/* Extra: Add a glowing/gradient animation utility if not present in your Tailwind config */}
      <style>{`
        .drop-shadow-glow {
          filter: drop-shadow(0 0 4px #a78bfa) drop-shadow(0 0 8px #6366f1);
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default Index;
