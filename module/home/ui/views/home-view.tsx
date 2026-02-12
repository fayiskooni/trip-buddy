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
      <Description {...HEADERS.SmartPlanning} />
      <ExpandOnHover />
      <Description {...HEADERS.OpenAdventures} />
      <TravelStyle />
      <Description {...HEADERS.SharedExperiences} />
      <div className="w-full flex justify-center items-center">
        <ImageSphere />
      </div>
      <Description {...HEADERS.FocusedDestinations} />
      <Description {...HEADERS.TravelCommunity} />
    </>
  );
};
