import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ListingForm from '../components/listings/ListingForm';
import { listingService } from '../services/listingService';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
  }, []);

  useEffect(() => {
    const loadListing = async () => {
      try {
        const data = await listingService.getListingById(id);
        setListing(data);
      } catch (error) {
        toast.error('Listing not found');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadListing();
  }, [id, navigate]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 border-b-2 border-black pb-4">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Edit <br /> Listing
          </h1>
          <p className="text-lg font-medium mt-2 border-l-4 border-black pl-4">
            Update your vehicle details below
          </p>
        </div>
        <ListingForm initialData={listing} isEditing />
      </div>
    </div>
  );
};

export default EditListingPage;