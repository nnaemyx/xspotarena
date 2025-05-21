"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CustomJerseyRequest {
  id: string;
  designImage: string;
  description: string;
  size: string;
  quantity: number;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    role: "USER" | "ADMIN";
  };
}

export default function CustomJerseysPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<CustomJerseyRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<CustomJerseyRequest | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (selectedRequest) {
      fetchMessages();
    }
  }, [selectedRequest]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/custom-jerseys", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data.requests);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load custom jersey requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedRequest) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/custom-jerseys/${selectedRequest.id}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedRequest || !newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/custom-jerseys/${selectedRequest.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setNewMessage("");
      fetchMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const updateStatus = async (status: string) => {
    if (!selectedRequest) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/custom-jerseys", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: selectedRequest.id, status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast({
        title: "Success",
        description: "Status updated successfully",
      });

      fetchRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Custom Jersey Requests</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="md:col-span-1">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Requests</h2>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {requests.map((request) => (
                  <Card
                    key={request.id}
                    className={`p-4 cursor-pointer ${
                      selectedRequest?.id === request.id
                        ? "border-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <p className="font-medium">{request.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm">Status: {request.status}</p>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Request Details and Chat */}
        <div className="md:col-span-2">
          {selectedRequest ? (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Request Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Customer</p>
                    <p>{selectedRequest.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.user.email}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Order Details</p>
                    <p>Size: {selectedRequest.size}</p>
                    <p>Quantity: {selectedRequest.quantity}</p>
                    <p>Status: {selectedRequest.status}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-medium">Description</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedRequest.description}
                  </p>
                </div>
                <div className="mt-4">
                  <p className="font-medium">Design</p>
                  <img
                    src={selectedRequest.designImage}
                    alt="Jersey Design"
                    className="mt-2 max-w-full h-auto rounded-lg"
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => updateStatus("PROCESSING")}
                    disabled={selectedRequest.status === "PROCESSING"}
                  >
                    Mark as Processing
                  </Button>
                  <Button
                    onClick={() => updateStatus("COMPLETED")}
                    disabled={selectedRequest.status === "COMPLETED"}
                  >
                    Mark as Completed
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Chat</h2>
                <ScrollArea className="h-[400px] mb-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.user.role === "ADMIN"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.user.role === "ADMIN"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm font-medium mb-1">
                            {message.user.name}
                          </p>
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                Select a request to view details
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 