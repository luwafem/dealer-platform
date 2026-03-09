import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { listingService } from '../services/listingService';
import ListingGrid from '../components/listings/ListingGrid';
import SearchBar from '../components/search/SearchBar';
import { Shield, Zap, Users, ArrowUpRight, Plus, Minus } from 'lucide-react';

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
    <div className="bg-[#f4f4f2] min-h-screen text-[#1a1a1a] selection:bg-yellow-300">
      {/* Hero Section - Editorial Layout */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 px-4 border-b border-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-8">
                Trade <br /> 
                <span className="text-outline-black text-transparent md:ml-20">Verified</span> <br /> 
                Inventory.
              </h1>
            </div>
            <div className="lg:col-span-4 pb-2">
              <p className="text-lg md:text-xl leading-tight font-medium mb-8 border-l-4 border-black pl-4">
                The exclusive hub for Nigerian auto-dealers. High-velocity trading with zero fluff.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row gap-4 items-stretch">
            <div className="flex-grow bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <SearchBar />
            </div>
            <Link to={user ? "/add-listing" : "/register"} className="bg-yellow-400 border-2 border-black px-8 py-4 font-black uppercase flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {user ? "List Vehicle" : "Join the Club"}
              <Plus className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Distress Sales - The "Ticker" Style */}
      {(!loading && distressListings.length > 0) && (
        <section className="py-12 bg-black text-white overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee mb-12 border-y border-white/20 py-4">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className="text-4xl md:text-6xl font-black uppercase mx-8 italic opacity-80">
                Distress car sale
              </span>
            ))}
          </div>
          
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold uppercase tracking-tighter">Live Distress Feed</h2>
              <Link to="/distress" className="group flex items-center text-sm font-bold uppercase border-b border-white pb-1">
                View All <ArrowUpRight className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16}/>
              </Link>
            </div>
            <div className="p-1 bg-black">
               <ListingGrid listings={distressListings} loading={loading} />
            </div>
          </div>
        </section>
      )}

      {/* Features - Asymmetric Bento Grid */}
    <section className="py-24 px-4 max-w-7xl mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black">
    <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black hover:bg-yellow-400 transition-colors group">
      <Shield className="mb-6 group-hover:scale-110 transition-transform" size={40} strokeWidth={2.5}/>
      <h3 className="text-2xl font-black uppercase mb-4">Vetted Only</h3>
      <p className="font-medium opacity-80 uppercase text-sm">
        Strict dealer verification. No individual sellers or joyriders allowed.
      </p>
    </div>
    <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black hover:bg-blue-400 transition-colors group">
      <Zap className="mb-6 group-hover:scale-110 transition-transform" size={40} strokeWidth={2.5}/>
      <h3 className="text-2xl font-black uppercase mb-4">Fast Chat</h3>
      <p className="font-medium opacity-80 uppercase text-sm">
        Direct WhatsApp hooks. Pay per contact, no monthly credits to manage.
      </p>
    </div>
    <div className="p-8 hover:bg-green-400 transition-colors group">
      <Users className="mb-6 group-hover:scale-110 transition-transform" size={40} strokeWidth={2.5}/>
      <h3 className="text-2xl font-black uppercase mb-4">Market DNA</h3>
      <p className="font-medium opacity-80 uppercase text-sm">
        We track what moves. Personalized matches based on your historical flips.
      </p>
    </div>
  </div>
</section>

      {/* Featured Grid */}
      <section className="py-24 px-4 bg-white border-t-2 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">
              The <br /> Registry.
            </h2>
            <Link to="/search" className="bg-black text-white px-8 py-3 font-bold uppercase hover:translate-x-2 transition-transform">
              Browse Entire Stock
            </Link>
          </div>
          
          <ListingGrid listings={featuredListings} loading={loading} />
        </div>
      </section>

      {/* Footer */}
      

      <style dangerouslySetInnerHTML={{ __html: `
        .text-outline-black {
          -webkit-text-stroke: 1.5px black;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 20s linear infinite;
        }
      `}} />
    </div>
  );
};

export default HomePage;