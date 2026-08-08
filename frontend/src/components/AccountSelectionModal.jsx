import React from 'react';
import { X, Check } from 'lucide-react';

const AccountSelectionModal = ({ isOpen, onClose, onSelectAccount, provider }) => {
    const mockAccounts = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=8B5CF6&color=fff'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@gmail.com',
            avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=EC4899&color=fff'
        },
        {
            id: 3,
            name: 'Demo User',
            email: 'demo.user@gmail.com',
            avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=3B82F6&color=fff'
        }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <h2 className="text-2xl font-bold mb-2">Choose an account</h2>
                    <p className="text-white/80 text-sm">
                        to continue to Finance Tracker
                    </p>
                </div>

                {/* Account List */}
                <div className="p-4">
                    {mockAccounts.map((account) => (
                        <button
                            key={account.id}
                            onClick={() => onSelectAccount(account)}
                            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 transition-colors group mb-2"
                        >
                            <img
                                src={account.avatar}
                                alt={account.name}
                                className="w-12 h-12 rounded-full"
                            />
                            <div className="flex-1 text-left">
                                <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                    {account.name}
                                </p>
                                <p className="text-sm text-gray-500">{account.email}</p>
                            </div>
                            <Check className="h-5 w-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                        Use another account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountSelectionModal;
