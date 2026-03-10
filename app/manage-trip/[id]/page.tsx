import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { ArrowLeft, Users, ShieldCheck, UserMinus, Plus, Mail, Phone } from "lucide-react";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import AnimatedNavigationTabsDemo from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { RemoveMemberButton } from "@/components/features/remove-member-button";
import { AddMemberModal } from "@/components/features/add-member-modal";
import { EditTripModal } from "@/components/features/edit-trip-modal";
import { DeleteTripButton } from "@/components/features/delete-trip-button";

export default async function ManageTripPage({ params }: { params: any }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;
  const tripId = parseInt(id);
  const userId = parseInt(session.user.id);

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      images: true,
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            }
          }
        },
        orderBy: { joinedAt: "desc" }
      },
      _count: {
        select: { members: true }
      }
    }
  });

  if (!trip) notFound();
  
  // Security check: Only organizer can view this page
  if (trip.organizerId !== userId) {
    redirect(`/trips/${tripId}`);
  }

  return (
    <div className="min-h-screen bg-background relative md:pb-24">
      <AnimatedNavigationTabsDemo />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <Link href="/packages" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Packages
        </Link>

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-muted pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                Organizer Dashboard
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                Trip ID: #{trip.id}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Manage Trip</h1>
            <p className="text-xl text-muted-foreground max-w-2xl font-medium mb-6">
              {trip.title}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <EditTripModal 
                tripId={trip.id} 
                currentTitle={trip.title} 
                currentDescription={trip.description} 
                currentMaxParticipants={trip.maxParticipants} 
                currentImageUrl={trip.images?.[0]?.imageUrl}
              />
              <DeleteTripButton tripId={trip.id} />
            </div>
          </div>
          
          <div className="flex flex-col items-end shrink-0 bg-muted/30 p-4 rounded-2xl border border-muted/50">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Participants</span>
            <span className="text-3xl font-extrabold text-foreground flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-500" />
              {trip._count.members} <span className="text-muted-foreground text-xl mx-2">/</span> {trip.maxParticipants}
            </span>
          </div>
        </div>

        {/* Member Management */}
        <div className="bg-card rounded-[2rem] border border-muted shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Trip Roster</h2>
              <p className="text-muted-foreground text-sm">View and manage the travelers who have joined this trip.</p>
            </div>
            {/* Add Member Manually Form Component */}
            <AddMemberModal tripId={trip.id} maxParticipants={trip.maxParticipants} currentCount={trip._count.members} />
          </div>

          <div className="p-0">
            {trip.members.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-bold mb-2">No Travelers Yet</h3>
                <p className="text-muted-foreground">When people join your trip, they will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-muted">
                {trip.members.map((member) => (
                  <div key={member.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0 uppercase">
                        {member.user.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-lg leading-tight mb-1">{member.user.name || "Unknown Traveler"}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          {member.user.email && (
                            <span className="flex items-center">
                              <Mail className="h-3.5 w-3.5 mr-1.5" /> {member.user.email}
                            </span>
                          )}
                          {member.user.phone && (
                            <span className="flex items-center">
                              <Phone className="h-3.5 w-3.5 mr-1.5" /> {member.user.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-wider">
                        Joined
                      </span>
                      {/* Remove Button Component */}
                      <RemoveMemberButton tripId={trip.id} userId={member.userId} memberName={member.user.name || "Traveler"} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
