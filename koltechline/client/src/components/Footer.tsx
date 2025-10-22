import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-700">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-purple rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">KolTech</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Innovative platform for developing websites, mobile applications, and AI solutions.
              We are creating the future of technology today.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@koltech.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Home
              </Link>
              <Link to="/portfolio" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Portfolio
              </Link>
              <Link to="/business-accelerator" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Business Accelerator
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Web Development</p>
              <p className="text-gray-400 text-sm">Mobile Applications</p>
              <p className="text-gray-400 text-sm">AI Solutions</p>
              <p className="text-gray-400 text-sm">Consulting</p>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 KolTech. All rights reserved. Created for an innovative future.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;