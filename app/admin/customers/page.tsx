"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Users, Phone, Mail, MapPin, Calendar, CheckCircle, XCircle, Eye, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderSummary {
  id: string;
  status: string;
  total: number;
  createdAt: string;
}

interface Customer {
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

export default function CustomerManagementPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setCustomers(data.users || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers?.filter(
    (customer) =>
      customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.phone?.includes(searchQuery) ||
      customer?.state?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PROCESSING": return "bg-blue-50 text-blue-700 border-blue-200";
      case "SHIPPED": return "bg-purple-50 text-purple-700 border-purple-200";
      case "CANCELLED": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5 mb-1.5">
            <Users className="h-3.5 w-3.5 text-black" /> Customer Management
          </span>
          <h1 className="text-3xl font-black uppercase text-black tracking-tight">All Customers</h1>
        </div>
        <Badge className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-none uppercase tracking-widest self-start">
          {filteredCustomers.length} Customers
        </Badge>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
        <Input
          placeholder="Search by name, email, phone, or state..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-none border-zinc-200 focus:border-black transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Users className="h-8 w-8 text-zinc-300 mx-auto mb-3" />
                    <p className="text-sm text-zinc-500 font-medium">No customers found</p>
                    <p className="text-xs text-zinc-400 mt-1">Try adjusting your search query</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                          <span className="text-sm font-black text-black">{customer.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-950">{customer.name}</p>
                          <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">{customer.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-600 flex items-center gap-1">
                          <Mail className="h-3 w-3 text-zinc-400" /> {customer.email}
                        </p>
                        <p className="text-xs text-zinc-600 flex items-center gap-1">
                          <Phone className="h-3 w-3 text-zinc-400" /> {customer.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs text-zinc-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-zinc-400" /> {customer.state}
                      </p>
                      {customer.address && (
                        <p className="text-xs text-zinc-500 mt-1 truncate max-w-[140px]" title={customer.address}>{customer.address}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                          <CheckCircle className="h-3 w-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                          <XCircle className="h-3 w-3" /> Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-zinc-800">{customer._count?.orders || 0}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs text-zinc-500">{new Date(customer.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="inline-flex items-center gap-1 text-zinc-600 hover:text-black bg-transparent hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-400 rounded-none px-2.5 py-1.5 transition-all font-bold text-xs uppercase tracking-wider"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-lg bg-white border border-zinc-200 rounded-none shadow-xl text-black">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase tracking-tight">Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6 pt-2">
              {/* Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">
                <div className="w-14 h-14 bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                  <span className="text-xl font-black text-black">{selectedCustomer.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-lg font-bold text-zinc-900">{selectedCustomer.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedCustomer.isVerified ? (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <CheckCircle className="h-3 w-3" /> Email Verified
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                        <XCircle className="h-3 w-3" /> Email Unverified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Email Address</Label>
                  <p className="text-sm text-zinc-800 mt-1 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-zinc-400" /> {selectedCustomer.email}
                  </p>
                </div>
                <div>
                  <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Phone Number</Label>
                  <p className="text-sm text-zinc-800 mt-1 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-zinc-400" /> {selectedCustomer.phone}
                  </p>
                </div>
                <div>
                  <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">State</Label>
                  <p className="text-sm text-zinc-800 mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400" /> {selectedCustomer.state}
                  </p>
                </div>
                <div>
                  <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Address</Label>
                  <p className="text-sm text-zinc-800 mt-1">{selectedCustomer.address || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Member Since</Label>
                  <p className="text-sm text-zinc-800 mt-1 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    {new Date(selectedCustomer.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                <div>
                  <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Orders</Label>
                  <p className="text-sm font-bold text-zinc-800 mt-1 flex items-center gap-1.5">
                    <ShoppingCart className="h-3.5 w-3.5 text-zinc-400" /> {selectedCustomer._count?.orders || 0}
                  </p>
                </div>
              </div>

              {/* Recent Orders */}
              {selectedCustomer.orders && selectedCustomer.orders.length > 0 && (
                <div className="pt-2">
                  <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-3">Recent Orders</Label>
                  <div className="space-y-2">
                    {selectedCustomer.orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200">
                        <div>
                          <p className="text-xs font-bold text-zinc-800">Order #{order.id.slice(-6)}</p>
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