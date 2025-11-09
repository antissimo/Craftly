"use client";

import { useState } from "react";
import { useAuth } from "../app/context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      onClose();
      // reset form
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // modal overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => {
          if (!loading) onClose();
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-900">Sign in</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-black text-white text-sm hover:bg-gray-800 transition"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
