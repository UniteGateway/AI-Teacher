import React from 'react';
import { Currency, Page } from '../types';

const NuroLogo: React.FC<{ size?: number; clipId: string }> = ({ size = 25, clipId }) => {
    const height = size;
    const width = (size / 25) * 95; // Aspect ratio of 95:25 from the logo design
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 95 25"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Nuro Logo"
        >
            <g>
                <defs>
                    <clipPath id={clipId}>
                        <path d="M0 0 H 19 V 25 H 0 Z" />
                    </clipPath>
                </defs>
                <g clipPath={`url(#${clipId})`}>
                    {/* The C-shape of the icon */}
                    <circle cx="12.5" cy="12.5" r="11" stroke="white" strokeWidth="3.5" fill="none" />
                </g>
                {/* The dot inside the icon */}
                <circle cx="12.5" cy="12.5" r="3.5" fill="white" />
            </g>
            <text x="32" y="19.5" fontFamily="Poppins, sans-serif" fontSize="18" fontWeight="500">
                nuro
            </text>
        </svg>
    );
};

const SocialIcon: React.FC<{ href: string, path: string, label: string }> = ({ href, path, label }) => (
    <a href={href} className="text-gray-500 hover:text-white transition-colors" aria-label={label}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d={path} />
        </svg>
    </a>
);

const CURRENCIES: Currency[] = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'INR', symbol: '₹' },
    { code: 'GBP', symbol: '£' },
];


interface FooterProps {
    currency: Currency;
    onCurrencyChange: (currency: Currency) => void;
    onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ currency, onCurrencyChange, onNavigate }) => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 pt-16 pb-8 px-8 w-full z-10 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Column 1: Logo and Brand */}
            <div className="col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                     <NuroLogo size={25} clipId="footer-logo-clip" />
                    <span className="text-xl font-bold text-white">AI Labs</span>
                </div>
                <p className="text-sm">Revolutionizing learning with personalized AI tutors.</p>
            </div>
            
            {/* Column 2: Solutions */}
            <div>
                <h3 className="font-semibold text-white tracking-wider uppercase text-sm mb-4">Solutions</h3>
                <ul className="space-y-3 text-sm">
                    <li><button onClick={() => onNavigate(Page.DASHBOARD)} className="hover:text-white transition-colors">Personal Tutoring</button></li>
                    <li><button onClick={() => onNavigate(Page.CONTACT_SALES)} className="hover:text-white transition-colors">School Programs</button></li>
                    <li><button onClick={() => onNavigate(Page.CONTACT_SALES)} className="hover:text-white transition-colors">Corporate Training</button></li>
                </ul>
            </div>
            
            {/* Column 3: Company */}
            <div>
                <h3 className="font-semibold text-white tracking-wider uppercase text-sm mb-4">Company</h3>
                <ul className="space-y-3 text-sm">
                    <li><button onClick={() => onNavigate(Page.ABOUT)} className="hover:text-white transition-colors">About</button></li>
                    <li><button className="hover:text-white transition-colors">Careers</button></li>
                    <li><button className="hover:text-white transition-colors">Press</button></li>
                </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
                <h3 className="font-semibold text-white tracking-wider uppercase text-sm mb-4">Legal</h3>
                <ul className="space-y-3 text-sm">
                    <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
                    <li><button className="hover:text-white transition-colors">Terms of Service</button></li>
                </ul>
            </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
             <div className="flex items-center gap-4 order-3 sm:order-1 mt-4 sm:mt-0">
                <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Nuro AI Labs Limited. All Rights Reserved.</p>
                <div className="relative">
                    <label htmlFor="currency-select" className="sr-only">Select Currency</label>
                    <select
                        id="currency-select"
                        value={currency.code}
                        onChange={(e) => {
                            const selectedCurrency = CURRENCIES.find(c => c.code === e.target.value);
                            if (selectedCurrency) {
                                onCurrencyChange(selectedCurrency);
                            }
                        }}
                        className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-8 py-1"
                    >
                        {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex space-x-6 order-2 sm:order-2">
                <SocialIcon href="#" path="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 2.9,4.79C2.53,5.42 2.33,6.16 2.33,6.94C2.33,8.43 3.11,9.75 4.12,10.55C3.4,10.53 2.73,10.34 2.16,10V10.06C2.16,12.22 3.66,14.03 5.79,14.45C5.45,14.54 5.08,14.58 4.7,14.58C4.42,14.58 4.15,14.56 3.89,14.51C4.45,16.29 6.08,17.56 8.1,17.6C6.62,18.75 4.76,19.44 2.78,19.44C2.44,19.44 2.1,19.42 1.76,19.38C3.78,20.68 6.15,21.43 8.75,21.43C16.01,21.43 19.95,15.53 19.95,10.18C19.95,10 19.95,9.82 19.94,9.64C20.74,9.07 21.44,8.36 22,7.53C21.27,7.85 20.5,8.08 19.68,8.19C20.48,7.73 21.1,6.96 21.46,6.08L22.46,6Z" label="Twitter"/>
                <SocialIcon href="#" path="M19,3H5C3.89,3 3,3.89 3,5V19C3,20.11 3.89,21 5,21H19C20.11,21 21,20.11 21,19V5C21,3.89 20.11,3 19,3M8.5,18H5.5V10H8.5V18M7,8.5C6.17,8.5 5.5,7.83 5.5,7C5.5,6.17 6.17,5.5 7,5.5C7.83,5.5 8.5,6.17 8.5,7C8.5,7.83 7.83,8.5 7,8.5M18.5,18H15.5V13.25C15.5,12.18 14.83,11.5 13.75,11.5C12.5,11.5 11.5,12.5 11.5,13.75V18H8.5V10H11.5V11.25C12.11,10.25 13.25,9.5 14.5,9.5C17,9.5 18.5,11.25 18.5,13.75V18Z" label="LinkedIn"/>
                <SocialIcon href="#" path="M17.77,10.23C17.92,10.08 18,9.9 18,9.71V9.7C18,9.5 17.92,9.32 17.77,9.17L12.42,3.82C12.27,3.67 12.09,3.58 11.9,3.58C11.7,3.58 11.52,3.67 11.37,3.82L6.23,8.96C6.08,9.11 6,9.29 6,9.5V9.51C6,9.71 6.08,9.89 6.23,10.04L11.37,15.18C11.52,15.33 11.7,15.42 11.9,15.42C12.1,15.42 12.28,15.33 12.43,15.18L17.77,10.23Z" label="Medium"/>
            </div>
        </div>
    </footer>
  );
};

export default Footer;