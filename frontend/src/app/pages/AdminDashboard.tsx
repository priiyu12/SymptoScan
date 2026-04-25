// UI Enhancement Update:
// Added professional welcome header section for admin dashboard
// Added footer branding text for improved dashboard appearance
// No business logic changed — visual improvements only.

import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Activity, LogOut, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { API_BASE_URL } from '../utils/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalPredictions: 0,
    patientCount: 0,
    doctorCount: 0,
    adminCount: 1,
    activeUsers: 0,
    totalConsultations: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });

  const [users, setUsers] = useState<any[]>([]);
  const [userMetadata, setUserMetadata] = useState({ count: 0, next: null, previous: null });
  const [userPage, setUserPage] = useState(1);

  const [payments, setPayments] = useState<any[]>([]);
  const [paymentMetadata, setPaymentMetadata] = useState({ count: 0, next: null, previous: null });
  const [paymentPage, setPaymentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(`${API_BASE_URL}/api/users/admin-dashboard/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAdminStats({
        totalUsers: res.data.total_patients + res.data.total_doctors + res.data.total_admins,
        totalPredictions: res.data.total_predictions,
        patientCount: res.data.total_patients,
        doctorCount: res.data.total_doctors,
        adminCount: res.data.total_admins,
        activeUsers: res.data.total_patients + res.data.total_doctors + res.data.total_admins,
        totalConsultations: res.data.total_consultations,
        totalRevenue: res.data.total_revenue,
        monthlyGrowth: 5
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(`${API_BASE_URL}/api/users/all/?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(res.data.results || []);
      setUserMetadata({
        count: res.data.count,
        next: res.data.next,
        previous: res.data.previous
      });
      setUserPage(page);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchPayments = useCallback(async (page = 1) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(`${API_BASE_URL}/api/consultation/payments/?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPayments(res.data.results || []);
      setPaymentMetadata({
        count: res.data.count,
        next: res.data.next,
        previous: res.data.previous
      });
      setPaymentPage(page);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchUsers(1), fetchPayments(1)]);
    setLoading(false);
  }, [fetchStats, fetchUsers, fetchPayments]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_BASE_URL}/api/users/manage/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchUsers(userPage);
      fetchStats();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('access_token');

      await axios.put(`${API_BASE_URL}/api/users/manage/${editingUser.id}/`, editingUser, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEditingUser(null);
      fetchUsers(userPage);
    } catch (err) {
      setErrorMsg("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-7 w-7 text-[#0066CC]" />
            <span className="text-xl font-semibold">SymptoScan</span>
            <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
          </div>

          <Button variant="ghost" size="icon" onClick={() => {
            localStorage.clear();
            navigate('/');
          }}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* NEW HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back, Admin 👋</h1>
          <p className="text-gray-500 mt-1">
            Monitor users, consultations, revenue and platform insights.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <Card className="p-6 bg-blue-600 text-white">
            <div className="text-3xl font-bold">{adminStats.totalUsers}</div>
            <p>Total Users</p>
          </Card>

          <Card className="p-6 bg-green-600 text-white">
            <div className="text-3xl font-bold">{adminStats.totalPredictions}</div>
            <p>Predictions</p>
          </Card>

          <Card className="p-6 bg-purple-600 text-white">
            <div className="text-3xl font-bold">{adminStats.totalConsultations}</div>
            <p>Consultations</p>
          </Card>

          <Card className="p-6 bg-orange-600 text-white">
            <div className="text-3xl font-bold">₹ {adminStats.totalRevenue}</div>
            <p>Revenue</p>
            <p className="text-xs mt-1">+12% this month</p>
          </Card>

        </div>

        {/* Users */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Manage Users</h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>

                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setEditingUser(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Payments History */}
        <Card className="p-6 mb-8 shadow-md border-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Payment History</h2>
            <Badge className="bg-orange-100 text-orange-800">
              {paymentMetadata.count} Transactions
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                      No payments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-xs">{payment.transaction_id || payment.order_id}</TableCell>
                      <TableCell>{payment.patient}</TableCell>
                      <TableCell>Dr. {payment.doctor}</TableCell>
                      <TableCell className="font-medium text-green-600">₹{payment.amount}</TableCell>
                      <TableCell className="text-sm text-gray-600">{payment.date}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 py-6">
          SymptoScan Admin Panel • Secure Analytics Dashboard
        </div>

      </div>
    </div>
  );
}
