import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { reportService } from '../../services/reportService';
import { verificationService } from '../../services/verificationService';
import { Users, Car, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatNaira } from '../../utils/formatters';
import FlaggedListings from './FlaggedListings';
import VerificationRequests from './VerificationRequests';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDealers: 0,
    activeListings: 0,
    soldToday: 0,
    revenueToday: 0,
    flaggedListings: 0,
    pendingVerifications: 0,
  });
  const [loading, setLoading] = useState(true);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get total dealers
      const { count: dealerCount } = await supabase
        .from('dealers')
        .select('*', { count: 'exact', head: true });

      // Get active listings
      const { count: listingCount } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

      // Get today's sold payments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data: soldToday } = await supabase
        .from('sold_payments')
        .select('amount')
        .gte('created_at', today.toISOString());

      // Get pending reports count
      const reports = await reportService.getReports('pending');
      const flaggedCount = reports.length;

      // Get pending verification requests count
      const verifications = await verificationService.getAllRequests('pending');
      const pendingCount = verifications.length;

      setStats({
        totalDealers: dealerCount || 0,
        activeListings: listingCount || 0,
        soldToday: soldToday?.length || 0,
        revenueToday: soldToday?.reduce((sum, p) => sum + p.amount, 0) || 0,
        flaggedListings: flaggedCount,
        pendingVerifications: pendingCount,
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f2] flex justify-center items-center">
        <div className="border-2 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="animate-spin rounded-none h-12 w-12 border-2 border-black border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b-2 border-black pb-4">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Admin <br /> Dashboard
          </h1>
          <p className="text-lg font-medium mt-2 border-l-4 border-black pl-4">
            Platform overview and moderation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold uppercase">Dealers</p>
              <p className="text-3xl font-black">{stats.totalDealers}</p>
            </div>
            <Users size={32} strokeWidth={2} />
          </div>
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold uppercase">Active Listings</p>
              <p className="text-3xl font-black">{stats.activeListings}</p>
            </div>
            <Car size={32} strokeWidth={2} />
          </div>
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold uppercase">Sold Today</p>
              <p className="text-3xl font-black">{stats.soldToday}</p>
            </div>
            <CheckCircle size={32} strokeWidth={2} />
          </div>
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold uppercase">Revenue Today</p>
              <p className="text-3xl font-black">{formatNaira(stats.revenueToday)}</p>
            </div>
            <TrendingUp size={32} strokeWidth={2} />
          </div>
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold uppercase">Flagged</p>
              <p className="text-3xl font-black">{stats.flaggedListings}</p>
            </div>
            <AlertTriangle size={32} strokeWidth={2} />
          </div>
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold uppercase">Verifications</p>
              <p className="text-3xl font-black">{stats.pendingVerifications}</p>
            </div>
            <Users size={32} strokeWidth={2} />
          </div>
        </div>

        {/* Flagged Listings */}
        <div className="mt-8">
          <FlaggedListings />
        </div>

        {/* Verification Requests */}
        <div className="mt-8">
          <VerificationRequests />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;