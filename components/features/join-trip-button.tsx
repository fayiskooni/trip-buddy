"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JoinTripButtonProps {
  tripId: number;
}

export function JoinTripButton({ tripId }: JoinTripButtonProps) {
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneInput, setPhoneInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user has a phone number when component mounts
    const checkProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.phone) {
            setHasPhone(true);
          }
        }
      } catch (error) {
        console.error("Failed to check profile", error);
      }
    };
    checkProfile();
  }, []);

  const executeJoin = async () => {
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

  const handleJoinClick = async () => {
    if (hasPhone) {
      executeJoin();
      return;
    }

    // Double check just in case the initial fetch failed or hasn't finished
    setCheckingProfile(true);
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.phone) {
          setHasPhone(true);
          setCheckingProfile(false);
          executeJoin();
          return;
        }
      }
    } catch (error) {
      console.error(error);
    }
    setCheckingProfile(false);
    setShowPhoneModal(true); // Show modal if definitely no phone
  };

  const handleSavePhoneAndJoin = async () => {
    if (!phoneInput.trim() || !countryCode.trim()) {
      toast.error("Please enter a valid country code and phone number.");
      return;
    }

    const fullPhone = `${countryCode.trim()} ${phoneInput.trim()}`;

    setLoading(true);
    try {
      // 1. Save Phone Number
      const updateRes = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      });

      if (!updateRes.ok) {
        throw new Error("Failed to save phone number");
      }

      setHasPhone(true);
      setShowPhoneModal(false);
      
      // 2. Execute Join
      executeJoin();
    } catch (error) {
      toast.error("Failed to save contact information.");
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleJoinClick} 
        disabled={loading || checkingProfile}
        className="w-full sm:w-auto px-8 py-6 rounded-2xl bg-blue-500 hover:bg-blue-600 font-bold text-lg shadow-xl shadow-blue-500/20 transition-all active:scale-95"
      >
        {(loading || checkingProfile) && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        Join Trip
      </Button>

      <Dialog open={showPhoneModal} onOpenChange={setShowPhoneModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact Information Required</DialogTitle>
            <DialogDescription>
              To ensure hosts can coordinate with you, please provide your phone number before joining this trip. This will be saved to your profile for future use.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
              <div className="flex gap-3">
                <div className="w-[80px]">
                  <Input
                    id="countryCode"
                    placeholder="+91"
                    className="h-12 text-center"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                  />
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="5550123456"
                    className="pl-9 h-12"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPhoneModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSavePhoneAndJoin} disabled={loading || !phoneInput.trim()} className="bg-blue-500 hover:bg-blue-600 font-semibold px-6">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save & Join
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
