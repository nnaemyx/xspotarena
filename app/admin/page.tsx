"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, Users, ShoppingCart, FileText, Trash2, Award, Sparkles, Eye, Phone, MapPin, Mail, CheckCircle, XCircle, Calendar } from "lucide-react";
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

interface OrderSummary {
  id: string;
  status: string;
  total: number;
  createdAt: string;
}

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
  phone: string;
  state: string;
  address: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
  orders: OrderSummary[];
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PROCESSING": return "bg-blue-50 text-blue-700 border-blue-200";
      case "SHIPPED": return "bg-purple-50 text-purple-700 border-purple-200";
      case "CANCELLED": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      accent: "from-zinc-100 to-zinc-50",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      accent: "from-zinc-100 to-zinc-50",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      accent: "from-zinc-100 to-zinc-50",
    },
    {
      title: "Total Messages",
      value: stats.totalMessages,
      icon: FileText,
      accent: "from-zinc-100 to-zinc-50",
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
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-white border border-zinc-200 rounded-none shadow-sm premium-card-hover overflow-hidden">
              <div className={`h-1 w-full bg-gradient-to-r ${stat.accent}`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {stat.title}
                </CardTitle>
                <div className="p-2.5 bg-zinc-50 border border-zinc-150">
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
      <div className="bg-white border border-zinc-200 rounded-none shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-zinc-200">
          <h2 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-2">
            <Users className="h-4 w-4 text-black" /> Registered User Accounts
          </h2>
          <Badge className="bg-black text-white text-[10px] font-bold px-2.5 py-0.5 rounded-none uppercase tracking-widest">
            {users.length} Users
          </Badge>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-zinc-500">
                    No users registered in the database.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-bold text-zinc-950">{user.name}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-600 flex items-center gap-1">
                          <Mail className="h-3 w-3 text-zinc-400" /> {user.email}
                        </p>
                        <p className="text-xs text-zinc-600 flex items-center gap-1">
                          <Phone className="h-3 w-3 text-zinc-400" /> {user.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-zinc-400" /> {user.state}
                        </p>
                        {user.address && (
                          <p className="text-xs text-zinc-500 truncate max-w-[150px]">{user.address}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                          <CheckCircle className="h-3 w-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                          <XCircle className="h-3 w-3" /> Unverified
                        </span>
                      )}
                    </td>
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
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-1 text-zinc-600 hover:text-black bg-transparent hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-400 rounded-none px-2.5 py-1.5 transition-all font-bold text-xs uppercase tracking-wider"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-white bg-transparent hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-none px-2.5 py-1.5 transition-all font-bold text-xs uppercase tracking-wider"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-lg bg-white border border-zinc-200 rounded-none shadow-xl text-black">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase tracking-tight">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 pt-2">
              {/* User Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 pb-4 border-b border-zinc-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                      <span className="text-lg font-black text-black">{selectedUser.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">{selectedUser.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border rounded-full ${
                          selectedUser.role === "ADMIN" ? "bg-black text-white border-black" : "bg-zinc-100 text-zinc-600 border-zinc-200"
                        }`}>
                          {selectedUser.role}
                        </span>
                        {selectedUser.isVerified ? (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                            <CheckCircle className="h-3 w-3" /> Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                            <XCircle className="h-3 w-3" /> Unverified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm text-zinc-800">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm text-zinc-800">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">State</p>
                  <p className="text-sm text-zinc-800">{selectedUser.state}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Address</p>
                  <p className="text-sm text-zinc-800">{selectedUser.address || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Joined</p>
                  <p className="text-sm text-zinc-800">{new Date(selectedUser.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Orders</p>
                  <p className="text-sm font-bold text-zinc-800">{selectedUser._count?.orders || 0}</p>
                </div>
              </div>

              {/* Recent Orders */}
              {selectedUser.orders && selectedUser.orders.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Recent Orders</p>
                  <div className="space-y-2">
                    {selectedUser.orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200">
                        <div>
                          <p className="text-xs font-bold text-zinc-800">#{order.id.slice(-6)}</p>
                          <p className="text-[10px] text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <span className="text-xs font-bold text-black">₦{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}