import React from 'react';
import { Users, Server, ShieldCheck, Activity } from 'lucide-react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, getFirestore } from 'firebase/firestore';
import { format } from 'date-fns';

export function AdminDashboard() {
  const db = getFirestore();
  const [users] = useCollection(collection(db, 'users'));

  const stats = [
    {
      label: 'Total Users',
      value: users?.size || 0,
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Active Servers',
      value: '24',
      icon: Server,
      color: 'green'
    },
    {
      label: 'Security Events',
      value: '0',
      icon: ShieldCheck,
      color: 'yellow'
    },
    {
      label: 'System Status',
      value: 'Healthy',
      icon: Activity,
      color: 'emerald'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">
          {format(new Date(), 'MMMM d, yyyy')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-semibold text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 text-${stat.color}-500`} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-0"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-white">New user registered</p>
                  <p className="text-sm text-gray-400">
                    {format(new Date(Date.now() - i * 3600000), 'h:mm a')}
                  </p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">
                {format(new Date(Date.now() - i * 3600000), 'MMM d, yyyy')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}