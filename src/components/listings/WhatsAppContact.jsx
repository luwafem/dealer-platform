import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useWhatsAppContact } from '../../hooks/useWhatsAppContact';
import { formatWhatsAppLink } from '../../utils/formatters';
import toast from 'react-hot-toast';

const WhatsAppContact = ({ seller, listing }) => {
  const { user, dealer } = useAuth();
  const { initiateContact, loading } = useWhatsAppContact();

  const handleContactClick = async () => {
    if (!user) {
      toast.error('Please login to contact seller');
      return;
    }

    if (dealer?.id === seller.id) {
      toast.error('You cannot contact your own listing');
      return;
    }

    const result = await initiateContact(seller.id, listing.id);
    if (result.success) {
      const whatsappLink = formatWhatsAppLink(seller.phone);
      window.open(whatsappLink, '_blank');
    }
  };

  return (
    <button
      onClick={handleContactClick}
      disabled={loading}
      className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
    >
      <MessageCircle className="w-5 h-5 mr-2" />
      {loading ? 'Processing...' : 'Contact Seller via WhatsApp'}
    </button>
  );
};

export default WhatsAppContact;