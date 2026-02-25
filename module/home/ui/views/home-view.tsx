import ExpandOnHover from "@/components/features/expand-cards";
import Description from "../components/description";
import HeroPage from "../components/hero-page";
import { HEADERS } from "../constants";
import { TravelStyle } from "@/components/features/Travel-Style";
import ImageSphere from "@/components/features/image-sphere";
import { Footer } from "@/components/footer";
import ShutterSection from "@/components/features/shutter-section";

export const HomeView = () => {
  return (
    <>
      <HeroPage />
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Description {...HEADERS.SmartPlanning} />
        <ExpandOnHover />
      </div>
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Description {...HEADERS.OpenAdventures} />
        <TravelStyle />
      </div>
      <ShutterSection 
        top={
          <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background relative z-20">
            <Description {...HEADERS.SharedExperiences} />
            <div className="w-full flex justify-center items-center">
              <ImageSphere />
            </div>
          </div>
        } 
        bottom={<Footer />} 
      />
      
    </>
  );
};
