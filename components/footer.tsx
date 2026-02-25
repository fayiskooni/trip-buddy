import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowRight, Instagram, Twitter, Linkedin, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full min-h-screen bg-black text-white pt-20 pb-10 px-6 overflow-hidden flex flex-col justify-end">
      <div className="max-w-7xl mx-auto flex flex-col gap-16 w-full">
        {/* Top Section: CTA & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Ready to plan your next great adventure?
            </h2>
            <p className="text-white/60 text-lg max-w-md">
              Join thousands of travelers who use TripBuddy to uncomplicate their amazing journeys.
            </p>
            <div className="flex gap-4 items-center">
              <Button asChild size="lg" className="rounded-full bg-white text-black hover:bg-white/90 h-14 px-8 font-medium">
                <Link href="/create-trip">Make Your Trip <ArrowRight className="ml-2 size-4" /></Link>
              </Button>
            </div>
          </div>
        </div>

        <hr className="border-white/10" />

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <span className="font-bold text-2xl tracking-tight">TripBuddy</span>
            <p className="text-white/50 text-sm mt-2 max-w-xs">
              The smartest way to organize your itineraries, discover destinations, and build memories with friends.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white/90">Platform</h4>
            <Link href="/features" className="text-white/50 hover:text-white transition-colors text-sm">Features</Link>
            <Link href="/packages" className="text-white/50 hover:text-white transition-colors text-sm">Packages</Link>
            <Link href="/gallery" className="text-white/50 hover:text-white transition-colors text-sm">Gallery</Link>
            <Link href="/how-it-works" className="text-white/50 hover:text-white transition-colors text-sm">How it works</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white/90">Company</h4>
            <Link href="/about" className="text-white/50 hover:text-white transition-colors text-sm">About Us</Link>
            <Link href="/careers" className="text-white/50 hover:text-white transition-colors text-sm">Careers</Link>
            <Link href="/contact" className="text-white/50 hover:text-white transition-colors text-sm">Contact</Link>
            <Link href="/blog" className="text-white/50 hover:text-white transition-colors text-sm">Blog</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white/90">Legal</h4>
            <Link href="/privacy" className="text-white/50 hover:text-white transition-colors text-sm">Privacy Policy</Link>
            <Link href="/terms" className="text-white/50 hover:text-white transition-colors text-sm">Terms of Service</Link>
            <Link href="/cookie" className="text-white/50 hover:text-white transition-colors text-sm">Cookie Policy</Link>
          </div>
        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-white/10">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} TripBuddy Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white/40 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
              <Twitter className="size-4" />
            </a>
            <a href="#" className="text-white/40 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
              <Instagram className="size-4" />
            </a>
            <a href="#" className="text-white/40 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
              <Linkedin className="size-4" />
            </a>
            <a href="#" className="text-white/40 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
              <Github className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
