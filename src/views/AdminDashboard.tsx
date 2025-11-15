import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Market, MarketCategory, Outcome } from '../types';

interface AdminDashboardProps {
  markets: Market[];
  onCreateMarket: (question: string, category: MarketCategory) => void;
  onResolveMarket: (marketId: string, outcome: Outcome.YES | Outcome.NO) => void;
  onSettleMarket: (marketId: string) => void;
  onRedactMarket: (marketId: string) => void;
}

type AdminTab = 'operator' | 'oracle';

const MarketOperatorView: React.FC<Omit<AdminDashboardProps, 'onResolveMarket'>> = ({ markets, onCreateMarket, onSettleMarket, onRedactMarket }) => {
    const [newQuestion, setNewQuestion] = useState('');
    const [newCategory, setNewCategory] = useState<MarketCategory>(MarketCategory.COIN);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (newQuestion.trim() && newCategory) {
            onCreateMarket(newQuestion, newCategory);
            setNewQuestion('');
        }
    };
    
    const generateQuestion = async () => {
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `Generate a short, interesting, and speculative Yes/No question for a prediction market in the category: ${newCategory}. For example: 'Will [event] happen by [date]?'`
            });
                            const generatedText = (response?.text || "").replace(/["']/g, ""); // remove quotes
            setNewQuestion(generatedText);
        } catch (error) {
            console.error("Error generating question:", error);
            setNewQuestion("Failed to generate a question. Please enter one manually.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">Create New Market</h3>
                <form onSubmit={handleCreate} className="bg-gray-800 p-6 rounded-lg space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <select 
                            value={newCategory} 
                            onChange={(e) => setNewCategory(e.target.value as MarketCategory)}
                            className="w-full md:w-1/4 bg-gray-900 border border-gray-600 rounded-md p-3 text-white focus:ring-purple-500 focus:border-purple-500"
                        >
                                {Object.values(MarketCategory).map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <input
                            type="text"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Market Question (e.g., Will X happen by Y?)"
                            className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                     <div className="flex justify-end gap-4">
                        <button type="button" onClick={generateQuestion} disabled={isLoading} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50">
                            {isLoading ? 'Generating...' : '✨ Generate with AI'}
                        </button>
                        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Create Market</button>
                    </div>
                </form>
            </div>
            <div>
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">Manage Markets</h3>
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Market Question</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total Pool</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {markets.map(market => {
                                const totalPool = market.yesPool + market.noPool;
                                return (
                                <tr key={market.id} className={`transition-opacity ${market.isRedacted ? 'opacity-40' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">{market.question}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap font-mono ${market.isRedacted ? 'blur-sm select-none' : ''}`}>${totalPool.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {market.isRedacted ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-black text-gray-400">Redacted</span> : market.isSettled ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-300">Settled</span> : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-300">Active</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onClick={() => onSettleMarket(market.id)} disabled={market.outcome === Outcome.UNRESOLVED || market.isSettled || market.isRedacted} className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 disabled:cursor-not-allowed">Settle</button>
                                        <button onClick={() => onRedactMarket(market.id)} disabled={!market.isSettled || market.isRedacted} className="text-red-400 hover:text-red-300 disabled:text-gray-600 disabled:cursor-not-allowed">Archive & Redact</button>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                 <p className="text-sm text-gray-500 mt-4"><strong>Archive & Redact:</strong> A GDPR-compliant action to permanently obfuscate financial details after settlement.</p>
            </div>
        </div>
    );
};

const OracleView: React.FC<Pick<AdminDashboardProps, 'markets' | 'onResolveMarket'>> = ({ markets, onResolveMarket }) => {
    const unresolvedMarkets = markets.filter(m => m.outcome === Outcome.UNRESOLVED);

    return (
         <div>
            <h3 className="text-2xl font-semibold text-purple-400 mb-4">Resolve Open Markets</h3>
            <p className="text-gray-400 mb-6">As the Oracle, your role is to provide the final outcome. You are blind to all financial data to ensure neutrality.</p>
            {unresolvedMarkets.length > 0 ? (
                <div className="space-y-4">
                {unresolvedMarkets.map(market => (
                    <div key={market.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <p className="text-gray-100">{market.question}</p>
                        <div className="space-x-2">
                            <button onClick={() => onResolveMarket(market.id, Outcome.YES)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Resolve YES</button>
                            <button onClick={() => onResolveMarket(market.id, Outcome.NO)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Resolve NO</button>
                        </div>
                    </div>
                ))}
            </div>
            ) : (
                <p className="text-gray-500 italic text-center py-8">No markets are currently awaiting resolution.</p>
            )}
        </div>
    );
};


const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('operator');

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Admin Control Panel
            </h2>
            <p className="mt-4 text-lg text-gray-400">
            Manage markets and outcomes with privacy-preserving controls.
            </p>
        </div>

        <div className="flex justify-center border-b border-gray-700">
            <button onClick={() => setActiveTab('operator')} className={`px-6 py-3 font-medium text-lg ${activeTab === 'operator' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400 hover:text-white'}`}>
                Market Operator
            </button>
            <button onClick={() => setActiveTab('oracle')} className={`px-6 py-3 font-medium text-lg ${activeTab === 'oracle' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400 hover:text-white'}`}>
                Oracle
            </button>
        </div>

        <div>
            {activeTab === 'operator' ? <MarketOperatorView {...props} /> : <OracleView {...props} />}
        </div>
    </div>
  );
};

export default AdminDashboard;
