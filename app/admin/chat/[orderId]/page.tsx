"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

interface Order {
  id: string;
  status: string;
  customJersey: {
    designDescription: string;
    size: string;
    color: string;
    quantity: number;
  };
  user: {
    name: string;
    email: string;
  };
}

export default function ChatPage() {
  const params = useParams();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOrderAndMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll for new messages
    return () => clearInterval(interval);
  }, [params.orderId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchOrderAndMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const [orderRes, messagesRes] = await Promise.all([
        fetch(`/api/admin/orders/${params.orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/admin/orders/${params.orderId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!orderRes.ok || !messagesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [orderData, messagesData] = await Promise.all([
        orderRes.json(),
        messagesRes.json(),
      ]);

      setOrder(orderData.order);
      setMessages(messagesData.messages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chat data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/orders/${params.orderId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await res.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/orders/${params.orderId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Chat with {order.user.name}</h1>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Order Status:</span> {order.status}
            </p>
            <p>
              <span className="font-medium">Customer Email:</span>{" "}
              {order.user.email}
            </p>
            <div className="mt-4">
              <h2 className="font-medium mb-2">Custom Jersey Details:</h2>
              <p>Design: {order.customJersey.designDescription}</p>
              <p>Size: {order.customJersey.size}</p>
              <p>Color: {order.customJersey.color}</p>
              <p>Quantity: {order.customJersey.quantity}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6">
          <div className="h-[500px] overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.user.role === "ADMIN" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
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
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 