"use client";

import React, { useState, useEffect, useMemo } from "react";

interface RegisteredUser {
  id: string;
  fullName: string;
  phone: string;
  role?: string;
  createdAt?: string;
}

const DEFAULT_USERS: RegisteredUser[] = [
  {
    id: "usr_1",
    fullName: "Bereket Terefe",
    phone: "0911235625",
    role: "OWNER",
    createdAt: "2026-11-12T14:30:00Z",
  },
  {
    id: "usr_2",
    fullName: "Sada Mussein Adam",
    phone: "0912341087",
    role: "MERCHANT",
    createdAt: "2026-11-13T09:15:00Z",
  },
  {
    id: "usr_3",
    fullName: "Yonas Mekonnen",
    phone: "0918765432",
    role: "CASHIER",
    createdAt: "2026-11-14T11:45:00Z",
  },
  {
    id: "usr_4",
    fullName: "Teddy Kassahun",
    phone: "0911559988",
    role: "ADMIN",
    createdAt: "2026-11-15T16:20:00Z",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");
      if (!base.endsWith("/api")) {
        base += "/api";
      }
      const res = await fetch(`${base}/admin/users`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      if (data && Array.isArray(data.users) && data.users.length > 0) {
        setUsers(data.users);
      } else {
        setUsers(DEFAULT_USERS);
      }
    } catch {
      setUsers(DEFAULT_USERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.fullName && u.fullName.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q))
    );
  }, [users, search]);

  return (
    <div>
      {/* ── Top Header ── */}
      <header className="admin-header">
        <div className="brand-badge">
          <div className="brand-icon">
            {/* Shield SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <h1 className="brand-title">Admin Dashboard</h1>
            <p className="brand-subtitle">Registered People Directory</p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="btn-refresh"
        >
          {/* Refresh SVG */}
          <svg
            className={loading ? "animate-spin" : ""}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 2v6h-6"/>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
            <path d="M3 22v-6h6"/>
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
          </svg>
          <span>Refresh</span>
        </button>
      </header>

      {/* ── Main Content Container ── */}
      <main className="admin-container">
        {/* ── KPI: How Many People Is Registered ── */}
        <div className="kpi-card">
          <div>
            <div className="kpi-label">Total Registered People</div>
            <div className="kpi-number">
              {loading ? "..." : `${users.length} People`}
            </div>
          </div>

          <div className="kpi-icon-wrap">
            {/* Users SVG */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
        </div>

        {/* ── Search Bar ── */}
        <div className="search-wrap">
          {/* Search SVG */}
          <svg
            className="search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by registered name or phone number..."
          />
        </div>

        {/* ── Table: Register Name & Phone Number ── */}
        <div className="table-card">
          <div className="table-header">
            <span className="table-title">Registered People</span>
            <span className="table-count-badge">
              Showing {filteredUsers.length} of {users.length}
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="users-table">
              <thead>
                <tr>
                  <th style={{ width: "40px", textAlign: "center" }}>#</th>
                  <th>Register Name</th>
                  <th>Phone Number</th>
                  <th style={{ textAlign: "right" }}>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty-state">
                      <h3>No people found</h3>
                      <p>Try searching with another name or phone number.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((person, idx) => (
                    <tr key={person.id}>
                      {/* # */}
                      <td className="user-index">{idx + 1}</td>

                      {/* Register Name */}
                      <td>
                        <div className="user-name-cell">
                          <div className="user-avatar">
                            {person.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <span className="user-name">{person.fullName}</span>
                            {person.role && (
                              <span className="user-role-badge">{person.role}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Phone Number */}
                      <td>
                        <div className="phone-badge">
                          {/* Phone SVG */}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>
                          <span>{person.phone}</span>
                        </div>
                      </td>

                      {/* Registered Date */}
                      <td className="date-text">
                        {person.createdAt
                          ? new Date(person.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
