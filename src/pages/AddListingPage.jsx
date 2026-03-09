import React, { useEffect } from 'react';
import ListingForm from '../components/listings/ListingForm';

const AddListingPage = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 border-b-2 border-black pb-4">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Add <br /> Listing
          </h1>
          <p className="text-lg font-medium mt-2 border-l-4 border-black pl-4">
            List a new vehicle in your inventory
          </p>
        </div>
        <ListingForm />
      </div>
    </div>
  );
};

export default AddListingPage;