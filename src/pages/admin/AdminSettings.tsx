import React, { useState } from 'react';
import { Save } from 'lucide-react';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Hostonic',
    siteDescription: 'Platform Hosting Solutions',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    backupFrequency: 'daily'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save settings logic here
    console.log('Settings saved:', settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">System Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Site Description
              </label>
              <input
                type="text"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">System Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-700 text-blue-500 focus:ring-blue-500 bg-gray-900/50"
              />
              <label htmlFor="maintenanceMode" className="ml-2 text-gray-300">
                Maintenance Mode
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowRegistration"
                name="allowRegistration"
                checked={settings.allowRegistration}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-700 text-blue-500 focus:ring-blue-500 bg-gray-900/50"
              />
              <label htmlFor="allowRegistration" className="ml-2 text-gray-300">
                Allow New Registrations
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-700 text-blue-500 focus:ring-blue-500 bg-gray-900/50"
              />
              <label htmlFor="emailNotifications" className="ml-2 text-gray-300">
                Email Notifications
              </label>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Backup Settings</h2>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Backup Frequency
            </label>
            <select
              name="backupFrequency"
              value={settings.backupFrequency}
              onChange={handleChange}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}