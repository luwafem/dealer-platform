import { WHATSAPP_CONTACT_FEE } from './constants';

// WhatsApp contact fee (just export the constant)
export { WHATSAPP_CONTACT_FEE };

// Check if a dealer can contact via WhatsApp – always true now because payment is handled separately
// We might not need this function at all, but keep for compatibility if used elsewhere.
export const canContact = () => true;