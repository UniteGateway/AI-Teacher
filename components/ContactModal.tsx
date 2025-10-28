import React from 'react';

interface ContactModalProps {
    onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-lg transform transition-all animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Connect with a Trainer</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <p className="text-gray-400 mb-6">If you need further assistance or wish to speak with a human trainer, please use the contact information below.</p>
                <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Phone Support</p>
                        <p className="text-xl font-semibold text-white tracking-wider">+1 (800) 555-NURO</p>
                    </div>
                     <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Email Support</p>
                        <p className="text-xl font-semibold text-white">support@nuroailabs.com</p>
                    </div>
                </div>
                 <button onClick={onClose} className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Close
                 </button>
            </div>
            <style>{`
                @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ContactModal;
