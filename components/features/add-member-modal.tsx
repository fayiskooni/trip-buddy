"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddMemberModalProps {
  tripId: number;
  maxParticipants: number;
  currentCount: number;
}

export function AddMemberModal({ tripId, maxParticipants, currentCount }: AddMemberModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isFull = currentCount >= maxParticipants;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    try {
      const res = await fetch(`/api/trips/${tripId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Failed to add member");
        return;
      }

      toast.success("Traveler successfully added to your trip roster!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          disabled={isFull}
          className="rounded-full px-6 font-bold shadow-md bg-[#0ea5e9] hover:bg-[#0284c7] text-white shrink-0"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {isFull ? "Trip Full" : "Add Manually"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Traveler Manually</DialogTitle>
          <DialogDescription>
            Enter the details of the traveler you wish to manually add to this trip. 
            If they don't have an account, a placeholder will be created.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
            <Input id="name" name="name" required placeholder="John Doe" className="rounded-xl bg-muted/50" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
            <Input id="email" name="email" type="email" required placeholder="john@example.com" className="rounded-xl bg-muted/50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" className="rounded-xl bg-muted/50" />
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold h-12">
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Confirm Integration
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
