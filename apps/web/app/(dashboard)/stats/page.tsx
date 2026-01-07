"use client";

export default function StatsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-white">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Habits" value="0" />
        <StatCard title="Current Streak" value="0 days" />
        <StatCard title="Completion Rate" value="0%" />
      </div>

      <div className="bg-surface rounded-xl p-8 border border-gray-800">
        <p className="text-gray-400 text-center">Charts and graphs will appear here once you start tracking habits.</p>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-surface rounded-xl p-6 border border-gray-800">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-3xl font-bold text-primary">{value}</p>
    </div>
  );
}
