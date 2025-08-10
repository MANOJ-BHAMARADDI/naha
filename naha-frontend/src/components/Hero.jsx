import { motion } from "framer-motion";
// The Link component from react-router-dom has been removed to fix a context error.
import { Github, Linkedin } from "lucide-react"; // Import icons for social media

const Hero = () => {
  return (
    <motion.section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center text-center px-8 bg-blue-500 text-white relative" // Added relative positioning
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-5xl md:text-5xl font-bold">Save Your Money.</h1>
      <h2 className="text-5xl md:text-5xl font-bold mt-2">
        Get Financial Advice through AI based on your recent transactions
      </h2>
      <p className="text-lg md:text-xl mt-6 max-w-2xl">
        NaHa safeguards your money while you save money to invest in your Future
        – All transactions are secure & transparent.
      </p>

      {/* Replaced the react-router-dom Link with a standard <a> tag to resolve the error */}
      <a
        href="/register"
        className="px-4 py-2 bg-white text-blue-500 rounded-lg font-semibold hover:bg-gray-200 my-8"
      >
        Register Now
      </a>

      {/* --- UPDATED FOOTER --- */}
      <footer className="absolute bottom-4 w-full text-center">
        <div className="flex justify-center items-center space-x-6 mb-3">
          {/* GitHub Link */}
          <a
            href="https://github.com/MANOJ-BHAMARADDI" // Replace with your GitHub URL
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="GitHub Profile"
          >
            <Github size={28} />
          </a>
          {/* LinkedIn Link */}
          <a
            href="https://www.linkedin.com/in/manoj-bhamaraddi/" // Replace with your LinkedIn URL
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={28} />
          </a>
        </div>
        <p className="text-sm text-blue-100">Created by Manoj Bhamaraddi</p>
        <p className="text-xs text-blue-200 mt-1">
          © 2025 NaHa. All Rights Reserved.
        </p>
      </footer>
    </motion.section>
  );
};

export default Hero;
