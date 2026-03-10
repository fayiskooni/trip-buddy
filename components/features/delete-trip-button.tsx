"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteTripButtonProps {
  tripId: number;
}

export function DeleteTripButton({ tripId }: DeleteTripButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete trip");
      
      toast.success("Trip deleted successfully!");
      setIsOpen(false);
      
      // Redirect to the manage-trip hub after successful deletion
      router.push("/manage-trip");
      router.refresh(); // Crucial to update the list
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete trip. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="font-semibold rounded-xl ml-2 hover:bg-red-600 transition-colors">
          <Trash2 className="mr-2 h-4 w-4" /> Delete Trip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6 rounded-[2rem] border-destructive/20 shadow-xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-6 w-6" /> Delete Trip
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground mt-4">
            Are you completely sure you want to delete this trip? This action cannot be undone. All participant records and data related to this trip will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="pt-6 flex justify-end gap-3 border-t border-muted/50 mt-4">
          <Button 
            variant="ghost" 
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
            className="rounded-xl font-semibold hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl px-8 font-bold"
          >
            {isDeleting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting</>
            ) : "Confirm Deletion"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
