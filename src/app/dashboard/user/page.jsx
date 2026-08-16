import ProtectedRoute from "@/components/ProtectedRoute";

export default function UserDashboard() {
  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className="max-w-7xl mx-auto px-4 py-8 text-white">
        <h1 className="text-2xl font-bold mb-4">Buyer Dashboard</h1>
        {/* Purchase History Table, Subscription Tier Overview */}
      </div>
    </ProtectedRoute>
  );
}
