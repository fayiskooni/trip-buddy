"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Edit, AlertCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EditTripModalProps {
  tripId: number;
  currentTitle: string;
  currentDescription: string;
  currentMaxParticipants: number;
  currentImageUrl?: string | null;
}

export function EditTripModal({ 
  tripId, 
  currentTitle, 
  currentDescription, 
  currentMaxParticipants,
  currentImageUrl
}: EditTripModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: currentTitle,
    description: currentDescription,
    maxParticipants: currentMaxParticipants.toString(),
    imageUrl: currentImageUrl || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update trip");
      
      toast.success("Trip updated successfully!");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update trip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-semibold rounded-xl hover:bg-muted/50 transition-colors">
          <Edit className="mr-2 h-4 w-4" /> Edit Trip Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-6 rounded-[2rem]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold">Edit Trip</DialogTitle>
          <DialogDescription>
            Update the essential details for your trip. Changes are saved instantly.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">Trip Title</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={handleChange} 
              className="h-12 bg-muted/30"
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">Description</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={handleChange} 
              className="min-h-[120px] resize-none bg-muted/30"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-base font-semibold">Cover Image URL (Optional)</Label>
            <Input 
              id="imageUrl" 
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl} 
              onChange={handleChange} 
              className="h-12 bg-muted/30"
            />
            <p className="text-xs text-muted-foreground">Must be a direct link to an image file (ends in .jpg, .png, etc.). Webpage links will not work. Leave empty to use a random color.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants" className="text-base font-semibold text-destructive">Max Participants</Label>
            <div className="bg-destructive/10 p-3 rounded-xl flex items-start text-xs text-destructive mb-2">
              <AlertCircle className="h-4 w-4 mr-2 shrink-0" />
              <span>Lowering this below the current joined participants will not remove anyone, but it will prevent new participants from joining.</span>
            </div>
            <Input 
              id="maxParticipants" 
              type="number"
              min="1"
              value={formData.maxParticipants} 
              onChange={handleChange} 
              className="h-12 bg-muted/30"
              required 
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-muted">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              className="rounded-xl font-semibold"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="rounded-xl px-8 font-bold bg-[#0ea5e9] hover:bg-[#0284c7] text-white"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving</>
              ) : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
