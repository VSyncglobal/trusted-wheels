export default function AdminDashboard() {
  return (
    <div className="max-w-4xl pt-10">
      <h1 className="text-3xl font-bold text-strong-black mb-2">Dashboard</h1>
      <p className="text-grey-500 mb-8">System Initialized. Database Connected.</p>

      <div className="grid grid-cols-3 gap-6">
        {/* Placeholder Stats Cards */}
        {[
          { label: "Total Vehicles", value: "0" },
          { label: "Active Listings", value: "0" },
          { label: "Pending Requests", value: "0" },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-xl border border-grey-200 bg-off-white">
            <p className="text-xs text-grey-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-3xl font-semibold text-strong-black">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}