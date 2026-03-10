import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { listingService } from '../services/listingService';
import ListingGrid from '../components/listings/ListingGrid';
import SearchBar from '../components/search/SearchBar';
import { Shield, Zap, Users, ArrowUpRight, Plus } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const [featuredListings, setFeaturedListings] = useState([]);
  const [distressListings, setDistressListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [regular, distress] = await Promise.all([
          listingService.getListings({ limit: 8 }),
          listingService.getListings({ is_distress: true, limit: 4 })
        ]);
        setFeaturedListings(regular);
        setDistressListings(distress);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="bg-[#f4f4f2] min-h-screen text-[#1a1a1a] selection:bg-yellow-300 overflow-x-hidden">
      
      {/* Hero Section - Optimized for Mobile Padding */}
      <section className="relative pt-12 pb-16 md:pt-24 md:pb-32 px-4 border-b-2 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black uppercase leading-[0.85] tracking-tighter">
              dealer to <br /> 
              <span className="text-outline-black text-transparent">dealer</span> <br /> 
              market.
            </h1>
            
            <p className="text-base md:text-xl max-w-md font-bold uppercase leading-tight border-l-4 border-black pl-4 my-4">
              The exclusive hub for Nigerian auto-dealers. High-velocity trading.
            </p>
          </div>

          {/* Search & CTA - Stacked on Mobile, Row on Desktop */}
          <div className="mt-8 flex flex-col md:flex-row gap-0 border-2 border-black bg-[#f4f4f2]">
            <div className="flex-grow border-b-2 md:border-b-0 md:border-r-2 border-black p-2">
              <SearchBar />
            </div>
            <Link 
              to={user ? "/add-listing" : "/register"} 
              className="bg-yellow-400 px-8 py-5 font-black uppercase flex items-center justify-center hover:bg-black hover:text-white transition-colors text-center"
            >
              {user ? "List Vehicle" : "Join the Club"}
              <Plus className="ml-2" size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* The Marquee - Speed adjusted for readability */}
      {(!loading && distressListings.length > 0) && (
        <section className="py-6 bg-black text-white overflow-hidden border-b-2 border-black">
          <div className="flex whitespace-nowrap animate-marquee">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i} className="text-3xl md:text-5xl font-black uppercase mx-4 italic flex items-center">
                
                Distress car sale
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Distress Feed Grid */}
      <section className="py-12 px-4 bg-[#f4f4f2]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Live Feed</h2>
            <Link to="/distress" className="font-black uppercase flex items-center border-b-2 border-black">
              View All <ArrowUpRight size={18} />
            </Link>
          </div>
          <ListingGrid listings={distressListings} loading={loading} />
        </div>
      </section>

      {/* Features - Mobile Friendly Stack */}
      <section className="px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-black">
          <FeatureCard 
            Icon={Shield} 
            title="Vetted Only" 
            text="Strict dealer verification. No joyriders." 
            color="hover:bg-yellow-400"
          />
          <FeatureCard 
            Icon={Zap} 
            title="Fast Chat" 
            text="Direct WhatsApp hooks. Pay per contact." 
            color="hover:bg-blue-400"
            border="border-y-2 md:border-y-0 md:border-x-2"
          />
          <FeatureCard 
            Icon={Users} 
            title="Market DNA" 
            text="Personalized matches for your flips." 
            color="hover:bg-green-400"
          />
        </div>
      </section>

      {/* Featured Registry */}
      <section className="py-16 px-4 bg-[#f4f4f2] border-t-2 border-black">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-10">
            The Registry.
          </h2>
          <ListingGrid listings={featuredListings} loading={loading} />
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .text-outline-black { -webkit-text-stroke: 1.5px black; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 15s linear infinite;
          width: max-content;
        }
      `}} />
    </div>
  );
};

// Helper component for mobile-ready feature cards
const FeatureCard = ({ Icon, title, text, color, border = "" }) => (
  <div className={`p-8 flex flex-col items-start transition-colors border-black ${color} ${border}`}>
    <Icon className="mb-4" size={32} strokeWidth={3}/>
    <h3 className="text-xl font-black uppercase mb-2">{title}</h3>
    <p className="font-bold text-xs uppercase opacity-70">{text}</p>
  </div>
);

export default HomePage;