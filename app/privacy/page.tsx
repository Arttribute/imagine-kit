import Link from "next/link";
import { Sparkles, BadgePlus } from "lucide-react";
import BetaSticker from "@/components/layout/BetaSticker";

export default function Privacy() {
    return (
        <div className="">
            <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
                <div className="flex items-center my-2 mx-4">
                    <div className="mx-5">
                        <Link href="/">
                            <div className="flex">
                                <p className="p-1 whitespace-pre-wrap bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-500 bg-clip-text text-center text-xl font-bold leading-none tracking-tighter text-transparent">
                                    Imagine kit
                                </p>
                                <Sparkles className="h-4 w-4 mt-0.5 text-indigo-500" />
                                <BetaSticker />
                            </div>
                        </Link>
                    </div>
                    <div className="grow" />
                    <div className="mx-2">
                        <Link href="/worlds/create" passHref>
                            <button className="flex items-center border border-indigo-600 text-indigo-600 font-bold rounded-xl py-1 px-4 shadow-lg my-1">
                                <BadgePlus className="w-5 h-5 mr-1" />
                                Create World
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="p-2 bg-slate-100">
                <h1 className="text-4xl font-bold text-indigo-800 text-bold mt-20 text-center">Privacy Policy</h1>

                <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-6">
                    <h2 className="text-gray-800 text-lg mb-6 leading-loose">
                        Your privacy is important to us. This Privacy Policy explains how ImagineKit collects, uses, and protects your personal data. By using our platform, you agree to the collection and processing of your information as described below.
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-800">1. Information We Collect</h2>
                            <ul className="list-disc list-inside text-gray-800 text-lg leading-loose">
                                <li><strong>Wallet & Blockchain Data:</strong> Wallet addresses and on-chain interactions (e.g., transactions, smart contract interactions).</li>
                                <li><strong>Account Information:</strong> If you create an account, we may store your email (if provided) and username.</li>
                                <li><strong>AI Interactions:</strong> Text inputs, prompts, and generated outputs processed through third-party AI models.</li>
                                <li><strong>Usage Data:</strong> We collect anonymous data about feature usage, errors, and performance to improve ImagineKit.</li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-800">2. How We Use Your Data</h2>
                            <ul className="list-disc list-inside text-gray-800 text-lg leading-loose">
                                <li>Provide and improve ImagineKit’s functionality.</li>
                                <li>Facilitate blockchain transactions (e.g., minting, payments).</li>
                                <li>Enhance AI-generated experiences.</li>
                                <li>Analyze usage trends to optimize performance.</li>
                                <li>Ensure compliance with platform policies and security standards.</li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-800">3. AI and Data Processing</h2>
                            <ul className="list-disc list-inside text-gray-800 text-lg leading-loose">
                                <li>AI-generated content is processed using third-party services (e.g., OpenAI). We do not store full interaction logs permanently.</li>
                                <li>We do not share user data with AI providers beyond what is required to generate responses.</li>
                                <li>AI-generated outputs are not monitored in real time; users must ensure compliance with legal and ethical guidelines.</li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-800">4. Blockchain Transactions & Security</h2>
                            <ul className="list-disc list-inside text-gray-800 text-lg leading-loose">
                                <li>ImagineKit does not store private keys. Users are fully responsible for securing their wallets.</li>
                                <li>On-chain interactions are public and immutable; we cannot modify or delete blockchain records.</li>
                                <li>We implement security measures to protect off-chain data but cannot guarantee absolute security.</li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-800">5. Third-Party Data Sharing</h2>
                            <ul className="list-disc list-inside text-gray-800 text-lg leading-loose">
                                <li>We may integrate with third-party AI models, analytics tools, and blockchain services.</li>
                                <li>ImagineKit does not sell user data but may share necessary data with trusted service providers.</li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-800">6. Security & Data Protection</h2>
                            <ul className="list-disc list-inside text-gray-800 text-lg leading-loose">
                                <li>We use encryption, secure databases (MongoDB), and blockchain security best practices to protect user data.</li>
                                <li>However, users must secure their own wallet keys and personal information.</li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-800">7. Your Rights & Control</h2>
                            <ul className="list-disc list-inside text-gray-800 text-lg leading-loose">
                                <li>You can request data deletion (off-chain data only).</li>
                                <li>You can opt out of AI-generated content storage, but this may limit certain functionalities.</li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-800">8. Changes to This Policy</h2>
                            <p className="text-gray-800 text-lg leading-loose">
                                We may update this Privacy Policy. Users will be notified of significant changes.
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-between items-center text-gray-600 text-sm border-t pt-4">
                        <Link href="/" className="text-indigo-600 font-semibold hover:underline">Back to Home</Link>
                        <p className="text-gray-500">Last updated at: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
