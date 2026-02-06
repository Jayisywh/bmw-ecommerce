import React, { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  DollarSign,
  Clock,
  Search,
  Bell,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [pendingOrders, setPendingOrders] = useState<number | null>(null);
  const [monthlySales, setMonthlySales] = useState<number[] | null>(null);
  const [orderStatusCounts, setOrderStatusCounts] = useState<any>({});

  const fetchDashboard = async () => {
    try {
      const res = await (
        await import("axios")
      ).default.get("http://127.0.0.1:8000/api/admin/dashboard");
      const d = res.data.data;
      setTotalUsers(d.totalUsers);
      setTotalOrders(d.totalOrders);
      setTotalRevenue(d.totalRevenue);
      setPendingOrders(d.pendingOrders);
      setMonthlySales(d.monthlySales || []);
      setOrderStatusCounts(d.orderStatusCounts || {});
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Michael Chen",
      car: "BMW M4 Competition",
      amount: 89500,
      status: "Delivered",
      date: "2024-01-15",
    },
    {
      id: "ORD-002",
      customer: "Sarah Johnson",
      car: "BMW X5 xDrive40i",
      amount: 72300,
      status: "Delivered",
      date: "2024-01-15",
    },
    {
      id: "ORD-003",
      customer: "David Kim",
      car: "BMW i7 xDrive60",
      amount: 126800,
      status: "Pending",
      date: "2024-01-14",
    },
    {
      id: "ORD-004",
      customer: "Emma Wilson",
      car: "BMW 330i Sedan",
      amount: 45200,
      status: "Delivered",
      date: "2024-01-14",
    },
    {
      id: "ORD-005",
      customer: "James Brown",
      car: "BMW X7 M60i",
      amount: 108400,
      status: "Processing",
      date: "2024-01-13",
    },
  ];

  return (
    <div className="p-8">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#1a1d2e] border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="p-2 bg-[#1a1d2e] rounded-lg relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1a1d2e]"></span>
          </button>
          <div className="flex items-center gap-3 ml-2 border-l border-gray-700 pl-4">
            <div className="text-right">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@bmw.com</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={totalUsers !== null ? totalUsers.toLocaleString() : "—"}
          change=""
          isPositive={true}
          icon={<Users className="w-6 h-6" />}
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders !== null ? totalOrders.toLocaleString() : "—"}
          change=""
          isPositive={true}
          icon={<ShoppingBag className="w-6 h-6" />}
          color="bg-purple-500/10 text-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value={
            totalRevenue !== null
              ? `$${(totalRevenue / 1000).toFixed(1)}k`
              : "—"
          }
          change=""
          isPositive={true}
          icon={<DollarSign className="w-6 h-6" />}
          color="bg-emerald-500/10 text-emerald-500"
        />
        <StatCard
          title="Pending Orders"
          value={pendingOrders !== null ? pendingOrders.toString() : "—"}
          change=""
          isPositive={false}
          icon={<Clock className="w-6 h-6" />}
          color="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Monthly Sales & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-[#161927] p-6 rounded-2xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-6">Monthly Sales</h3>
          <div className="h-64 flex items-end gap-2 relative">
            {/* Simple bar visualization from monthlySales */}
            {(monthlySales && monthlySales.length === 12
              ? monthlySales
              : new Array(12).fill(0)
            ).map((v, i) => {
              const max = Math.max(
                ...(monthlySales && monthlySales.length ? monthlySales : [1]),
              );
              const h = max > 0 ? Math.round((v / max) * 100) : 0;
              return (
                <div
                  key={i}
                  className="flex-1 bg-blue-500/20 rounded-t-sm relative group"
                >
                  <div
                    style={{ height: `${h}%` }}
                    className="w-full bg-blue-500 rounded-t-sm transition-all group-hover:bg-blue-400"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-[#161927] p-6 rounded-2xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-6">Order Status</h3>
          <div className="space-y-6">
            <StatusRow
              label="Pending"
              count={orderStatusCounts.Pending || 0}
              color="bg-amber-500"
              total={totalOrders || 1}
            />
            <StatusRow
              label="Processing"
              count={orderStatusCounts.Processing || 0}
              color="bg-blue-500"
              total={totalOrders || 1}
            />
            <StatusRow
              label="Delivered"
              count={orderStatusCounts.Delivered || 0}
              color="bg-emerald-500"
              total={totalOrders || 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon,
  color,
}) => (
  <div className="bg-[#161927] p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <div
        className={`flex items-center text-xs font-medium ${
          isPositive ? "text-emerald-500" : "text-red-500"
        }`}
      >
        {isPositive ? (
          <ChevronUp className="w-3 h-3 mr-1" />
        ) : (
          <ChevronDown className="w-3 h-3 mr-1" />
        )}{" "}
        {change}
      </div>
    </div>
    <p className="text-gray-400 text-sm mb-1">{title}</p>
    <h2 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
      {value}
    </h2>
  </div>
);

const StatusRow = ({ label, count, color, total }: any) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-bold">{count}</span>
    </div>
    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
      <div
        className={`${color} h-full`}
        style={{ width: `${(count / total) * 100}%` }}
      />
    </div>
  </div>
);

export default Dashboard;
