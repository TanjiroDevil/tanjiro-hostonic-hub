import React, { useState } from 'react';
import { User, Trash2, Shield, ShieldOff } from 'lucide-react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, getFirestore, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { format } from 'date-fns';

export function AdminUsers() {
  const db = getFirestore();
  const [users] = useCollection(collection(db, 'users'));
  const [selectedUser, setSelectedUser] = useState(null);

  const handleMakeAdmin = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isAdmin: true
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isAdmin: false
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Users Management</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search users..."
            className="bg-gray-800/40 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.docs.map((doc) => {
              const user = doc.data();
              return (
                <tr key={doc.id} className="border-b border-gray-700/50 last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {user.displayName || 'Unnamed User'}
                        </div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isAdmin ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {format(user.createdAt?.toDate() || new Date(), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    {user.isAdmin ? (
                      <button
                        onClick={() => handleRemoveAdmin(doc.id)}
                        className="text-yellow-500 hover:text-yellow-400"
                        title="Remove Admin"
                      >
                        <ShieldOff className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(doc.id)}
                        className="text-blue-500 hover:text-blue-400"
                        title="Make Admin"
                      >
                        <Shield className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(doc.id)}
                      className="text-red-500 hover:text-red-400"
                      title="Delete User"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}