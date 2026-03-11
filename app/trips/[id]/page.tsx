import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Users, Mail, Phone, ArrowLeft, ShieldCheck } from "lucide-react";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getTripColor } from "@/lib/constants";
import AnimatedNavigationTabsDemo from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { JoinTripButton } from "@/components/features/join-trip-button";

export default async function TripDetailsPage({ params }: { params: any }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/auth/login?callbackUrl=/trips/${params.id}`);
  
  const { id } = await params;
  const tripId = parseInt(id);
  const userId = parseInt(session.user.id);

  // Fetch trip with organizer and membership status of current user
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      images: true,
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true,
        }
      },
      members: {
        where: { userId }, // Only fetch if the current user is a member
      },
      _count: {
        select: { members: true }
      }
    }
  });

  if (!trip) notFound();

  const isOrganizer = trip.organizerId === userId;
  const isJoined = trip.members.length > 0;
  const coverImage = trip.images[0]?.imageUrl || null;
  const isFull = trip._count.members >= trip.maxParticipants;

  return (
    <div className="min-h-screen bg-background relative md:pb-24">
      <AnimatedNavigationTabsDemo />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <Link href="/packages" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Packages
        </Link>

        {/* Hero Image Section */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={trip.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: getTripColor(trip.id) || getTripColor(trip.title) }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute top-6 left-6 flex gap-2">
            <div className="px-4 py-1.5 bg-white/30 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm border border-white/10">
              {trip.category}
            </div>
            {trip.tripType === "FREE" && (
              <div className="px-4 py-1.5 bg-emerald-500/80 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm border border-emerald-400/20">
                Free Entry
              </div>
            )}
          </div>

          <div className="absolute bottom-8 left-8 right-8">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-2 drop-shadow-md">
              {trip.title}
            </h1>
            <div className="flex items-center text-white/90 text-lg md:text-xl font-medium drop-shadow">
              <MapPin className="h-5 w-5 mr-1.5" />
              {trip.destination}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Info */}
          <div className="lg:col-span-2 space-y-10">
            
            <section>
              <h2 className="text-2xl font-bold mb-4">About the Trip</h2>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {trip.description}
              </p>
            </section>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-muted/50 border border-muted flex flex-col items-start">
                <CalendarIcon className="h-6 w-6 text-blue-500 mb-3" />
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Dates</span>
                <span className="font-semibold text-lg">
                  {format(new Date(trip.startDate), "MMM d")} - {format(new Date(trip.endDate), "MMM d, yyyy")}
                </span>
              </div>
              <div className="p-6 rounded-3xl bg-muted/50 border border-muted flex flex-col items-start">
                <Users className="h-6 w-6 text-blue-500 mb-3" />
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Availability</span>
                <span className="font-semibold text-lg">
                  {trip._count.members} / {trip.maxParticipants} Joined
                </span>
              </div>
            </div>

            {/* Organizer Block */}
            <section className="p-8 rounded-[2rem] border border-muted shadow-sm bg-card relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5 text-emerald-500" /> 
                Hosted by
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl shrink-0 overflow-hidden relative">
                  {trip.organizer.image ? (
                    <Image src={trip.organizer.image} alt={trip.organizer.name || "Organizer"} fill className="object-cover" />
                  ) : (
                    trip.organizer.name?.charAt(0).toUpperCase() || "O"
                  )}
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-1">{trip.organizer.name}</h4>
                  
                  {/* Contact Info (Only visible to joined members or the organizer) */}
                  {(isJoined || isOrganizer) ? (
                    <div className="space-y-2 mt-3 text-muted-foreground">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2" />
                        <a href={`mailto:${trip.organizer.email}`} className="hover:text-blue-500 transition-colors">
                          {trip.organizer.email}
                        </a>
                      </div>
                      {trip.organizer.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2" />
                          <a href={`tel:${trip.organizer.phone}`} className="hover:text-blue-500 transition-colors">
                            {trip.organizer.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-balance text-muted-foreground mt-2 max-w-sm">
                      Contact information is secured and will be shared with you once you join the trip.
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 p-6 rounded-[2rem] border border-muted shadow-xl bg-card">
              <h3 className="text-2xl font-bold mb-6 pb-6 border-b border-muted">
                {trip.tripType === "FREE" ? "Free Entry" : `₹${trip.pricePerPerson?.toLocaleString('en-IN')}`}
                {trip.tripType === "PAID" && <span className="text-sm font-normal text-muted-foreground ml-1">/ person</span>}
              </h3>
              
              {isOrganizer ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm font-medium flex items-start border border-blue-100 mb-4">
                    <ShieldCheck className="h-5 w-5 mr-2 shrink-0 text-blue-500" />
                    You are the organizer of this trip. You can manage members and details in your dashboard.
                  </div>
                  <Button asChild className="w-full px-8 py-6 rounded-2xl font-bold text-lg shadow-xl outline-none active:scale-95 transition-transform bg-[#0ea5e9] hover:bg-[#0284c7] text-white">
                    <Link href={`/manage-trip/${trip.id}`}>
                      Manage Trip Panel
                    </Link>
                  </Button>
                </div>
              ) : isJoined ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-medium flex items-start border border-emerald-100 mb-4">
                    <ShieldCheck className="h-5 w-5 mr-2 shrink-0 text-emerald-500" />
                    You're in! You have successfully joined this trip. Look at the host details to coordinate.
                  </div>
                  <Button disabled className="w-full px-8 py-6 rounded-2xl font-bold text-lg bg-emerald-500 hover:bg-emerald-500 opacity-100 text-white cursor-default">
                    Joined ✅
                  </Button>
                </div>
              ) : isFull ? (
                <div className="space-y-4">
                  <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm font-medium mb-4">
                    This trip has reached its maximum capacity of {trip.maxParticipants} participants.
                  </div>
                  <Button disabled className="w-full px-8 py-6 rounded-2xl font-bold text-lg">
                    Full
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-muted-foreground mb-4">
                    {trip.maxParticipants - trip._count.members} spots left! Join now to view host contact details and secure your place.
                  </p>
                  <JoinTripButton tripId={trip.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
