import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w[90%] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Code className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold">SkillCoders</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering the next generation of tech professionals through expert-led live training and guaranteed internship opportunities.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-indigo-400">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-indigo-400">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-indigo-400">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-indigo-400">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/courses" className="text-gray-400 hover:text-indigo-400">Courses</Link></li>
              <li><Link to="/internships" className="text-gray-400 hover:text-indigo-400">Internships</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-indigo-400">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-indigo-400">Contact</Link></li>
              <li><Link to="/support" className="text-gray-400 hover:text-indigo-400">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center"><Mail className="h-5 w-5 text-indigo-400 mr-2" /><a href="mailto:info@skillcoders.com" className="text-gray-400 hover:text-indigo-400">info@skillcoders.com</a></li>
              <li className="flex items-center"><Phone className="h-5 w-5 text-indigo-400 mr-2" /><a href="tel:+91-1234567890" className="text-gray-400 hover:text-indigo-400">+91 123 456 7890</a></li>
              <li className="flex items-start"><MapPin className="h-5 w-5 text-indigo-400 mr-2 mt-1" /><span className="text-gray-400">123 Tech Park, Bangalore,<br />Karnataka, India - 560001</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates on new courses and opportunities.</p>
            <form className="space-y-2">
              <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button type="submit" className="w-full px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SkillCoders. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
