"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Users, Plus } from "lucide-react";

import AnimatedNavigationTabsDemo from "@/components/navbar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Trip {
  id: string;
  title: string;
  description: string;
  destination: string;
  category: string;
  tripType: "FREE" | "PAID";
  pricePerPerson: number | null;
  currency: string;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  organizer: {
    name: string;
    image: string | null;
  };
  joinedCount: number;
  coverImage: string;
}

export default function PackagesPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trips")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setTrips(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Background flourishes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] -z-10 -translate-x-1/3 translate-y-1/3 mix-blend-screen" />

      <AnimatedNavigationTabsDemo />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Discover Packages</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Explore hand-crafted journeys created by our community. Join an adventure or host your own.
            </p>
          </div>
          <Button asChild className="h-12 px-6 rounded-xl font-semibold shrink-0">
            <Link href="/create-trip">
              <Plus className="mr-2 h-5 w-5" /> Host a Trip
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="h-[450px] rounded-3xl bg-muted/30 animate-pulse glass" />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-24 glass rounded-3xl border border-muted/50">
            <h3 className="text-2xl font-bold mb-2">No trips available yet</h3>
            <p className="text-muted-foreground mb-6">Be the first to create an amazing adventure!</p>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/create-trip">Create a Trip</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <Card key={trip.id} className="group overflow-hidden rounded-[2rem] border-muted/50 glass p-1.5 hover:shadow-xl transition-all duration-500 flex flex-col h-full bg-background/40">
                <div className="relative h-72 w-full rounded-[1.8rem] overflow-hidden bg-muted">
                  <Image
                    src={trip.coverImage || `https://loremflickr.com/800/1000/${encodeURIComponent(trip.destination || trip.title || 'travel')}`}
                    alt={trip.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale opacity-90"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  {/* Bottom Image Overlay Text */}
                  <div className="absolute bottom-6 left-6 right-6">
                     <div className="inline-block px-3 py-1 bg-white/30 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-2 text-white">
                      {trip.category}
                    </div>
                    <h3 className="text-3xl font-extrabold text-white leading-tight mb-1 line-clamp-2">
                      {trip.title}
                    </h3>
                    <div className="flex items-center text-white/80 text-base font-medium">
                      <span className="truncate">{trip.destination}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 flex-grow flex flex-col">
                  {/* Host Info */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-muted/50">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0 relative">
                      {trip.organizer.image ? (
                        <Image src={trip.organizer.image} alt={trip.organizer.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {trip.organizer.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Hosted by</p>
                      <p className="text-sm font-semibold">{trip.organizer.name}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-2 mb-4 text-sm font-medium text-foreground/80">
                    <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
                    <span>
                      {format(new Date(trip.startDate), "MMM d")} - {format(new Date(trip.endDate), "MMM d, yyyy")}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                    {trip.description}
                  </p>
                </CardContent>

                <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-transparent">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                      {trip.tripType === "FREE" ? "Entry" : "Price"}
                    </span>
                    {trip.tripType === "FREE" ? (
                      <span className="text-2xl font-bold text-emerald-500">Free</span>
                    ) : (
                      <span className="text-2xl font-bold text-foreground flex items-center">
                        <span className="text-lg mr-1 text-muted-foreground">₹</span>
                        {trip.pricePerPerson?.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <Button className="rounded-xl px-6 font-semibold shadow-md active:scale-95 transition-transform">
                    View Trip
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
