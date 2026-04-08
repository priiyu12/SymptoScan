import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Activity, Users, Stethoscope, TrendingUp, LogOut, User, Menu, BarChart3, ShieldCheck, Edit, Trash2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const API_BASE_URL = import.meta.env.VITE_API_URL || ' + API_BASE_URL + '';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
  
  // Paginated Data States
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
      console.error("Failed to fetch stats", err);
    }
  }, []);

  const fetchUsers = useCallback(async (page: number = 1) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(`http://127.0.0.1:8000/api/users/all/?page=${page}`, {
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
      console.error("Failed to fetch users", err);
    }
  }, []);

  const fetchPayments = useCallback(async (page: number = 1) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(`http://127.0.0.1:8000/api/consultation/payments/?page=${page}`, {
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
      console.error("Failed to fetch payments", err);
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
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://127.0.0.1:8000/api/users/manage/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers(userPage);
      fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete user.");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`http://127.0.0.1:8000/api/users/manage/${editingUser.id}/`, {
        ...editingUser,
        consultation_fee: editingUser.role === 'Doctor' ? parseFloat(editingUser.consultation_fee || '0') : 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingUser(null);
      fetchUsers(userPage);
      alert("User updated successfully!");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Update failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Activity className="h-7 w-7 text-[#0066CC]" />
              <span className="text-xl font-semibold text-gray-900">SymptoScan</span>
              <Badge className="ml-2 bg-purple-100 text-purple-800">Admin</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => { localStorage.clear(); navigate('/'); }}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-md border-0 bg-blue-600 text-white">
            <div className="text-3xl font-bold mb-1">{adminStats.totalUsers}</div>
            <p className="text-blue-100 text-sm">Total Users</p>
          </Card>
          <Card className="p-6 shadow-md border-0 bg-green-600 text-white">
            <div className="text-3xl font-bold mb-1">{adminStats.totalPredictions}</div>
            <p className="text-green-100 text-sm">Predictions</p>
          </Card>
          <Card className="p-6 shadow-md border-0 bg-purple-600 text-white">
            <div className="text-3xl font-bold mb-1">{adminStats.totalConsultations}</div>
            <p className="text-purple-100 text-sm">Consultations</p>
          </Card>
          <Card className="p-6 shadow-md border-0 bg-orange-600 text-white">
            <div className="text-3xl font-bold mb-1">₹ {adminStats.totalRevenue.toLocaleString()}</div>
            <p className="text-orange-100 text-sm">Revenue</p>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="p-6 shadow-md border-0 mb-8">
          <h2 className="text-xl font-semibold mb-6">Manage Users</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name/Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                    <TableCell><Badge className={user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}>{user.status}</Badge></TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button variant="ghost" size="icon" onClick={() => setEditingUser(user)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteUser(user.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* User Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing {users.length} of {userMetadata.count} users</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={!userMetadata.previous} onClick={() => fetchUsers(userPage - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button variant="outline" size="sm" disabled={!userMetadata.next} onClick={() => fetchUsers(userPage + 1)}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card className="p-6 shadow-md border-0">
          <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Patient/Doctor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.order_id}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{p.patient}</div>
                      <div className="text-xs text-gray-500">to {p.doctor}</div>
                    </TableCell>
                    <TableCell className="font-bold">₹ {p.amount}</TableCell>
                    <TableCell><Badge className="bg-green-100 text-green-800">{p.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Payment Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing {payments.length} of {paymentMetadata.count} records</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={!paymentMetadata.previous} onClick={() => fetchPayments(paymentPage - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button variant="outline" size="sm" disabled={!paymentMetadata.next} onClick={() => fetchPayments(paymentPage + 1)}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <Card className="p-8 w-full max-w-md bg-white">
            <h2 className="text-2xl font-bold mb-6">Edit User</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div><Label>Name</Label><Input value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} /></div>
              <div><Label>Role</Label>
                <select className="w-full h-11 px-3 rounded-md border" value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})}>
                  <option value="Patient">Patient</option><option value="Doctor">Doctor</option><option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                <Button type="submit" className="bg-[#0066CC]">Save</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
