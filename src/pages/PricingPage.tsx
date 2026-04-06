import React from 'react';
import { Link } from 'react-router-dom';
import { SectionBackground } from '../components/SectionBackground';
import { Check, Shield, Zap, Server, ChevronRight } from 'lucide-react';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 10,
    description: 'Perfect for small projects and personal websites',
    features: [
      '2 CPU Cores',
      '2GB RAM',
      '50GB NVMe Storage',
      'Free SSL Certificate',
      'DDoS Protection',
      'Daily Backups',
      'Email Support'
    ],
    recommended: false
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 25,
    description: 'Ideal for growing businesses and high-traffic sites',
    features: [
      '4 CPU Cores',
      '8GB RAM',
      '200GB NVMe Storage',
      'Free SSL Certificate',
      'Advanced DDoS Protection',
      'Hourly Backups',
      '24/7 Priority Support',
      'Load Balancer',
      'Dedicated IP'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 50,
    description: 'For large-scale applications with maximum performance',
    features: [
      '8 CPU Cores',
      '16GB RAM',
      '500GB NVMe Storage',
      'Wildcard SSL Certificate',
      'Enterprise DDoS Protection',
      'Real-time Backups',
      '24/7 Premium Support',
      'Load Balancer',
      'Multiple Dedicated IPs',
      'Custom Control Panel',
      'Priority Network Route'
    ],
    recommended: false
  }
];

export function PricingPage() {
  return (
    <>
      {/* Header */}
      <header className="container mx-auto px-4 py-16 text-center relative overflow-hidden">
        <SectionBackground />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include our core features with no hidden costs.
          </p>
        </div>
      </header>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-16 relative overflow-hidden">
        <SectionBackground />
        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`
                bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl border
                ${plan.recommended ? 'border-blue-500 scale-105' : 'border-gray-700/50'}
                transition-all duration-300 hover:border-blue-500/50
              `}
            >
              {plan.recommended && (
                <div className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                  Recommended
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-5xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
              <p className="text-gray-300 mb-6">{plan.description}</p>
              <Link
                to="/contact"
                className={`
                  w-full text-center mb-8 inline-block px-6 py-3 rounded-lg text-white font-semibold
                  transition-colors flex items-center justify-center
                  ${plan.recommended ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}
                `}
              >
                Get Started <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Features Included */}
      <section className="container mx-auto px-4 py-16 relative overflow-hidden">
        <SectionBackground />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            All Plans Include
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <Shield className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Security First</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• DDoS Protection</li>
                <li>• SSL Certificates</li>
                <li>• Regular Security Updates</li>
                <li>• Firewall Protection</li>
              </ul>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <Zap className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Performance</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• NVMe SSD Storage</li>
                <li>• Global CDN</li>
                <li>• Optimized Stack</li>
                <li>• 99.9% Uptime</li>
              </ul>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <Server className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Infrastructure</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Multiple Locations</li>
                <li>• Daily Backups</li>
                <li>• Control Panel</li>
                <li>• Expert Support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}