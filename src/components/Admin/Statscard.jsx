import React from 'react';

export default function StatsCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-violet-100">
          <Icon size={24} className="text-violet-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}
