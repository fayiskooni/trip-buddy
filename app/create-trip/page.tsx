"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Loader2, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getTripColor } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { useSession } from "next-auth/react";

export default function CreateTrip() {
  const router = useRouter();
  const { update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination: "",
    category: "",
    tripType: "FREE",
    pricePerPerson: "",
    maxParticipants: "",
    imageUrl: "",
  });

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [hasPhone, setHasPhone] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");

  useEffect(() => {
    // Check if user already has a phone number
    const checkProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.phone) {
            setHasPhone(true);
            setPhone(data.phone);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    checkProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // Clear manual URL if they select a file
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates.");
      return;
    }

    if (formData.tripType === "PAID" && !formData.pricePerPerson) {
      toast.error("Please enter a price for this paid trip.");
      return;
    }

    if (!hasPhone && (!phone.trim() || !countryCode.trim())) {
      toast.error("Please provide a valid country code and phone number.");
      return;
    }

    const fullPhone = !hasPhone ? `${countryCode.trim()} ${phone.trim()}` : undefined;

    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.imageUrl;

      // 1. Upload image if a file was selected
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadResult = await uploadRes.json();
        finalImageUrl = uploadResult.imageUrl;
      }

      // 2. Create the trip (and simultaneously update phone if missing)
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl: finalImageUrl,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          phone: fullPhone, // passing phone if it's new
        }),
      });

      if (!res.ok) throw new Error("Failed to create trip");
      
      const data = await res.json();
      
      // Force NextAuth to refresh the session token to pull the new ORGANIZER role
      await update({ role: data.updatedUser?.role || "ORGANIZER" });
      
      toast.success("Trip created successfully!");
      router.push("/packages");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create trip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] -z-10 -translate-x-1/3 translate-y-1/3 mix-blend-screen" />

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form Side */}
          <div className="col-span-1 lg:col-span-7 space-y-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">Host an Experience</h1>
              <p className="text-lg text-muted-foreground">Start organizing your next unforgettable adventure. Fill in the details below to publish.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 glass p-8 rounded-3xl border border-muted/50">
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base">Trip Title <span className="text-destructive">*</span></Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. Hiking the Swiss Alps" 
                    className="h-12 text-base px-4 bg-background/50" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base">Description <span className="text-destructive">*</span></Label>
                  <Textarea 
                    id="description" 
                    placeholder="What will you do? What's the vibe?" 
                    className="min-h-[140px] text-base px-4 py-3 resize-none bg-background/50" 
                    value={formData.description} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="destination" className="text-base">Destination <span className="text-destructive">*</span></Label>
                    <Input id="destination" placeholder="City, Country" className="h-12 bg-background/50" value={formData.destination} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">Travel Style <span className="text-destructive">*</span></Label>
                    <Select value={formData.category} onValueChange={(val) => handleSelectChange(val, "category")}>
                      <SelectTrigger className="h-12 bg-background/50">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LEISURE TRAVEL">Leisure Travel</SelectItem>
                        <SelectItem value="EDUCATIONAL TRAVEL">Educational Travel</SelectItem>
                        <SelectItem value="ADVENTURE / BACKPACKING">Adventure / Backpacking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-base">Start Date <span className="text-destructive">*</span></Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-12 justify-start text-left font-normal bg-background/50",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-muted" align="start">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">End Date <span className="text-destructive">*</span></Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-12 justify-start text-left font-normal bg-background/50",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-muted" align="start">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants" className="text-base">Max Participants <span className="text-destructive">*</span></Label>
                    <Input id="maxParticipants" type="number" min="1" placeholder="e.g. 10" className="h-12 bg-background/50" value={formData.maxParticipants} onChange={handleChange} required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-base">Listing Type <span className="text-destructive">*</span></Label>
                    <Select value={formData.tripType} onValueChange={(val) => handleSelectChange(val, "tripType")}>
                      <SelectTrigger className="h-12 bg-background/50">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FREE">Free Joining</SelectItem>
                        <SelectItem value="PAID">Paid Entry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.tripType === "PAID" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    className="space-y-2"
                  >
                    <Label htmlFor="pricePerPerson" className="text-base">Price Per Person (INR) <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                      <Input 
                        id="pricePerPerson" 
                        type="number" 
                        min="0"
                        step="0.01"
                        placeholder="0.00" 
                        className="h-12 pl-8 bg-background/50" 
                        value={formData.pricePerPerson} 
                        onChange={handleChange} 
                        required={formData.tripType === "PAID"}
                      />
                    </div>
                  </motion.div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageFile" className="text-base">Upload Cover Image</Label>
                    <Input 
                      id="imageFile" 
                      type="file" 
                      accept="image/*"
                      className="h-12 bg-background/50 cursor-pointer pt-3 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                      onChange={handleFileChange} 
                    />
                  </div>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-muted"></div>
                    <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs font-medium uppercase tracking-wider">Or provide a link</span>
                    <div className="flex-grow border-t border-muted"></div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-base">Cover Image URL</Label>
                    <Input 
                      id="imageUrl" 
                      type="url" 
                      placeholder="https://images.unsplash.com/photo-1234.jpg" 
                      className="h-12 bg-background/50" 
                      value={formData.imageUrl} 
                      onChange={handleChange}
                      disabled={!!imageFile} 
                    />
                    <p className="text-xs text-muted-foreground mt-2 inline-block">Must be a direct link to an image file (e.g. ending in .jpg or .png).</p>
                  </div>
                </div>

                {!hasPhone && (
                  <div className="space-y-4 pt-4 border-t border-muted">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base text-blue-500 font-semibold gap-2 flex items-center">
                        Contact Information Required
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        As a host, you need to provide a contact number so members can reach you for coordination. This will be saved to your profile.
                      </p>
                      <div className="flex gap-3">
                        <div className="w-[80px]">
                          <Input
                            id="countryCode"
                            placeholder="+91"
                            className="h-12 text-center bg-background/50"
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                          />
                        </div>
                        <div className="relative flex-1">
                          <Input
                            id="phone"
                            placeholder="5550123456"
                            className="h-12 bg-background/50"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required={!hasPhone}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-base font-semibold rounded-xl">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Trip"
                )}
              </Button>
            </form>
          </div>

          {/* Visual Side */}
          <div className="col-span-1 lg:col-span-5 hidden lg:block sticky top-8">
            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-2xl glass p-1.5 border border-muted/30">
              <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden bg-muted">
                {(imagePreview || formData.imageUrl) ? (
                  <Image
                    src={imagePreview || formData.imageUrl}
                    alt="Trip Cover Preview"
                    fill
                    className="object-cover transition-opacity duration-500 grayscale opacity-90"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full grayscale opacity-90" style={{ backgroundColor: getTripColor(formData.title || "preview") }} />
                )}
                
                {/* Live Preview Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-24 text-white">
                  <div className="inline-block px-4 py-1.5 bg-white/30 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3 text-white">
                    {formData.category || "CATEGORY"}
                  </div>
                  <h2 className="text-4xl font-extrabold leading-tight line-clamp-2 mb-1">
                    {formData.title || "trip title"}
                  </h2>
                  <p className="text-white/80 flex items-center text-base font-medium">
                    {formData.destination || "Destination"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 glass rounded-2xl border border-muted/50">
              <h3 className="font-semibold text-lg flex items-center mb-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 text-sm">💡</span>
                Hosting Tip
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                High-quality photos significantly increase booking rates. Use clear, bright images that accurately represent the destination's vibe. Keep your descriptions punchy and honest!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
