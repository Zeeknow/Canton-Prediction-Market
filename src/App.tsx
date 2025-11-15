import { useState } from 'react';
// FIX: Removed unused icons
import { Shield, Coins, Scale, Trophy, Building2, Lock, EyeOff, Database, Server, CheckCircle, XCircle, Plus, Archive, AlertCircle, DollarSign, Users, Clock } from 'lucide-react';

// FIX: Added a 'Market' type to define the shape of your market objects.
// This will fix all the 'null' and 'never' errors.
interface Market {
  id: number;
  question: string;
  category: string;
  deadline: string;
  status: string;
  yesPool: number;
  noPool: number;
  yesBets: number;
  noBets: number;
  totalParticipants: number;
  createdBy: string;
  resolution: string | null; // Can be 'yes', 'no', or null
  financialData: {
    bets: { user: string; amount: number; position: string }[];
  };
}

// FIX: Renamed CantonPredictionMarket to App
const App = () => {
  const [userRole, setUserRole] = useState('predictor'); // 'predictor', 'operator', 'oracle'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showBetModal, setShowBetModal] = useState(false);
  // FIX: Told TypeScript this state can be a Market OR null.
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [betPosition, setBetPosition] = useState('yes');
  const [showCreateMarket, setShowCreateMarket] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  // Market State
  // FIX: Added 'as Market[]' to tell TS this array matches our new Market type.
  const [markets, setMarkets] = useState([
    {
      id: 1,
      question: "Will ETH pass $4000 in 1hr?",
      category: "crypto",
      deadline: "2025-11-13T10:00:00",
      status: "active",
      yesPool: 2500,
      noPool: 1800,
      yesBets: 15,
      noBets: 12,
      totalParticipants: 27,
      createdBy: "operator",
      resolution: null,
      financialData: {
        bets: [
          { user: "Alice", amount: 500, position: "yes" },
          { user: "Bob", amount: 300, position: "no" }
        ]
      }
    },
    {
      id: 2,
      question: "Will XRP ETF be accepted before Q1 2026?",
      category: "sec",
      deadline: "2026-03-31T23:59:59",
      status: "active",
      yesPool: 5600,
      noPool: 4200,
      yesBets: 28,
      noBets: 22,
      totalParticipants: 50,
      createdBy: "operator",
      resolution: null,
      financialData: {
        bets: [
          { user: "Charlie", amount: 1000, position: "yes" },
          { user: "Diana", amount: 800, position: "no" }
        ]
      }
    },
    {
      id: 3,
      question: "Will Tottenham win Man Utd?",
      category: "sports",
      deadline: "2025-11-15T15:00:00",
      status: "active",
      yesPool: 3200,
      noPool: 2900,
      yesBets: 18,
      noBets: 16,
      totalParticipants: 34,
      createdBy: "operator",
      resolution: null,
      financialData: {
        bets: [
          { user: "Eve", amount: 600, position: "yes" },
          { user: "Frank", amount: 500, position: "no" }
        ]
      }
    },
    {
      id: 4,
      question: "Will Tesla launch a solar factory before Q1 2026?",
      category: "stock",
      deadline: "2026-03-31T23:59:59",
      status: "active",
      yesPool: 7800,
      noPool: 6500,
      yesBets: 35,
      noBets: 30,
      totalParticipants: 65,
      createdBy: "operator",
      resolution: null,
      financialData: {
        bets: [
          { user: "Grace", amount: 1500, position: "yes" },
          { user: "Henry", amount: 1200, position: "no" }
        ]
      }
    },
    {
      id: 5,
      question: "Will Bitcoin reach $100k by end of 2025?",
      category: "crypto",
      deadline: "2025-12-31T23:59:59",
      status: "pending_resolution",
      yesPool: 12000,
      noPool: 8000,
      yesBets: 45,
      noBets: 32,
      totalParticipants: 77,
      createdBy: "operator",
      resolution: null,
      financialData: {
        bets: [
          { user: "Ivy", amount: 2000, position: "yes" },
          { user: "Jack", amount: 1500, position: "no" }
        ]
      }
    }
  ] as Market[]);

  const [sequencerLogs, setSequencerLogs] = useState([
    { timestamp: "2025-11-12 09:45:23", event: "Transaction submitted", hash: "0x7a3f9...", visible: "ENCRYPTED" },
    { timestamp: "2025-11-12 09:45:24", event: "Sub-transaction routing", hash: "0x2b4c8...", visible: "PRIVATE" },
    { timestamp: "2025-11-12 09:45:25", event: "Participant validation", hash: "0x9e1d5...", visible: "BLINDED" },
    { timestamp: "2025-11-12 09:45:26", event: "State committed", hash: "0x4f6a2...", visible: "ENCRYPTED" }
  ]);

  const categories = [
    { id: 'all', name: 'All Markets', icon: Database },
    { id: 'crypto', name: 'Coin Prices', icon: Coins },
    { id: 'sec', name: 'SEC & Regulation', icon: Scale },
    { id: 'sports', name: 'Sports', icon: Trophy },
    { id: 'stock', name: 'Stocks', icon: Building2 }
  ];

  // FIX: Added 'number' types to parameters
  const calculateOdds = (yesPool: number, noPool: number) => {
    const total = yesPool + noPool;
    if (total === 0) return { yes: 50, no: 50 };
    return {
      yes: ((yesPool / total) * 100).toFixed(1),
      no: ((noPool / total) * 100).toFixed(1)
    };
  };

  // FIX: Added 'string' type to parameter
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending_resolution': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'resolved': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // FIX: Added 'string' type to parameter
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'crypto': return Coins;
      case 'sec': return Scale;
      case 'sports': return Trophy;
      case 'stock': return Building2;
      default: return Database;
    }
  };

  const filteredMarkets = selectedCategory === 'all' 
    ? markets 
    : markets.filter(m => m.category === selectedCategory);

  const handlePlaceBet = () => {
    // FIX: Added a check to make sure selectedMarket is not null
    if (!selectedMarket) {
      alert('Error: No market selected');
      return;
    }
    if (!betAmount || parseFloat(betAmount) <= 0) {
      alert('Please enter a valid bet amount');
      return;
    }

    const updatedMarkets = markets.map(m => {
      if (m.id === selectedMarket.id) {
        const amount = parseFloat(betAmount);
        return {
          ...m,
          yesPool: betPosition === 'yes' ? m.yesPool + amount : m.yesPool,
          noPool: betPosition === 'no' ? m.noPool + amount : m.noPool,
          yesBets: betPosition === 'yes' ? m.yesBets + 1 : m.yesBets,
          noBets: betPosition === 'no' ? m.noBets + 1 : m.noBets,
          totalParticipants: m.totalParticipants + 1
        };
      }
      return m;
    });

    setMarkets(updatedMarkets);
    setShowBetModal(false);
    setBetAmount('');
    
    // Add sequencer log
    setSequencerLogs(prev => [{
      timestamp: new Date().toLocaleString(),
      event: "Bet transaction processed",
      hash: "0x" + Math.random().toString(16).substr(2, 5) + "...",
      visible: "ENCRYPTED"
    }, ...prev]);
  };

  // FIX: Added types to parameters
  const handleResolveMarket = (marketId: number, outcome: string) => {
    const updatedMarkets = markets.map(m => {
      if (m.id === marketId) {
        return {
          ...m,
          status: 'resolved',
          resolution: outcome
        };
      }
      return m;
    });
    setMarkets(updatedMarkets);
  };

  // FIX: Added 'number' type to parameter
  const handleArchiveMarket = (marketId: number) => {
    const updatedMarkets = markets.map(m => {
      if (m.id === marketId) {
        return {
          ...m,
          status: 'archived',
          financialData: {
            bets: m.financialData.bets.map(b => ({
              ...b,
              user: `REDACTED_${Math.random().toString(36).substr(2, 6).toUpperCase()}`
            }))
          }
        };
      }
      return m;
    });
    setMarkets(updatedMarkets);
    setShowArchiveModal(false);
  };

  // Predictor Dashboard
  const PredictorDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Prediction Markets</h2>
            <p className="text-gray-600 mt-1">Place your bets on real-world outcomes</p>
          </div>
          <Shield className="w-12 h-12 text-blue-600" />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Markets Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMarkets.map(market => {
          const Icon = getCategoryIcon(market.category);
          const odds = calculateOdds(market.yesPool, market.noPool);
          
          return (
            <div key={market.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-medium text-gray-500 uppercase">{market.category}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(market.status)}`}>
                  {market.status.replace('_', ' ')}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">{market.question}</h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="text-xs text-gray-600 mb-1">YES</div>
                  <div className="text-xl font-bold text-green-700">${market.yesPool.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{odds.yes}% • {market.yesBets} bets</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="text-xs text-gray-600 mb-1">NO</div>
                  <div className="text-xl font-bold text-red-700">${market.noPool.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{odds.no}% • {market.noBets} bets</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{market.totalParticipants} participants</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(market.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              {market.status === 'active' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedMarket(market);
                      setBetPosition('yes');
                      setShowBetModal(true);
                    }}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Bet YES
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMarket(market);
                      setBetPosition('no');
                      setShowBetModal(true);
                    }}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Bet NO
                  </button>
                </div>
              )}

              {market.status === 'pending_resolution' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <p className="text-sm font-medium text-yellow-800">Awaiting Oracle Resolution</p>
                </div>
              )}

              {market.status === 'resolved' && (
                <div className={`border rounded-lg p-3 text-center ${
                  market.resolution === 'yes' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <p className="text-sm font-medium">
                    Resolved: <span className="uppercase">{market.resolution}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sequencer Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold">Sequencer Privacy Panel</h3>
          <span className="ml-auto text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
            Infrastructure-Level Privacy
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Canton's sequencer processes transactions with complete blindness. All financial data is encrypted end-to-end.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="space-y-2">
            {sequencerLogs.slice(0, 5).map((log, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-gray-200">
                <span className="text-gray-500">{log.timestamp}</span>
                <span className="font-medium text-gray-700">{log.event}</span>
                <span className="font-mono text-gray-600">{log.hash}</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium">
                  {log.visible}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Market Operator Dashboard
  const OperatorDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Market Operator Dashboard</h2>
            <p className="text-gray-600 mt-1">Manage markets, escrow, and compliance</p>
          </div>
          <button
            onClick={() => setShowCreateMarket(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Market
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600 mb-1">Total Markets</div>
          <div className="text-2xl font-bold text-gray-900">{markets.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600 mb-1">Active Markets</div>
          <div className="text-2xl font-bold text-green-600">
            {markets.filter(m => m.status === 'active').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600 mb-1">Total Volume</div>
          <div className="text-2xl font-bold text-blue-600">
            ${markets.reduce((sum, m) => sum + m.yesPool + m.noPool, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600 mb-1">Total Participants</div>
          <div className="text-2xl font-bold text-purple-600">
            {markets.reduce((sum, m) => sum + m.totalParticipants, 0)}
          </div>
        </div>
      </div>

      {/* Markets Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold">Market Management</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Market</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pools</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {markets.map(market => (
                <tr key={market.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{market.question}</div>
                    <div className="text-xs text-gray-500">{market.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(market.status)}`}>
                      {market.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-green-600">YES: ${market.yesPool}</div>
                      <div className="text-red-600">NO: ${market.noPool}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{market.totalParticipants}</td>
                  <td className="px-6 py-4">
                    {market.status === 'resolved' && (
                      <button
                        onClick={() => {
                          setSelectedMarket(market);
                          setShowArchiveModal(true);
                        }}
                        className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        <Archive className="w-4 h-4" />
                        Archive & Redact
                      </button>
                    )}
                    {market.status === 'archived' && (
                      <span className="text-xs text-gray-500">PII Redacted</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Details (Only visible to Operator) */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold">Financial Details (Operator Only)</h3>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Privacy Note:</strong> You are the only role (besides predictors) who can see financial details. The Oracle is kept completely blind to this information.
          </p>
        </div>
        <div className="space-y-4">
          {markets.slice(0, 2).map(market => (
            <div key={market.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-3">{market.question}</h4>
              <div className="space-y-2">
                {market.financialData.bets.map((bet, idx) => (
                  <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                    <span className="font-medium">{bet.user}</span>
                    <span className={bet.position === 'yes' ? 'text-green-600' : 'text-red-600'}>
                      ${bet.amount} on {bet.position.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Oracle Dashboard
  const OracleDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Oracle Dashboard</h2>
            <p className="text-gray-600 mt-1">Resolve market outcomes with complete neutrality</p>
          </div>
          <Scale className="w-12 h-12 text-purple-600" />
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <EyeOff className="w-6 h-6 text-purple-600 mt-1" />
          <div>
            <h3 className="font-bold text-purple-900 mb-2">Financial Blindness Guarantee</h3>
            <p className="text-sm text-purple-800">
              As the Oracle, you are <strong>completely blind</strong> to all financial data including bet amounts, pool sizes, and participant identities. You only see the market questions and provide truthful outcomes. This ensures your neutrality and trustworthiness.
            </p>
          </div>
        </div>
      </div>

      {/* Markets to Resolve */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Markets Awaiting Resolution</h3>
        <div className="space-y-4">
          {markets.filter(m => m.status === 'pending_resolution').map(market => (
            <div key={market.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{market.question}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="uppercase">{market.category}</span>
                    <span>•</span>
                    <span>Deadline: {new Date(market.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Oracle View:</strong> You only see the question. Financial details are hidden via sub-transaction privacy.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleResolveMarket(market.id, 'yes')}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium"
                >
                  Resolve as YES
                </button>
                <button
                  onClick={() => handleResolveMarket(market.id, 'no')}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium"
                >
                  Resolve as NO
                </button>
              </div>
            </div>
          ))}
          {markets.filter(m => m.status === 'pending_resolution').length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No markets awaiting resolution</p>
            </div>
          )}
        </div>
      </div>

      {/* Resolved Markets */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Recently Resolved</h3>
        <div className="space-y-3">
          {markets.filter(m => m.status === 'resolved').map(market => (
            <div key={market.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{market.question}</h4>
                  <div className="text-xs text-gray-500 mt-1">{market.category}</div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  market.resolution === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {market.resolution === 'yes' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <span className="font-medium uppercase">{market.resolution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Modals
  const BetModal = () => {
    if (!showBetModal || !selectedMarket) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold mb-4">Place Your Bet</h3>
          
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">{selectedMarket.question}</p>
          </div>

          <div className={`mb-4 p-4 rounded-lg border-2 ${
            betPosition === 'yes' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">Betting Position:</span>
              <span className={`text-2xl font-bold ${betPosition === 'yes' ? 'text-green-700' : 'text-red-700'}`}>
                {betPosition.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bet Amount (USD)
            </label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Enter amount"
              min="1"
            />
          </div>

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Canton Privacy Protection:</p>
                <p>Your bet is encrypted using sub-transaction privacy. Only you and the Market Operator can see your bet details. The Oracle remains completely blind.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowBetModal(false);
                setBetAmount('');
              }}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handlePlaceBet}
              className={`flex-1 px-4 py-3 text-white rounded-lg font-medium ${
                betPosition === 'yes' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Confirm Bet
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CreateMarketModal = () => {
    const [newMarket, setNewMarket] = useState({
      question: '',
      category: 'crypto',
      deadline: ''
    });

    if (!showCreateMarket) return null;

    const handleCreate = () => {
      if (!newMarket.question || !newMarket.deadline) {
        alert('Please fill in all fields');
        return;
      }

      const market = {
        id: markets.length + 1,
        question: newMarket.question,
        category: newMarket.category,
        deadline: newMarket.deadline,
        status: 'active',
        yesPool: 0,
        noPool: 0,
        yesBets: 0,
        noBets: 0,
        totalParticipants: 0,
        createdBy: 'operator',
        resolution: null,
        financialData: { bets: [] }
      };

      setMarkets([...markets, market]);
      setShowCreateMarket(false);
      setNewMarket({ question: '', category: 'crypto', deadline: '' });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full">
          <h3 className="text-xl font-bold mb-4">Create New Market</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Market Question
              </label>
              <input
                type="text"
                value={newMarket.question}
                onChange={(e) => setNewMarket({...newMarket, question: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Will ETH pass $5000 by end of Q1?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newMarket.category}
                onChange={(e) => setNewMarket({...newMarket, category: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="crypto">Coin Prices</option>
                <option value="sec">SEC & Regulation</option>
                <option value="sports">Sports</option>
                <option value="stock">Stocks</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="datetime-local"
                value={newMarket.deadline}
                onChange={(e) => setNewMarket({...newMarket, deadline: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setShowCreateMarket(false);
                setNewMarket({ question: '', category: 'crypto', deadline: '' });
              }}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Create Market
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ArchiveModal = () => {
    if (!showArchiveModal || !selectedMarket) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <Archive className="w-8 h-8 text-purple-600" />
            <h3 className="text-xl font-bold">Archive & Redact Market</h3>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-3">
              <strong>Market:</strong> {selectedMarket.question}
            </p> {/* Fixed typo */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-900 mb-2">
                <strong>GDPR Compliance Action:</strong>
              </p>
              <p className="text-xs text-purple-800">
                This action will:
              </p>
              <ul className="text-xs text-purple-800 mt-2 space-y-1 ml-4 list-disc">
                <li>Archive the market contract</li>
                <li>Redact all PII (user identities)</li>
                <li>Replace identifying data with cryptographic hashes</li>
                <li>Maintain transaction auditability</li>
                <li>Honor "right to be forgotten"</li>
              </ul>
            </div>
          </div>

          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Warning:</strong> This action cannot be undone. User identities will be permanently redacted from the market records.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowArchiveModal(false)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => handleArchiveMarket(selectedMarket.id)}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              Archive & Redact
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      {/* Top Navigation */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Canton Prediction Market</h1>
                <p className="text-xs text-gray-500">Sub-Transaction Privacy + GDPR Compliance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUserRole('predictor')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  userRole === 'predictor'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Predictor</span>
                </div>
              </button>
              <button
                onClick={() => setUserRole('operator')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  userRole === 'operator'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Operator</span>
                </div>
              </button>
              <button
                onClick={() => setUserRole('oracle')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  userRole === 'oracle'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  <span>Oracle</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Canton Features Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-6 h-6" />
                <h3 className="text-lg font-bold">Sub-Transaction Privacy</h3>
              </div>
              <p className="text-sm text-blue-50">
                Canton ensures that participants only see their own transaction details. The Oracle resolves outcomes without accessing financial data, maintaining complete neutrality.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Archive className="w-6 h-6" />
                <h3 className="text-lg font-bold">GDPR-Compliant Redaction</h3>
              </div>
              <p className="text-sm text-blue-50">
                After resolution, markets can be archived with PII redaction. User identities are replaced with cryptographic hashes, honoring the "right to be forgotten" while maintaining audit trails.
              </p>
            </div> {/* Fixed typo */}
          </div>
        </div>

        {/* Role-based Dashboard */}
        {userRole === 'predictor' && <PredictorDashboard />}
        {userRole === 'operator' && <OperatorDashboard />}
        {userRole === 'oracle' && <OracleDashboard />}
      </div>

      {/* Modals */}
      <BetModal />
      <CreateMarketModal />
      <ArchiveModal />
    </div>
  );
};

export default App; // <-- FIX: This is the correct export