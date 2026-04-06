import React from 'react';
import { Link } from 'react-router-dom';
import { Server, Shield, Zap, ChevronRight, Check, Star, Database, MessageCircle, MessageSquare, User } from 'lucide-react';
import { SectionBackground } from '../components/SectionBackground';

// Pricing plans data
const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 10,
    description: 'Perfect for small projects and personal websites',
    color: 'blue',
    features: ['2 CPU Cores', '2GB RAM', '50GB Storage', 'Free SSL Certificate'],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 25,
    description: 'Ideal for growing businesses and high-traffic sites',
    color: 'purple',
    features: ['4 CPU Cores', '8GB RAM', '200GB Storage', 'DDoS Protection'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 50,
    description: 'For large-scale applications with maximum performance',
    color: 'emerald',
    features: ['8 CPU Cores', '16GB RAM', '500GB Storage', 'Priority Support'],
  }
];

export function HomePage() {
  const [activePlan, setActivePlan] = React.useState(plans[0]);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Auto-rotate plans
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActivePlan(current => {
          const nextIndex = (plans.findIndex(p => p.id === current.id) + 1) % plans.length;
          return plans[nextIndex];
        });
        setIsTransitioning(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Header/Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center relative overflow-hidden">
        <SectionBackground />
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Server className="h-10 w-10 text-blue-500" />
            <h1 className="text-4xl font-bold text-white ml-2">Hostonic</h1>
          </div>
          <h2 className="text-5xl font-bold text-white mb-6">
            Powerful Hosting for Your Platform
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Fast, secure, and reliable hosting solutions for developers and businesses.
            Deploy your applications with confidence.
          </p>
          <Link 
            to="/contact"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            Get Started <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 relative overflow-hidden">
        <SectionBackground />
        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50">
            <Zap className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-white">Lightning Fast</h3>
            <p className="text-gray-300">
              Experience blazing-fast load times with our optimized infrastructure.
            </p>
          </div>
          <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50">
            <Shield className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-white">Secure by Default</h3>
            <p className="text-gray-300">
              Built-in security features to keep your applications safe.
            </p>
          </div>
          <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50">
            <Server className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-white">99.9% Uptime</h3>
            <p className="text-gray-300">
              Reliable hosting with guaranteed uptime for your peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Pricing Section */}
      <section className="container mx-auto px-4 py-16 relative overflow-hidden">
        <SectionBackground />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          {/* Main Content */}
          <div className={`w-full md:w-1/2 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <h2 className="text-4xl font-bold text-white mb-4">{activePlan.name} Plan</h2>
            <div className="flex items-baseline mb-4">
              <span className="text-6xl font-bold text-white">${activePlan.price}</span>
              <span className="text-gray-400 ml-2">/month</span>
            </div>
            <p className="text-xl text-gray-300 mb-8">{activePlan.description}</p>
            <ul className="space-y-4 mb-8">
              {activePlan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-blue-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              to="/pricing"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Start Now <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* Plan Selection Bar */}
          <div className="w-full md:w-1/2 mt-12 md:mt-0">
            <div className="flex flex-col space-y-4">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setActivePlan(plan);
                      setIsTransitioning(false);
                    }, 300);
                  }}
                  className={`
                    bg-blue-600 hover:bg-blue-700
                    p-4 rounded-lg text-left transition-all duration-300
                    ${activePlan.id === plan.id ? 'scale-105 shadow-xl' : 'opacity-70 hover:opacity-90'}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">{plan.name}</span>
                    <span className="text-white">${plan.price}/mo</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Hostonic? Section */}
      <section className="container mx-auto px-4 py-16 relative overflow-hidden">
        <SectionBackground />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Why Hostonic?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 24/7 Support Card */}
            <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-white ml-3">24/7 - 365 Support</h3>
              </div>
              <p className="text-gray-300">
                Help and support available day and night. Our friendly support team is always happy to help you, whatever the question.
              </p>
            </div>

            {/* Money Back Guarantee Card */}
            <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-white ml-3">Money Back Guarantee</h3>
              </div>
              <p className="text-gray-300">
                30-day full money-back guarantee if you're not satisfied with our service. No questions asked.
              </p>
            </div>

            {/* Trustpilot Reviews Card */}
            <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Star className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-white ml-3">Rated Excellent</h3>
              </div>
              <p className="text-gray-300">
                Our customers rate us as 'Excellent' with a 4.8/5 rating across all major review platforms.
              </p>
              <div className="flex mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-blue-500" fill="currentColor" />
                ))}
              </div>
            </div>

            {/* Powerful Hardware Card */}
            <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Database className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-white ml-3">Powerful Hardware</h3>
              </div>
              <p className="text-gray-300">
                All of our servers run on high-performance hardware, featuring the latest CPUs and NVMe SSDs for maximum performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="container mx-auto px-4 py-16 relative overflow-hidden">
        <SectionBackground />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start gap-12">
            {/* Left Side */}
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-500/20 p-3 rounded-xl">
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
                <h2 className="text-5xl font-bold text-white">24/7 - 365 Support</h2>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Our friendly support team is available day and night to assist you with any question or concern. 
                Expect a quick response and expert knowledge. Whether you need help with your server, game, bot, 
                or any technical matter, we're here to help!
              </p>
              <a 
                href="https://wa.me/967772350066"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
                Contact on WhatsApp
              </a>
            </div>

            {/* Right Side - Chat Illustration */}
            <div className="w-full md:w-1/2">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                {/* User Message */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-gray-700 p-2 rounded-full">
                    <User className="h-6 w-6 text-gray-300" />
                  </div>
                  <div className="bg-gray-700/50 rounded-2xl p-4 max-w-[80%]">
                    <p className="text-gray-200">Hey, I need help setting up my server, please help!</p>
                  </div>
                </div>

                {/* Support Response */}
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 p-2 rounded-full">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div className="bg-blue-500/10 rounded-2xl p-4 max-w-[80%]">
                    <p className="text-gray-200">Sure, we're here to help! What specific assistance do you need with your server setup?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}