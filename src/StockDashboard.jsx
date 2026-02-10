import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Search } from "lucide-react";

// ---------------- ATTRACTIVE UI COMPONENTS ----------------
const Card = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.015 }}
        className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-gray-100"
    >
        {children}
    </motion.div>
);

const CardContent = ({ children, className = "" }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);

const Button = ({ children, ...props }) => (
    <button
        className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl hover:opacity-90 flex items-center shadow-lg transition"
        {...props}
    >
        {children}
    </button>
);

const Input = (props) => (
    <input
        className="border p-3 rounded-xl w-full outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
        {...props}
    />
);

// ---------------- MOCK STOCK API (UNCHANGED PARAMETERS) ----------------
async function fetchStock(symbol) {
    const response = await fetch(
        `http://localhost:8080/api/stocks/${symbol}`
    );

    if (!response.ok) {
        throw new Error("Stock not found");
    }

    return await response.json();
}


// ---------------- DASHBOARD ----------------
export default function StockDashboard() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [stock, setStock] = useState(null);

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        const data = await fetchStock(query);
        setStock(data);
        setLoading(false);
    };

    const positive = stock && Number(stock.change) >= 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                    <h1 className="text-3xl font-bold text-gray-800">
                        📈 Stock Market Dashboard
                    </h1>

                    <div className="text-sm text-gray-600">
                        Search stock to view market & financial metrics
                    </div>
                </motion.div>

                {/* Search */}
                <Card>
                    <CardContent className="flex gap-3 items-center">
                        <Input
                            placeholder="Enter Stock Name or Code (TCS, INFY...)"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <Button onClick={handleSearch} disabled={loading}>
                            <Search className="mr-2 h-4 w-4" />
                            {loading ? "Loading..." : "Search"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Summary */}
                {stock && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <InfoCard title="Company" value={stock.company} color="indigo" />
                        <InfoCard title="Symbol" value={stock.symbol} color="purple" />
                        <InfoCard
                            title="Current Price"
                            value={`₹ ${stock.price}`}
                            color="blue"
                        />
                        <InfoCard
                            title="Change"
                            value={`${stock.change} (${stock.changePercent}%)`}
                            color={positive ? "green" : "red"}
                        />
                    </div>
                )}

                {/* Chart */}
                {stock && (
                    <Card>
                        <CardContent>
                            <h2 className="text-xl font-semibold mb-4">
                                📊 Price Trend
                            </h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stock.history}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="price" strokeWidth={3} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Trading Info */}
                {stock && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <InfoCard title="Open" value={`₹ ${stock.open}`} color="cyan" />
                        <InfoCard title="High" value={`₹ ${stock.high}`} color="emerald" />
                        <InfoCard title="Low" value={`₹ ${stock.low}`} color="rose" />
                        <InfoCard
                            title="Prev Close"
                            value={`₹ ${stock.prevClose}`}
                            color="amber"
                        />
                    </div>
                )}

                {/* Fundamental Info */}
                {stock && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <InfoCard title="Volume" value={stock.volume} color="blue" />
                        <InfoCard
                            title="Avg Volume"
                            value={stock.avgVolume}
                            color="indigo"
                        />
                        <InfoCard
                            title="Market Cap"
                            value={stock.marketCap}
                            color="purple"
                        />
                        <InfoCard title="P/E Ratio" value={stock.peRatio} color="green" />
                    </div>
                )}

                {/* Financial Metrics */}
                {stock && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <InfoCard
                            title="Dividend Yield"
                            value={stock.dividendYield}
                            color="emerald"
                        />
                        <InfoCard title="EPS" value={stock.eps} color="cyan" />
                        <InfoCard title="Beta" value={stock.beta} color="rose" />
                        <InfoCard
                            title="52 Week High"
                            value={`₹ ${stock.week52High}`}
                            color="amber"
                        />
                    </div>
                )}

                {/* 52 Week Low */}
                {stock && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoCard
                            title="52 Week Low"
                            value={`₹ ${stock.week52Low}`}
                            color="red"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function InfoCard({ title, value, color = "blue" }) {
    const colors = {
        blue: "from-blue-500 to-blue-600",
        indigo: "from-indigo-500 to-indigo-600",
        purple: "from-purple-500 to-purple-600",
        green: "from-green-500 to-green-600",
        red: "from-red-500 to-red-600",
        cyan: "from-cyan-500 to-cyan-600",
        emerald: "from-emerald-500 to-emerald-600",
        rose: "from-rose-500 to-rose-600",
        amber: "from-amber-500 to-amber-600",
    };

    return (
        <motion.div whileHover={{ scale: 1.04 }}>
            <div
                className={`bg-gradient-to-r ${colors[color]} text-white rounded-2xl shadow-xl p-6 relative overflow-hidden`}
            >
                <div className="absolute inset-0 opacity-10 bg-white" />
                <p className="text-sm opacity-90">{title}</p>
                <p className="text-xl font-semibold mt-2">{value}</p>
            </div>
        </motion.div>
    );
}
