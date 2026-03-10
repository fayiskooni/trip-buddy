"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserMinus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface RemoveMemberButtonProps {
  tripId: number;
  userId: number;
  memberName: string;
}

export function RemoveMemberButton({ tripId, userId, memberName }: RemoveMemberButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    if (!confirm(`Are you sure you want to remove ${memberName} from this trip?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/members/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to remove member");
        return;
      }

      toast.success(`${memberName} removed successfully`);
      router.refresh();
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      onClick={handleRemove} 
      disabled={loading}
      className="rounded-full px-4 text-xs font-bold"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <UserMinus className="h-3.5 w-3.5 mr-1.5" />}
      Remove
    </Button>
  );
}
