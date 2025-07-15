"use client";
import React, { useState, useMemo } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  Activity, Zap, Target, TrendingUp, Cpu, Users, Settings, Bell, Menu, ChevronDown, Lightbulb, DollarSign, Clock
} from 'lucide-react';

// --- Constants & Types ---

const COLORS = {
  primary: '#06b6d4', // cyan-500
  secondary: '#d946ef', // fuchsia-500
  background: '#030712', // gray-950
  card: '#111827', // gray-900
  text: '#f3f4f6', // gray-100
  muted: '#9ca3af', // gray-400
};

type Kpi = {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
};

type Recommendation = {
  id: number;
  insight: string;
  potentialLift: string;
  action: string;
};

type TimeRange = '24H' | '7D' | '30D' | '90D';

// --- Mock Data ---

const mockPerformanceData = (range: TimeRange) => {
  const days = { '24H': 12, '7D': 7, '30D': 30, '90D': 90 }[range];
  return Array.from({ length: days }, (_, i) => {
    const baseValue = 5000 + Math.sin(i / 5) * 1000;
    return {
      name: range === '24H' ? `${i * 2}:00` : `Day ${i + 1}`,
      conversions: Math.floor(baseValue + Math.random() * 500),
      predicted: i > days * 0.7 ? Math.floor(baseValue * 1.1 + Math.random() * 600) : null,
    };
  });
};

const audienceSegmentationData = [
  { name: 'Gen Z (18-24)', value: 3500, fill: COLORS.primary },
  { name: 'Millennials (25-39)', value: 5200, fill: COLORS.secondary },
  { name: 'Gen X (40-55)', value: 2100, fill: '#6366f1' }, // indigo-500
  { name: 'Boomers (56+)', value: 800, fill: '#10b981' }, // emerald-500
];

const aiRecommendations: Recommendation[] = [
  { id: 1, insight: "Video ads on TikTok show 30% higher engagement for 'Gen Z'.", potentialLift: "+15% CTR", action: "Increase TikTok budget by 20%." },
  { id: 2, insight: "Quantum entanglement detected between email subject lines using emojis and open rates.", potentialLift: "+8% Open Rate", action: "A/B test emoji usage in next newsletter." },
  { id: 3, insight: "Ad creative 'SummerVibes_V2' is experiencing fatigue in the 'Millennials' segment.", potentialLift: "+5% ROAS", action: "Refresh creative with new visuals." },
];

const kpiData: Kpi[] = [
  { title: 'Total Conversions', value: '11.6K', change: 12.5, icon: TrendingUp, color: 'text-cyan-400' },
  { title: 'ROAS (Return on Ad Spend)', value: '4.2x', change: 5.2, icon: DollarSign, color: 'text-fuchsia-400' },
  { title: 'Avg. CPC', value: '$1.52', change: -2.1, icon: Activity, color: 'text-emerald-400' },
  { title: 'Real-Time Visitors', value: '845', change: 8.9, icon: Users, color: 'text-indigo-400' },
];

// --- Helper Components ---

const QuantumCard: React.FC<{ title?: string; icon?: React.ElementType; children: React.ReactNode; className?: string }> = 
  ({ title, icon: Icon, children, className = '' }) => (
  <div className={`bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700/50 backdrop-blur-sm ${className} transition-all duration-300 hover:shadow-cyan-500/20`}>
    {title && (
      <div className="flex items-center mb-5 pb-3 border-b border-gray-700/50">
        {Icon && <Icon className="w-5 h-5 mr-3 text-fuchsia-400" />}
        <h2 className="text-lg font-semibold text-cyan-400 tracking-wider uppercase">{title}</h2>
      </div>
    )}
    {children}
  </div>
);

const KpiMetric: React.FC<Kpi> = ({ title, value, change, icon: Icon, color }) => (
  <QuantumCard className="flex flex-col justify-between h-full">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <Icon className={`w-6 h-6 ${color} opacity-80`} />
    </div>
    <div className="mt-4">
      <p className="text-3xl font-bold text-white">{value}</p>
      <div className={`mt-2 flex items-center text-sm ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        <TrendingUp className={`w-4 h-4 mr-1 ${change < 0 ? 'transform rotate-180' : ''}`} />
        {Math.abs(change)}% vs last period
      </div>
    </div>
  </QuantumCard>
);

// --- Dashboard Widgets ---

const PerformanceTrends: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');
  const data = useMemo(() => mockPerformanceData(timeRange), [timeRange]);

  return (
    <QuantumCard title="Quantum Performance Trends" icon={Activity} className="col-span-1 lg:col-span-2">
      <div className="flex justify-end mb-4">
        {['24H', '7D', '30D', '90D'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range as TimeRange)}
            className={`px-4 py-1 text-sm rounded-md ml-2 transition-colors ${
              timeRange === range
                ? 'bg-cyan-500 text-gray-900 font-semibold shadow-lg shadow-cyan-500/50'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {range}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.6}/>
              <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: COLORS.card, border: 'none', borderRadius: '8px', color: COLORS.text }}
            itemStyle={{ color: COLORS.text }}
          />
          <Legend wrapperStyle={{ paddingTop: "15px" }} />
          <Area type="monotone" dataKey="conversions" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorConversions)" name="Actual Conversions" strokeWidth={2} />
          <Area type="monotone" dataKey="predicted" stroke={COLORS.secondary} fillOpacity={1} fill="url(#colorPredicted)" strokeDasharray="5 5" name="Predicted (AI)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </QuantumCard>
  );
};

const AudienceSegmentation: React.FC = () => {
  return (
    <QuantumCard title="Audience Segmentation Insights" icon={Users} className="col-span-1">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={audienceSegmentationData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            labelLine={false}
            // Removed label prop to clean up the visual, relying on tooltip and legend below
          >
            {audienceSegmentationData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white/50" />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: COLORS.card, border: 'none', borderRadius: '8px', color: COLORS.text }}
             itemStyle={{ color: COLORS.text }}
             formatter={(value: number, name: string) => [value.toLocaleString(), name]}
          />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-white">
            11.6K
          </text>
          <text x="50%" y="50%" dy={24} textAnchor="middle" dominantBaseline="middle" className="text-sm fill-gray-400">
            Total Users
          </text>
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {audienceSegmentationData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.fill }}></div>
              <span className="text-gray-300">{item.name}</span>
            </div>
            <span className="font-semibold text-white">{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </QuantumCard>
  );
};

const AIOptimizationRecommendations: React.FC = () => {
  return (
    <QuantumCard title="AI Optimization Engine" icon={Cpu} className="col-span-1 lg:col-span-3">
      <div className="space-y-4">
        {aiRecommendations.map((rec) => (
          <div key={rec.id} className="flex items-start p-4 bg-gray-800/70 rounded-lg border border-fuchsia-500/20 hover:border-fuchsia-500/50 transition duration-300">
            <Lightbulb className="w-6 h-6 text-fuchsia-400 flex-shrink-0 mt-1 mr-4" />
            <div className="flex-grow">
              <p className="text-gray-100 font-medium mb-1">{rec.insight}</p>
              <p className="text-sm text-cyan-400 mb-2">
                <span className="font-semibold">Action:</span> {rec.action}
              </p>
            </div>
            <div className="flex-shrink-0 text-right ml-4">
              <span className="inline-block bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
                {rec.potentialLift}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-6 w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold rounded-lg transition duration-300 shadow-md shadow-fuchsia-600/30 hover:shadow-fuchsia-600/50">
        Implement All Recommendations
      </button>
    </QuantumCard>
  );
};

const RealTimeCampaigns: React.FC = () => {
    const campaigns = [
        { id: 1, name: 'Summer Sale 2024', platform: 'Meta', status: 'Active', spend: 15200, roas: 4.5, trend: 5 },
        { id: 2, name: 'Quantum Leap Launch', platform: 'Google Ads', status: 'Active', spend: 8900, roas: 3.8, trend: 2 },
        { id: 3, name: 'Winter Collection Preview', platform: 'TikTok', status: 'Paused', spend: 3500, roas: 5.1, trend: 0 },
        { id: 4, name: 'Brand Awareness Push', platform: 'LinkedIn', status: 'Active', spend: 12000, roas: 2.9, trend: -3 },
    ];

    return (
        <QuantumCard title="Active Campaigns" icon={Target} className="col-span-1 lg:col-span-3">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Campaign Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Platform</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Spend ($)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">ROAS</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Trend</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {campaigns.map((campaign) => (
                            <tr key={campaign.id} className="hover:bg-gray-800/50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{campaign.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{campaign.platform}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        campaign.status === 'Active' 
                                            ? 'bg-cyan-900 text-cyan-400' 
                                            : 'bg-gray-700 text-gray-400'
                                    }`}>
                                        {campaign.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">{campaign.spend.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-fuchsia-400 text-right">{campaign.roas.toFixed(1)}x</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <span className={`text-sm ${campaign.trend > 0 ? 'text-emerald-400' : campaign.trend < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                        {campaign.trend > 0 ? `▲ ${campaign.trend}%` : campaign.trend < 0 ? `▼ ${Math.abs(campaign.trend)}%` : '—'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </QuantumCard>
    );
};


// --- Layout Components ---

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', icon: Activity, active: true },
    { name: 'Campaigns', icon: Target, active: false },
    { name: 'Audiences', icon: Users, active: false },
    { name: 'AI Insights', icon: Cpu, active: false },
    { name: 'Reports', icon: TrendingUp, active: false },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 fixed h-full hidden lg:block">
      <div className="p-6 flex items-center text-2xl font-bold text-white">
        <Zap className="w-8 h-8 text-cyan-400 mr-3" />
        Quantum<span className="text-fuchsia-400">.AI</span>
      </div>
      <nav className="mt-8">
        {navItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`flex items-center px-6 py-3 text-gray-300 transition duration-200 ${
              item.active
                ? 'bg-cyan-500/10 border-r-4 border-cyan-500 text-cyan-400 font-semibold'
                : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 mr-4" />
            {item.name}
          </a>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-6">
        <button className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition duration-200">
            <Settings className="w-5 h-5 mr-3" />
            Settings
        </button>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 shadow-md border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-10 lg:ml-64">
      <div className="flex items-center">
        <button className="lg:hidden text-gray-400 mr-4">
            <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-semibold text-white">Marketing Analytics Dashboard</h1>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center text-sm text-gray-400">
            <Clock className="w-4 h-4 mr-2 text-cyan-400" />
            <span>Last updated: 2 minutes ago</span>
        </div>
        <button className="text-gray-400 hover:text-cyan-400 transition duration-200 relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-fuchsia-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-fuchsia-500 overflow-hidden">
            {/* Placeholder for user avatar */}
            <div className="w-full h-full bg-fuchsia-800 flex items-center justify-center text-white font-bold">JD</div>
          </div>
          <span className="text-white hidden sm:inline">John Doe</span>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition duration-200" />
        </div>
      </div>
    </header>
  );
};

// --- Main Dashboard Component ---

const QuantumMarketingDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-8 lg:ml-64">
          {/* Feature 1: Real-Time Analytics (KPIs) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi) => (
              <KpiMetric key={kpi.title} {...kpi} />
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Feature 4: Predictive Performance Trends */}
            <PerformanceTrends />
            
            {/* Feature 2: Audience Segmentation Insights */}
            <AudienceSegmentation />
          </div>

          <div className="grid grid-cols-1 gap-8">
             {/* Feature 3: AI-driven Optimization Recommendations */}
            <AIOptimizationRecommendations />

            {/* Active Campaigns Table */}
            <RealTimeCampaigns />
          </div>

        </main>
        <footer className="lg:ml-64 mt-8 p-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © 2024 Quantum.AI Marketing Solutions. Powered by futuristic data science.
        </footer>
      </div>
    </div>
  );
};

export default QuantumMarketingDashboard;