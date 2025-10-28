import React from 'react';
import { Page } from '../types';


interface ContactSalesPageProps {
    onNavigate: (page: Page) => void;
}

const ContactSalesPage: React.FC<ContactSalesPageProps> = ({ onNavigate }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form submission here (e.g., send to an API endpoint).
    alert('Thank you for your inquiry! Our sales team will be in touch shortly.');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-white animate-fade-in">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Contact Our <span className="text-indigo-400">Sales Team</span>
        </h1>
        <p className="mt-6 text-lg text-gray-400">
          We’re here to help you find the perfect solution for your school, business, or organization. Fill out the form below, and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="mt-12 w-full max-w-2xl bg-gray-800/50 p-8 rounded-2xl border border-gray-700 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input type="text" id="name" name="name" required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
              <input type="text" id="company" name="company" required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Acme Corporation" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Work Email</label>
            <input type="email" id="email" name="email" required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="j.doe@example.com" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">How can we help?</label>
            <textarea id="message" name="message" rows={4} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Tell us about your needs..."></textarea>
          </div>
          <div>
            <button type="submit" className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md font-bold transition-colors">
              Submit Inquiry
            </button>
          </div>
        </form>
      </div>

       <div className="mt-8 text-center text-gray-400 space-y-3">
            <p>Prefer to reach out directly? Email us at <a href="mailto:sales@nuroailabs.com" className="text-indigo-400 hover:underline">sales@nuroailabs.com</a></p>
            <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-900 text-gray-500">OR</span></div>
            </div>
            <button onClick={() => onNavigate(Page.NURO_CHAT)} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                Chat with AI Support
            </button>
       </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
       `}</style>
    </div>
  );
};

export default ContactSalesPage;