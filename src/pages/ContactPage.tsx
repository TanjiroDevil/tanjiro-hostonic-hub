import React from 'react';
import { SectionBackground } from '../components/SectionBackground';
import { MessageSquare, Mail, Phone, MapPin } from 'lucide-react';

export function ContactPage() {
  return (
    <>
      {/* Header */}
      <header className="container mx-auto px-4 py-16 text-center relative overflow-hidden">
        <SectionBackground />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Have questions? We're here to help. Contact our friendly team for support or inquiries.
          </p>
        </div>
      </header>

      {/* Contact Form Section */}
      <section className="container mx-auto px-4 py-16 relative overflow-hidden">
        <SectionBackground />
        <div className="relative z-10">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="text-gray-300">+967 772350066</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="text-gray-300">masg.mgaass@gmail.com</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="text-gray-300">Yemen, Sana'a</span>
                  </div>
                </div>
              </div>

              {/* Quick Support */}
              <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Need Quick Support?</h3>
                <p className="text-gray-300 mb-6">
                  Get instant support through WhatsApp. Our team is available 24/7 to assist you.
                </p>
                <a
                  href="https://wa.me/967772350066"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                  Contact on WhatsApp
                </a>
              </div>

              {/* Support Hours */}
              <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Support Hours</h3>
                <div className="space-y-2 text-gray-300">
                  <p>Monday - Friday: 24/7</p>
                  <p>Saturday - Sunday: 24/7</p>
                  <p>Holidays: 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}