import React from 'react';
import ListingForm from '../components/listings/ListingForm';

const AddListingPage = () => {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Add New Listing</h1>
      <ListingForm />
    </div>
  );
};

export default AddListingPage;