"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
  };
  order?: {
    id: string;
  };
}

export default function MessagesPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();
      setMessages(data.messages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !reply.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/orders/${selectedMessage.order?.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: reply }),
      });

      if (!res.ok) throw new Error("Failed to send reply");

      setReply("");
      fetchMessages();
      toast({
        title: "Success",
        description: "Reply sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg cursor-pointer ${
                        selectedMessage?.id === message.id
                          ? "bg-primary text-primary-foreground"
                          : message.isRead
                          ? "bg-muted"
                          : "bg-primary/10"
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{message.user.name}</p>
                          <p className="text-sm truncate">{message.content}</p>
                        </div>
                        <span className="text-xs">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Message Details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedMessage ? (
                  <div>
                    <p>Conversation with {selectedMessage.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedMessage.user.email}
                    </p>
                  </div>
                ) : (
                  "Select a conversation"
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMessage ? (
                <div className="space-y-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {messages
                        .filter(
                          (m) =>
                            m.order?.id === selectedMessage.order?.id &&
                            m.user.id === selectedMessage.user.id
                        )
                        .map((message) => (
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
                              <p>{message.content}</p>
                              <p className="text-xs mt-1">
                                {new Date(message.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>

                  <div className="flex gap-2">
                    <Input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Type your reply..."
                    />
                    <Button onClick={handleSendReply}>Send</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Select a conversation to view messages
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 