"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, User, Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
  id: string | number;
  href: string;
  tile: string;
}

export function AnimatedNavigationTabs({ items }: { items: Props[] }) {
  const [isHover, setIsHover] = useState<Props | null>(null);
  const pathname = usePathname();
  const { data: session, update } = useSession();
  
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState({ organizedTrips: 0, joinedTrips: 0 });

  useEffect(() => {
    if (session?.user) {
      setBio(session.user.bio || "");
      setCountry(session.user.country || "");
      
      // Fetch stats
      fetch("/api/user/stats")
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setStats({
              organizedTrips: data.organizedTrips || 0,
              joinedTrips: data.joinedTrips || 0
            });
          }
        })
        .catch(err => console.error("Failed to fetch stats", err));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/onboarding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, country }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      await update({ bio, country }); // Trigger session refresh
      toast.success("Profile updated successfully!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <nav className="relative w-full flex items-center justify-between px-8 py-6">
      {session?.user ? (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button className="font-semibold text-xl tracking-tight glass p-2 px-6 rounded-2xl text-foreground/80 hover:bg-foreground/5 transition-colors cursor-pointer outline-none flex items-center gap-2">
              <User className="h-5 w-5" /> TripBuddy
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-5 mt-2 rounded-xl glass border-muted/50 shadow-2xl relative left-4">
            <div className="flex flex-col space-y-4">
              <div className="space-y-1 pb-4 border-b border-muted">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg leading-tight">{session.user.name}</h4>
                    <p className="text-sm text-muted-foreground">{session.user.email}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => signOut({ callbackUrl: '/auth/login' })} 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1"
                    title="Log out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <div className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {session.user.role}
                  </div>
                </div>

                <div className={cn(
                  "grid gap-3 mt-4 pt-4 border-t border-muted/50",
                  session.user.role === "ORGANIZER" ? "grid-cols-2" : "grid-cols-1"
                )}>
                  {session.user.role === "ORGANIZER" && (
                    <div className="flex flex-col items-center justify-center p-3 glass bg-muted/20 rounded-xl">
                      <span className="text-2xl font-bold bg-clip-text text-foreground">
                        {stats.organizedTrips}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mt-1">
                        Organized
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col items-center justify-center p-3 glass bg-muted/20 rounded-xl">
                    <span className="text-2xl font-bold bg-clip-text text-foreground">
                      {stats.joinedTrips}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mt-1">
                      Joined
                    </span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="resize-none min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country"
                    placeholder="Where are you from?"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={!!session?.user?.country}
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Profile
                </Button>
              </form>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Link 
          href="/auth/login"
          className="font-semibold text-xl tracking-tight glass p-2 px-6 rounded-2xl text-foreground/80 hover:bg-foreground/5 transition-colors flex items-center gap-2"
        >
          <User className="h-5 w-5" /> TripBuddy
        </Link>
      )}

      <div className="relative glass p-1 rounded-3xl">
        <ul className="flex items-center justify-center">
          {items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href === "/home" ? "/" : item.href}
                className={cn(
                  "relative p-0.5 transition-colors duration-300",
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onMouseEnter={() => setIsHover(item)}
                onMouseLeave={() => setIsHover(null)}
              >
                <div className="px-5 py-2 relative">
                  <span className="relative z-10">{item.tile}</span>

                  {(isHover?.id === item.id || isActive) && (
                    <motion.div
                      layoutId="nav-bg"
                      className="absolute inset-0 bg-muted"
                      style={{ borderRadius: 20 }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </ul>
      </div>

      <div className="flex items-center gap-4">
        <Button asChild className="flex items-center gap-3 glass px-2 py-1 rounded-full h-14 bg-transparent hover:bg-foreground/5 text-foreground border-none shadow-none">
          <Link href="/create-trip" className="flex items-center">
            <span className="px-3 text-foreground/80 whitespace-nowrap">
              Make Your Trip
            </span>

            <span className="flex items-center justify-center h-10 w-10 bg-primary rounded-full transition-transform hover:scale-110">
              <ArrowUpRight className="h-5 w-5 text-primary-foreground" />
            </span>
          </Link>
        </Button>
      </div>
    </nav>
  );
}
