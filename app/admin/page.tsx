"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Package, Users, ShoppingCart, FileText, Trash2, Award, UserPlus, Sparkles } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface Order {
  id: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  customJersey?: {
    designDescription: string;
    size: string;
    color: string;
    quantity: number;
  };
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  order: {
    id: string;
  };
}

interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  totalMessages: number;
  recentOrders: {
    date: string;
    total: number;
  }[];
  orderStatus: {
    status: string;
    count: number;
  }[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  _count: {
    orders: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalMessages: 0,
    recentOrders: [],
    orderStatus: [],
  });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchData();
    fetchStats();
    fetchUsers();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const [ordersRes, messagesRes, notificationsRes] = await Promise.all([
        fetch("/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/messages", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!ordersRes.ok || !messagesRes.ok || !notificationsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [ordersData, messagesData, notificationsData] = await Promise.all([
        ordersRes.json(),
        messagesRes.json(),
        notificationsRes.json(),
      ]);

      setOrders(ordersData.orders || []);
      setMessages(messagesData.messages || []);
      setNotifications(notificationsData.notifications || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setStats({
        totalProducts: data.totalProducts || 0,
        totalCustomers: data.totalCustomers || 0,
        totalOrders: data.totalOrders || 0,
        totalMessages: data.totalMessages || 0,
        recentOrders: data.recentOrders || [],
        orderStatus: data.orderStatus || [],
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!res.ok) {
        throw new Error("Failed to update user role");
      }

      toast({
        title: "Role updated",
        description: `Successfully changed user role to ${newRole}`,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      if (!confirm("Are you sure you want to delete this user?")) return;
      
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      toast({
        title: "User deleted",
        description: "The user has been deleted successfully",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
    },
    {
      title: "Total Messages",
      value: stats.totalMessages,
      icon: FileText,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5 mb-1.5">
            <Sparkles className="h-3.5 w-3.5 text-black" /> Management Center
          </span>
          <h2 className="text-3xl font-black uppercase text-black tracking-tight">Overview Dashboard</h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-white border border-zinc-200 rounded-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-zinc-50 border border-zinc-150">
                  <Icon className="h-4 w-4 text-black" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-black tracking-tight">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border border-zinc-200 rounded-none shadow-sm p-6">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-black">Order Sales Trends (₦)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.recentOrders}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={11} />
                  <YAxis stroke="#71717a" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", borderRadius: "0px" }}
                    labelStyle={{ color: "#000000", fontWeight: "bold" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#000000"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-zinc-200 rounded-none shadow-sm p-6">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-black">Order Status Metrics</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.orderStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="status" stroke="#71717a" fontSize={11} />
                  <YAxis stroke="#71717a" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", borderRadius: "0px" }}
                    itemStyle={{ color: "#000000" }}
                  />
                  <Bar dataKey="count" fill="#000000" radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Section */}
      <div className="bg-white border border-zinc-200 rounded-none shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-2">
            <Users className="h-4 w-4 text-black" /> Registered User Accounts
          </h2>
          <Badge className="bg-black text-white text-[10px] font-bold px-2.5 py-0.5 rounded-none uppercase tracking-widest">
            {users.length} Users
          </Badge>
        </div>
        
        <div className="overflow-x-auto rounded-none border border-zinc-200">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Access Role</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Orders Placed</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-zinc-500">
                    No users registered in the database.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-zinc-950">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-white border border-zinc-200 rounded-none px-2.5 py-1 text-xs text-black font-bold uppercase tracking-wider focus:outline-none focus:border-black transition-colors cursor-pointer"
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-800 font-bold">{user._count?.orders || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="inline-flex items-center gap-1.5 text-red-600 hover:text-white bg-transparent hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-none px-3 py-1.5 transition-all font-bold text-xs uppercase tracking-wider"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete Account
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}