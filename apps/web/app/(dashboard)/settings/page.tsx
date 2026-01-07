"use client";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-white">Settings</h1>

      <div className="bg-surface rounded-xl p-6 border border-gray-800 flex flex-col gap-4">
        <SettingItem label="Dark Mode" value="Enabled" />
        <SettingItem label="Notifications" value="Off" />
        <SettingItem label="Account" value="Free Plan" />
      </div>
    </div>
  );
}

function SettingItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-0">
      <span className="text-gray-300">{label}</span>
      <span className="text-gray-500">{value}</span>
    </div>
  );
}
