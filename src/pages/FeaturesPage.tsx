import React from 'react';
import { SectionBackground } from '../components/SectionBackground';
import { Server, Shield, Zap, Database, Cloud, Globe, Lock, Cpu } from 'lucide-react';

export function FeaturesPage() {
  return (
    <>
      {/* Header */}
      <header className="container mx-auto px-4 py-16 text-center relative overflow-hidden">
        <SectionBackground />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-6">
            Powerful Features for Your Success
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover all the powerful features that make Hostonic the perfect choice for your hosting needs.
          </p>
        </div>
      </header>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16 relative overflow-hidden">
        <SectionBackground />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {/* Performance */}
          <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50">
            <Zap className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-white">High Performance</h3>
            <p className="text-gray-300">
              Lightning-fast servers with optimized configurations for maximum speed and reliability.
            </p>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li>• NVMe SSD Storage</li>
              <li>• Global CDN</li>
              <li>• Optimized Stack</li>
            </ul>
          </div>

          {/* Security */}
          <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50">
            <Shield className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-white">Advanced Security</h3>
            <p className="text-gray-300">
              Enterprise-grade security features to protect your applications and data.
            </p>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li>• DDoS Protection</li>
              <li>• SSL Certificates</li>
              <li>• Regular Backups</li>
            </ul>
          </div>

          {/* Scalability */}
          <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50">
            <Cloud className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-white">Easy Scaling</h3>
            <p className="text-gray-300">
              Scale your resources up or down based on your needs with just a few clicks.
            </p>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li>• Flexible Resources</li>
              <li>• Load Balancing</li>
              <li>• Auto-scaling</li>
            </ul>
          </div>

          {/* Global Network */}
          <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50">
            <Globe className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-white">Global Network</h3>
            <p className="text-gray-300">
              Multiple data centers around the world for optimal performance everywhere.
            </p>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li>• Global Data Centers</li>
              <li>• Low Latency</li>
              <li>• Route Optimization</li>
            </ul>
          </div>

          {/* Control Panel */}
          <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50">
            <Cpu className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-white">Easy Management</h3>
            <p className="text-gray-300">
              Intuitive control panel for easy server and application management.
            </p>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li>• User-friendly Panel</li>
              <li>• Real-time Monitoring</li>
              <li>• API Access</li>
            </ul>
          </div>

          {/* Database */}
          <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50">
            <Database className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-white">Database Solutions</h3>
            <p className="text-gray-300">
              Managed database services for optimal performance and reliability.
            </p>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li>• Multiple DB Engines</li>
              <li>• Automated Backups</li>
              <li>• High Availability</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="container mx-auto px-4 py-16 relative overflow-hidden">
        <SectionBackground />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Technical Specifications</h2>
          <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Processors</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Latest Gen Intel/AMD CPUs</li>
                  <li>• Up to 32 Cores</li>
                  <li>• Advanced CPU Scheduling</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Memory</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• DDR4 ECC RAM</li>
                  <li>• Up to 256GB RAM</li>
                  <li>• Guaranteed Resources</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Storage</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• NVMe SSD Storage</li>
                  <li>• RAID Configuration</li>
                  <li>• Up to 2TB Space</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Network</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 1Gbps Network Port</li>
                  <li>• Unlimited Traffic</li>
                  <li>• DDoS Protection</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Security</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Free SSL Certificates</li>
                  <li>• Firewall Protection</li>
                  <li>• Regular Security Updates</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Support</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 24/7 Technical Support</li>
                  <li>• Monitoring & Alerts</li>
                  <li>• Expert Assistance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}