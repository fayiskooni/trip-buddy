# TripBuddy

A web platform for organizing and joining group trips. 
Organizers list trips, travelers discover and book them.

🔗 **Live:** (add your deployed URL here)

---

## Features

- Trip discovery with category and destination filtering
- Trip creation and management for organizers
- Booking system for both free and paid trips
- Built-in messaging between travelers and organizers
- Trip galleries to showcase destinations
- Save trips for later
- Multi-role system: Traveler, Organizer, Admin

## Tech Stack

**Frontend:** Next.js 15, React 19, Tailwind CSS, Radix UI, 
GSAP, Framer Motion

**Backend:** Node.js, PostgreSQL, Prisma ORM

**Auth:** NextAuth.js with JWT strategy

**Forms:** React Hook Form, Zod

## Run Locally
```bash
git clone https://github.com/fayiskooni/trip-buddy.git
cd trip-buddy
npm install

# Add .env file with:
# DATABASE_URL=
# NEXTAUTH_SECRET=

npx prisma generate
npx prisma db push
npm run dev
```
