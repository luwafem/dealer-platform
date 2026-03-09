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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Dealers</p>
              <p className="text-2xl font-bold">{stats.totalDealers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Listings</p>
              <p className="text-2xl font-bold">{stats.activeListings}</p>
            </div>
            <Car className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sold Today</p>
              <p className="text-2xl font-bold">{stats.soldToday}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenue Today</p>
              <p className="text-2xl font-bold">{formatNaira(stats.revenueToday)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Flagged</p>
              <p className="text-2xl font-bold">{stats.flaggedListings}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Verifications</p>
              <p className="text-2xl font-bold">{stats.pendingVerifications}</p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
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
  );
};

export default AdminDashboard;