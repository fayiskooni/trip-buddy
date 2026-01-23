'use client'

import { useRouter } from "next/navigation";

const Home = () => {
    const router = useRouter()
    router.replace("/login")
    return
}
 
export default Home;