"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JoinTripButtonProps {
  tripId: number;
}

export function JoinTripButton({ tripId }: JoinTripButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/join`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to join trip");
        return;
      }

      toast.success("Successfully joined the trip!");
      router.refresh(); // Refresh page to show "Joined" state and contact info
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleJoin} 
      disabled={loading}
      className="w-full sm:w-auto px-8 py-6 rounded-2xl bg-blue-500 hover:bg-blue-600 font-bold text-lg shadow-xl shadow-blue-500/20 transition-all active:scale-95"
    >
      {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
      Join Trip
    </Button>
  );
}
