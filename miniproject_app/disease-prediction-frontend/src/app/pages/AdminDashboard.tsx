import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Activity, Users, Stethoscope, TrendingUp, LogOut, User, Menu, BarChart3, ShieldCheck, Edit, Trash2 } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalPredictions: 0,
    patientCount: 0,
    doctorCount: 0,
    adminCount: 1, // At least the current logged-in admin
    activeUsers: 0,
    totalConsultations: 0,
    monthlyGrowth: 0
  });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);

  const fetchAdminData = async () => {
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
        totalConsultations: res.data.total_feedbacks,
        monthlyGrowth: 5 // Mock placeholder
      });

      // Fetch users
      const usersRes = await axios.get(`${API_BASE_URL}/api/users/all/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_BASE_URL}/api/users/manage/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Re-fetch all data to ensure stats are in sync
      await fetchAdminData();
    } catch (err) {
      console.error("Failed to delete user", err);
      alert("Failed to delete user.");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`${API_BASE_URL}/api/users/manage/${editingUser.id}/`, editingUser, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEditingUser(null);

      // Re-fetch all data to ensure stats are in sync
      await fetchAdminData();
    } catch (err) {
      console.error("Failed to update user", err);
      alert("Failed to update user.");
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Activity className="h-7 w-7 text-[#0066CC]" />
              <span className="text-xl font-semibold text-gray-900">SymptoScan</span>
              <Badge className="ml-2 bg-purple-100 text-purple-800">Admin</Badge>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
              <Button variant="ghost" size="sm">
                Users
              </Button>
              <Button variant="ghost" size="sm">
                Reports
              </Button>
              <Button variant="ghost" size="sm">
                Settings
              </Button>
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => {
                  localStorage.clear();
                  navigate('/');
                }}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Monitor and manage the SymptoScan platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-md border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-white/80" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {adminStats.totalUsers.toLocaleString()}
            </div>
            <p className="text-blue-100 text-sm">Total Users</p>
            <p className="text-xs text-blue-200 mt-2">+{adminStats.monthlyGrowth}% this month</p>
          </Card>

          <Card className="p-6 shadow-md border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-white/80" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {adminStats.totalPredictions.toLocaleString()}
            </div>
            <p className="text-green-100 text-sm">Total Predictions</p>
            <p className="text-xs text-green-200 mt-2">+12% this month</p>
          </Card>

          <Card className="p-6 shadow-md border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-white/80" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {adminStats.totalConsultations.toLocaleString()}
            </div>
            <p className="text-purple-100 text-sm">Consultations</p>
            <p className="text-xs text-purple-200 mt-2">+8% this month</p>
          </Card>

          <Card className="p-6 shadow-md border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-white/80" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {adminStats.activeUsers.toLocaleString()}
            </div>
            <p className="text-orange-100 text-sm">Active Users</p>
            <p className="text-xs text-orange-200 mt-2">Last 7 days</p>
          </Card>
        </div>

        {/* User Distribution */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 shadow-md border-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Patients</h3>
              <Users className="h-5 w-5 text-[#0066CC]" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {adminStats.patientCount.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0066CC]"
                  style={{ width: `${(adminStats.patientCount / adminStats.totalUsers) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {Math.round((adminStats.patientCount / adminStats.totalUsers) * 100)}%
              </span>
            </div>
          </Card>

          <Card className="p-6 shadow-md border-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Doctors</h3>
              <Stethoscope className="h-5 w-5 text-[#10B981]" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {adminStats.doctorCount.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10B981]"
                  style={{ width: `${(adminStats.doctorCount / adminStats.totalUsers) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {Math.round((adminStats.doctorCount / adminStats.totalUsers) * 100)}%
              </span>
            </div>
          </Card>

          <Card className="p-6 shadow-md border-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Admins</h3>
              <ShieldCheck className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {adminStats.adminCount}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600"
                  style={{ width: `${(adminStats.adminCount / adminStats.totalUsers) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {((adminStats.adminCount / adminStats.totalUsers) * 100).toFixed(1)}%
              </span>
            </div>
          </Card>
        </div>

        {/* Recent Users Table */}
        <Card className="p-6 shadow-md border-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">Loading users...</TableCell>
                  </TableRow>
                ) : users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.role === 'Doctor'
                            ? 'border-green-200 text-green-800 bg-green-50'
                            : user.role === 'Admin'
                              ? 'border-purple-200 text-purple-800 bg-purple-50'
                              : 'border-blue-200 text-blue-800 bg-blue-50'
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{user.joined}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* System Health */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <Card className="p-6 shadow-md border-0">
            <h3 className="font-semibold text-gray-900 mb-4">System Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Server Status</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Database</span>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[95%]" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">API Response Time</span>
                  <span className="text-sm text-gray-600">125ms</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[85%]" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-md border-0">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                System Logs
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md bg-white">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  value={editingUser.name}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 bg-white"
                  value={editingUser.role}
                  onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                >
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 bg-white"
                  value={editingUser.status}
                  onChange={e => setEditingUser({ ...editingUser, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#0066CC] hover:bg-[#0052A3]">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
