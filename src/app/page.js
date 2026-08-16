import Banner from "@/components/Banner";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedArtworks from "@/components/FeaturedArtworks";
import TopArtists from "@/components/TopArtists";

export default function Home() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans space-y-20 pb-20">
      <Banner />
      <CategoriesSection />
      <FeaturedArtworks />
      <TopArtists />
    </div>
  );
}
