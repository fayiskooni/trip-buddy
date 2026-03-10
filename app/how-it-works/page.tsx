import { getServerSession } from "next-auth/next";
import { Compass, CheckCircle2, Users, MapPin, Edit3, ShieldCheck, Ticket } from "lucide-react";
import AnimatedNavigationTabsDemo from "@/components/navbar";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function HowItWorksPage() {
  const session = await getServerSession(authOptions);
  
  // Default to TRAVELER if no session
  const isOrganizer = session?.user?.role === "ORGANIZER";

  return (
    <div className="min-h-screen bg-background relative md:pb-24">
      <AnimatedNavigationTabsDemo />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">How TripBuddy Works</h1>
          <p className="text-xl text-muted-foreground w-full max-w-2xl mx-auto">
            Your step-by-step guide to navigating the platform and making the most out of your upcoming journeys.
          </p>
        </div>

        {/* Universal Traveler Instructions */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-muted">
            <Compass className="h-8 w-8 text-blue-500" />
            <h2 className="text-3xl font-bold">For Travelers: Joining A Trip</h2>
          </div>
          
          <div className="grid gap-6">
            <div className="bg-card p-6 md:p-8 rounded-[2rem] border border-muted shadow-sm flex gap-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                  Discover Your Adventure
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Navigate to the <strong className="text-foreground">Packages</strong> menu item at the top of the screen. Here, you will find a curated grid of active trips ranging from Leisure and Education to Adventure/Backpacking. Click <strong className="text-foreground">View Trip</strong> on any package that catches your eye.
                </p>
              </div>
            </div>

            <div className="bg-card p-6 md:p-8 rounded-[2rem] border border-muted shadow-sm flex gap-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <Ticket className="h-5 w-5 mr-2 text-muted-foreground" />
                  Review & Join
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  On the Trip Details page, you can read the description and verify dates. Once you're ready, simply click the prominent <strong className="text-[#0ea5e9]">Join Trip</strong> button on the right sidebar to secure your spot instantly.
                </p>
              </div>
            </div>

            <div className="bg-card p-6 md:p-8 rounded-[2rem] border border-muted shadow-sm flex gap-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  Connect with the Host
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  After joining, the system securely unlocks the Host's direct contact information (Email and Phone). Reach out to coordinate final arrangements!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Organizer-Specific Instructions */}
        {isOrganizer && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-emerald-500/20">
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
              <h2 className="text-3xl font-bold">For Organizers: Managing A Trip</h2>
            </div>
            
            <div className="grid gap-6">
              <div className="bg-emerald-500/5 p-6 md:p-8 rounded-[2rem] border border-emerald-500/20 flex gap-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                  <Edit3 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Creating an Experience
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Whenever you host a new trip using the <strong className="text-foreground">Host a Trip</strong> button, the platform automatically upgrades you to an Organizer. You can outline your itinerary, set capacity limits, and pick whether the experience is Free or Paid.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-500/5 p-6 md:p-8 rounded-[2rem] border border-emerald-500/20 flex gap-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Accessing the Management Dashboard
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    View any trip you own to access the <strong className="text-emerald-600">Manage Trip Panel</strong>. This dedicated dashboard gives you complete oversight of your expedition's roster.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-500/5 p-6 md:p-8 rounded-[2rem] border border-emerald-500/20 flex gap-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-emerald-600 font-bold text-xl">★</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">
                    Power Features Overview
                  </h3>
                  <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc list-inside">
                    <li><strong className="text-foreground">Track Participants:</strong> See exactly who has joined, including their direct email and phone number for logistics.</li>
                    <li><strong className="text-foreground">Remove Members:</strong> If someone drops out or a spot needs clearing, use the red <strong className="text-destructive">Remove</strong> button next to their name.</li>
                    <li><strong className="text-foreground">Add Guests Manually:</strong> Utilizing the <strong className="text-[#0ea5e9]">Add Manually</strong> button, you can instantly inject off-platform friends or clients straight into your TripBuddy roster by providing their Name and Email. The system will create guest accounts for them automatically.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
