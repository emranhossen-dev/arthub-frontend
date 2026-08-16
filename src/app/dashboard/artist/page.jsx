import ProtectedRoute from "@/components/ProtectedRoute";

export default function ArtistDashboard() {
  return (
    <ProtectedRoute allowedRoles={["artist"]}>
      <div className="max-w-7xl mx-auto px-4 py-8 text-white">
        <h1 className="text-2xl font-bold mb-4">Artist Dashboard</h1>
        {/* Manage Artworks, Add Artwork Form, Sales History */}
      </div>
    </ProtectedRoute>
  );
}
