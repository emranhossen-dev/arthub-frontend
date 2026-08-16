import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-7xl mx-auto px-4 py-8 text-white">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        {/* Analytics Cards, Manage Users, Manage Artworks, Transactions */}
      </div>
    </ProtectedRoute>
  );
}
