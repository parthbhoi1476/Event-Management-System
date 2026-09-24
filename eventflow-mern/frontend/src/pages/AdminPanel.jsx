import { useEffect, useState } from "react";
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, Ticket, LogOut, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0, totalBookings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get("/api/admin/stats").then((res) => {
      setStats(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users size={32} /></div>
          <div><p className="text-sm text-gray-500 font-medium">Total Users</p><p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Calendar size={32} /></div>
          <div><p className="text-sm text-gray-500 font-medium">Total Events</p><p className="text-3xl font-bold text-gray-800">{stats.totalEvents}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl"><Ticket size={32} /></div>
          <div><p className="text-sm text-gray-500 font-medium">Total Bookings</p><p className="text-3xl font-bold text-gray-800">{stats.totalBookings}</p></div>
        </div>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axiosClient.get("/api/admin/users").then(res => setUsers(res.data)).catch(console.error);
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({ title: "Delete User?", text: "This will remove the user entirely.", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (res.isConfirmed) {
      try {
        await axiosClient.delete(`/api/admin/users/${id}`);
        setUsers(users.filter(u => u.id !== id));
        Swal.fire("Deleted!", "User removed.", "success");
      } catch (e) {
        Swal.fire("Error", e.response?.data?.error || "Could not delete", "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(u => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div><div className="text-sm font-medium text-gray-900">{u.name}</div><div className="text-sm text-gray-500">{u.email}</div></div></div></td>
                <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>{u.role}</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {u.role !== 'admin' && <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axiosClient.get("/api/admin/events").then(res => setEvents(res.data)).catch(console.error);
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({ title: "Delete Event?", text: "Cannot be undone.", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (res.isConfirmed) {
      try {
        await axiosClient.delete(`/api/admin/events/${id}`);
        setEvents(events.filter(e => e.id !== id));
        Swal.fire("Deleted!", "Event removed.", "success");
      } catch (e) {
        Swal.fire("Error", "Could not delete", "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Manage Events</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.map(e => (
              <tr key={e.id}>
                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{e.title}</div><div className="text-sm text-gray-500">{e.category}</div></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(e.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{e.owner_email || e.ownerEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <Link to={`/my-events/edit/${e.id}`} className="text-blue-600 hover:text-blue-900">Edit</Link>
                  <button onClick={() => handleDelete(e.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} className="inline"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    axiosClient.get("/api/admin/bookings").then(res => setBookings(res.data)).catch(console.error);
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({ title: "Cancel Booking?", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (res.isConfirmed) {
      try {
        await axiosClient.delete(`/api/admin/bookings/${id}`);
        setBookings(bookings.filter(b => b.id !== id));
        Swal.fire("Deleted!", "Booking cancelled.", "success");
      } catch (e) {
        Swal.fire("Error", "Could not delete", "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Manage Bookings</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booked At</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map(b => (
              <tr key={b.id}>
                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{b.eventTitle}</div></td>
                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{b.userName}</div><div className="text-sm text-gray-500">{b.userEmail}</div></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(b.booked_at).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-900">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function AdminPanel() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Events", path: "/admin/events", icon: <Calendar size={20} /> },
    { name: "Bookings", path: "/admin/bookings", icon: <Ticket size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 font-black text-2xl tracking-tighter cursor-pointer" onClick={() => navigate("/")}>
          Admin<span className="text-blue-500">Flow</span>
        </div>
        <div className="flex-1 py-6 space-y-2 px-4">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === link.path ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-gray-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {link.icon}
              <span className="font-semibold">{link.name}</span>
            </Link>
          ))}
        </div>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors font-semibold"
          >
            <LogOut size={20} />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden">
            <span className="font-black text-xl text-slate-900">Admin<span className="text-blue-600">Flow</span></span>
            <div className="flex space-x-4 text-slate-600">
                {links.map(l => <Link key={l.name} to={l.path}>{l.icon}</Link>)}
            </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/events" element={<AdminEvents />} />
            <Route path="/bookings" element={<AdminBookings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
