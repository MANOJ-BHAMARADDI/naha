import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <motion.section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center text-center px-8 bg-blue-500 text-white"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-5xl md:text-5xl font-bold">
        Save Your Money.
      </h1>
      <h2 className="text-5xl md:text-5xl font-bold">
        Get Financial Advice through AI based on your recent transactions
      </h2>
      <p className="text-lg md:text-xl mt-6 max-w-2xl">
        NaHa safeguards your money while you save money to invest  
        in your Future – All transactions are secure & transparent.
      </p>
      
      {/* ✅ Added `my-6` for spacing */}
      <Link 
        to="/register" 
        className="px-4 py-2 bg-white text-blue-500 rounded-lg font-semibold hover:bg-gray-200 my-6"
      >
        Register Now
      </Link>

      <footer className="text-lg md:text-xl mt-6 md:mt-20 max-w-2xl py-6 text-center">
        <p className="text-white-400">© 2025 NaHa. All Rights Reserved.</p>
      </footer>

    </motion.section>
  );
};

export default Hero;
