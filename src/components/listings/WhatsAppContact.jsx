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
      toast.error('ACCESS DENIED: Please login to contact seller');
      return;
    }

    if (dealer?.id === seller.id) {
      toast.error('SYSTEM ERROR: Cannot contact own registry');
      return;
    }

    const result = await initiateContact(seller.id, listing.id);
    if (result.success) {
      // Use the phone number from the seller object
      const whatsappLink = formatWhatsAppLink(seller.phone_number || seller.phone);
      window.open(whatsappLink, '_blank');
    }
  };

  return (
    <button
      onClick={handleContactClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-4 
                 bg-emerald-400 text-black border-4 border-black 
                 font-black uppercase italic tracking-tighter text-sm
                 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] 
                 active:bg-emerald-500 transition-all 
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <MessageCircle size={20} strokeWidth={3} />
      <span>
        {loading ? 'Transmitting...' : 'Initiate WhatsApp Contact'}
      </span>
    </button>
  );
};

export default WhatsAppContact;