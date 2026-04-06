import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Zap } from 'lucide-react';
import { SectionBackground } from '../components/SectionBackground';

export function NotFoundPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center relative overflow-hidden pt-20">
      <SectionBackground />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-4 max-w-2xl text-center"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          />
        </div>

        {/* Main 404 Display */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="inline-block"
          >
            <div className="text-8xl md:text-9xl font-black bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
              404
            </div>
          </motion.div>
        </motion.div>

        {/* Page Not Found Text */}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </motion.div>

        {/* Search Icon */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-12"
        >
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="bg-blue-500/20 p-6 rounded-full border border-blue-500/30"
          >
            <Search className="h-10 w-10 text-blue-400" />
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg"
            >
              <Home className="h-5 w-5" />
              Back to Home
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 border-2 border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </motion.button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div variants={itemVariants} className="mt-16">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Home', path: '/', icon: Home },
              { name: 'Features', path: '/features', icon: Zap },
              { name: 'APIs', path: '/apis', icon: Search },
              { name: 'Pricing', path: '/pricing', icon: Zap },
              { name: 'Contact', path: '/contact', icon: Search },
              { name: 'Profile', path: '/profile', icon: Home },
            ].map((link, idx) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                >
                  <Link to={link.path}>
                    <motion.div
                      whileHover={{ scale: 1.05, borderColor: 'rgb(59, 130, 246)' }}
                      className="group bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer"
                    >
                      <Icon className="h-5 w-5 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors">
                        {link.name}
                      </span>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-700/30"
        >
          <p className="text-gray-400 text-sm">
            Need help? <a href="mailto:masg.mgaass@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors underline">Contact our support team</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
