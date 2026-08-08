import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Github, User, ArrowRight, Sparkles } from 'lucide-react';
import AccountSelectionModal from '../components/AccountSelectionModal';

const LoginPage = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const { login, signup, loginWithGoogle, loginWithOAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignup) {
                if (!email) {
                    setError('Email is required for signup');
                    setLoading(false);
                    return;
                }
                // Wait for signup to complete
                await signup(username, email, password);
                // Small delay to ensure localStorage is updated
                await new Promise(resolve => setTimeout(resolve, 100));
                // Auto-login after successful signup
                await login(username, password);
            } else {
                await login(username, password);
            }
            navigate('/');
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign-in cancelled');
            } else if (err.code === 'auth/configuration-not-found') {
                setError('Firebase not configured. Please add your Firebase credentials to src/config/firebase.js');
            } else {
                setError('Google sign-in failed. Please check Firebase configuration.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGitHubClick = () => {
        setShowAccountModal(true);
    };

    const handleAccountSelect = async (account) => {
        setShowAccountModal(false);
        setLoading(true);
        try {
            await loginWithOAuth('github', account);
            navigate('/');
        } catch (err) {
            setError('GitHub login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
            </div>

            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {isSignup ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-white/60">
                        {isSignup ? 'Sign up to start tracking your finances' : 'Sign in to manage your finances'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-xl mb-6 text-sm text-center backdrop-blur-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                        />
                    </div>

                    {isSignup && (
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5 group-focus-within:text-purple-400 transition-colors" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required={isSignup}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                            />
                        </div>
                    )}

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-purple-500/50 disabled:to-pink-500/50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center group"
                    >
                        {loading ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                <span>{isSignup ? 'Sign Up' : 'Sign In'}</span>
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-transparent text-white/40">Or continue with</span>
                        </div>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="flex items-center justify-center gap-3 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all group disabled:opacity-50"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                                <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                                <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                                <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
                            </svg>
                            <span className="text-white/70 group-hover:text-white transition-colors">Google</span>
                        </button>
                        <button
                            onClick={handleGitHubClick}
                            disabled={loading}
                            className="flex items-center justify-center gap-3 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all group disabled:opacity-50"
                        >
                            <Github className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                            <span className="text-white/70 group-hover:text-white transition-colors">GitHub</span>
                        </button>
                    </div>
                </div>

                {/* Toggle Sign In/Sign Up */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => {
                            setIsSignup(!isSignup);
                            setError('');
                            setEmail('');
                        }}
                        className="text-white/60 hover:text-white transition-colors text-sm"
                    >
                        {isSignup ? (
                            <>Already have an account? <span className="text-purple-400 font-semibold">Sign In</span></>
                        ) : (
                            <>Don't have an account? <span className="text-purple-400 font-semibold">Sign Up</span></>
                        )}
                    </button>
                </div>

                {/* Demo Credentials */}
                {!isSignup && (
                    <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                        <p className="text-white/40 text-xs text-center mb-2">Demo Credentials:</p>
                        <p className="text-white/60 text-xs text-center font-mono">admin / password</p>
                    </div>
                )}
            </div>

            {/* Account Selection Modal (for GitHub) */}
            <AccountSelectionModal
                isOpen={showAccountModal}
                onClose={() => setShowAccountModal(false)}
                onSelectAccount={handleAccountSelect}
                provider="github"
            />
        </div>
    );
};

export default LoginPage;
