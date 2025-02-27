import Link from "next/link";
import { Sparkles, BadgePlus } from "lucide-react";
import BetaSticker from "@/components/layout/BetaSticker";

export default function Terms() {
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
                <h1 className="text-4xl font-bold text-indigo-800 text-bold mt-20 text-center">Terms of Service</h1>

                <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-6">

                    <h2 className="text-gray-800 text-lg mb-6 leading-loose">
                        Welcome to <span className="whitespace-pre-wrap bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-500 bg-clip-text text-center text-l font-bold leading-none tracking-tighter text-transparent">Imagine Kit</span>! By accessing or using our platform, you agree to comply with the following Terms of Service.
                        If you do not agree, please do not use ImagineKit.
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-800">1. Overview</h2>
                            <p className="text-gray-800 text-lg leading-loose">
                                ImagineKit is a toolkit for creating and monetizing AI-powered onchain experiences. These terms govern the use of ImagineKit’s features, services, and integrations.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-800">2. User Responsibilities</h2>
                            <ul className="list-disc list-inside text-gray-800 text-lg leading-loose">
                                <li>You must be at least <strong>18 years old</strong> or have parental consent to use ImagineKit.</li>
                                <li>You are responsible for securing your account, wallet, and private keys.</li>
                                <li>You must <strong>not</strong> use ImagineKit for illegal, harmful, or misleading content.</li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-800">3. AI-Generated Content</h2>
                            <ul className="list-disc list-inside text-gray-800 text-lg leading-loose">
                                <li>AI-generated content is not always accurate and should not be considered factual.</li>
                                <li>Users must comply with third-party AI providers’ terms (e.g., OpenAI’s policies).</li>
                                <li>We are <strong>not liable</strong> for any AI-generated content used in your projects.</li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-800">4. Blockchain Transactions</h2>
                            <ul className="list-disc list-inside text-gray-800 text-lg leading-loose">
                                <li>Onchain transactions (NFTs, smart contract interactions, payments) are <strong>final and irreversible</strong>.</li>
                                <li>Gas fees and transaction costs are the user's responsibility.</li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-800">5. Intellectual Property</h2>
                            <ul className="list-disc list-inside text-gray-800 text-lg leading-loose">
                                <li>You retain ownership of content you create but grant us a <strong>non-exclusive license</strong> to display and promote it.</li>
                                <li>You may not copy, modify, or distribute ImagineKit’s proprietary tools and code without permission.</li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-800">6. Account Suspension & Termination</h2>
                            <p className="text-gray-800 text-lg leading-loose">
                                We reserve the right to suspend or terminate accounts that violate these terms, engage in <strong>fraudulent activities</strong>, or attempt to <strong>exploit vulnerabilities</strong> in our system.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-800">7. Disclaimer & Liability</h2>
                            <ul className="list-disc list-inside text-gray-800 text-lg leading-loose">
                                <li>ImagineKit is provided “as-is” without warranties of any kind.</li>
                                <li>We are <strong>not responsible</strong> for financial losses, data loss, or AI-generated errors.</li>
                                <li>Users are responsible for conducting due diligence before executing blockchain transactions.</li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-800">8. Changes to These Terms</h2>
                            <p className="text-gray-800 text-lg leading-loose">
                                We may update these terms from time to time. Continued use of ImagineKit after updates constitutes acceptance.
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
