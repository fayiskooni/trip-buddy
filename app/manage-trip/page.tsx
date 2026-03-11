import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { CalendarIcon, MapPin, Users, Plus, Edit } from "lucide-react";
import Image from "next/image";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import AnimatedNavigationTabsDemo from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { getTripColor } from "@/lib/constants";
import { format } from "date-fns";

export default async function ManageTripsDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    redirect("/auth/login?callbackUrl=/manage-trip");
  }

  const userId = parseInt(session.user.id);

  // Security: Check role or organized trips
  const trips = await prisma.trip.findMany({
    where: { organizerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
      _count: {
        select: { members: true }
      }
    }
  });

  return (
    <div className="min-h-screen bg-background relative md:pb-24">
      <AnimatedNavigationTabsDemo />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="min-w-0">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 truncate md:whitespace-normal">Your Organized Trips</h1>
            <p className="text-xl text-muted-foreground max-w-2xl font-medium">
              Select a trip below to manage its details and participants.
            </p>
          </div>
          <Button asChild className="h-12 px-6 rounded-xl font-semibold shrink-0">
            <Link href="/create-trip">
              <Plus className="mr-2 h-5 w-5" /> Host New Trip
            </Link>
          </Button>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-[2rem] border border-muted/50 shadow-sm">
            <h3 className="text-2xl font-bold mb-2">No trips hosted yet</h3>
            <p className="text-muted-foreground mb-6">You haven't organized any adventures.</p>
            <Button asChild className="rounded-xl px-8 h-12 bg-[#0ea5e9] hover:bg-[#0284c7] text-white">
              <Link href="/create-trip">Start Hosting</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-card rounded-[1.5rem] border border-muted shadow-sm p-4 md:p-6 grid grid-cols-1 md:grid-cols-[12rem_1fr_auto] gap-6 items-center hover:border-border transition-colors">
                <div className="relative w-full h-48 md:h-32 rounded-xl overflow-hidden shadow-sm">
                  {trip.images[0]?.imageUrl ? (
                    <Image 
                      src={trip.images[0].imageUrl} 
                      alt={trip.title} 
                      fill 
                      className="object-cover" 
                      unoptimized 
                    />
                  ) : (
                    <div className="w-full h-full" style={{ backgroundColor: getTripColor(trip.id) || getTripColor(trip.title) }} />
                  )}
                  <div className="absolute inset-0 bg-black/10" />
                </div>
                
                <div className="min-w-0 w-full">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-2">
                    <div className="min-w-0">
                      <span className="inline-block px-2.5 py-0.5 bg-muted text-muted-foreground rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                        {trip.category}
                      </span>
                      <h3 className="text-xl font-bold line-clamp-1">{trip.title}</h3>
                    </div>
                    
                    <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-blue-50/80 text-blue-700 rounded-full text-xs font-bold w-fit border border-blue-100/50">
                      <Users className="h-4 w-4" />
                      <span>{trip._count.members} / {trip.maxParticipants} Joined</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mt-4">
                    <span className="flex items-center min-w-0">
                      <MapPin className="h-4 w-4 mr-1.5 shrink-0 text-[#0ea5e9]" />
                      <span className="truncate max-w-[200px]">{trip.destination}</span>
                    </span>
                    <span className="flex items-center shrink-0">
                      <CalendarIcon className="h-4 w-4 mr-1.5 shrink-0 text-[#0ea5e9]" />
                      {format(new Date(trip.startDate), "MMM d")} - {format(new Date(trip.endDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>

                <div className="w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-muted md:pl-6 shrink-0 flex items-center justify-end">
                  <Button asChild className="w-full md:w-auto h-12 px-8 rounded-xl font-bold bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-sm">
                    <Link href={`/manage-trip/${trip.id}`}>
                      Dashboard <Edit className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
