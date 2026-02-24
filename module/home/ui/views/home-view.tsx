import ExpandOnHover from "@/components/ui/expand-cards";
import Description from "../components/description";
import HeroPage from "../components/hero-page";
import { HEADERS } from "../constants";
import { TravelStyle } from "@/components/ui/Travel-Style";
import ImageSphere from "@/components/ui/image-sphere";

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
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Description {...HEADERS.SharedExperiences} />
        <div className="w-full flex justify-center items-center">
          <ImageSphere />
        </div>
      </div>
    </>
  );
};
