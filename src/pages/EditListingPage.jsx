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
    <div className="py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Edit Listing</h1>
      <ListingForm initialData={listing} isEditing />
    </div>
  );
};

export default EditListingPage;