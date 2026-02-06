import ExpandOnHover from "@/components/ui/expand-cards";
import Description from "../components/description";
import HeroPage from "../components/hero-page";
import { HEADERS } from "../constants";

export const HomeView = () => {
  return (
    <>
      <HeroPage />
      <Description {...HEADERS.SmartPlanning} />
      <ExpandOnHover />
      <Description {...HEADERS.OpenAdventures} />
      <Description {...HEADERS.SharedExperiences} />
      <Description {...HEADERS.FocusedDestinations} />
      <Description {...HEADERS.TravelCommunity} />
    </>
  );
};
