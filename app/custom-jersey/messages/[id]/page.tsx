"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import Image from "next/image";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    role: "USER" | "ADMIN";
  };
}

interface CustomJerseyRequest {
  id: string;
  designImage: string;
  description: string;
  size: string;
  quantity: number;
  status: string;
  createdAt: string;
}

export default function CustomJerseyMessagesPage() {
  const { toast } = useToast();
  const params = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [request, setRequest] = useState<CustomJerseyRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchMessages();
      fetchRequest();
    }
  }, [params.id]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/custom-jerseys/${params.id}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/custom-jerseys/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch request");
      const data = await res.json();
      setRequest(data.request);
    } catch (error) {
      console.error("Error fetching request:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/custom-jerseys/${params.id}/messages`, {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Custom Jersey Messages</h1>

      {request && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Request Details</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <Image
                src={request.designImage}
                alt="Jersey Design"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Custom Jersey Request</h2>
              <p className="text-sm text-muted-foreground">Size: {request.size}</p>
              <p className="text-sm text-muted-foreground">Quantity: {request.quantity}</p>
              <p className="text-sm text-muted-foreground">Status: {request.status}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
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
  );
} 