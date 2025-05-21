"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CustomJerseyRequest {
  id: string;
  designImage: string;
  description: string;
  status: string;
  createdAt: string;
  messages: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      name: string;
    };
  }[];
}

export default function CustomJerseyMessages() {
  const router = useRouter();
  const [requests, setRequests] = useState<CustomJerseyRequest[]>([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/custom-jerseys", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch requests");

      const data = await res.json();
      setRequests(data.requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Custom Jersey Messages</h1>
      <div className="grid gap-6">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Request #{request.id.slice(0, 8)}</span>
                <span className="text-sm font-normal">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <img
                  src={request.designImage}
                  alt="Jersey design"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">
                    {request.description}
                  </p>
                  <p className="text-sm font-medium">
                    Status: {request.status}
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Recent Messages</h3>
                {request.messages.length > 0 ? (
                  <div className="space-y-2">
                    {request.messages.slice(-2).map((message) => (
                      <div
                        key={message.id}
                        className="text-sm p-2 bg-muted rounded-lg"
                      >
                        <p className="font-medium">{message.user.name}</p>
                        <p className="text-muted-foreground">
                          {message.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No messages yet
                  </p>
                )}
                <Button
                  className="mt-4"
                  onClick={() =>
                    router.push(`/custom-jersey/messages/${request.id}`)
                  }
                >
                  View All Messages
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 