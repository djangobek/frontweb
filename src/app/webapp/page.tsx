"use client";

import { useEffect, useState } from "react";

export default function WebAppLoginPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const telegram = (window as any).Telegram?.WebApp;

    if (!telegram?.initData) {
      alert("Telegram initData topilmadi");
      setLoading(false);
      return;
    }

    fetch("https://9af3-95-214-210-137.ngrok-free.app/api/auth/webapp-login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ init_data: telegram.initData }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Login failed");
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        setUser(data.user);
      })
      .catch((err) => {
        console.error("Login error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Yuklanmoqda...</div>;
  if (!user) return <div>Login bo‘lmadi. Qayta urinib ko‘ring.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Assalomu alaykum, {user.full_name}!</h1>
      <p>Telegram ID: {user.telegram_id}</p>
      <p>Ballar: {user.points}</p>
      <p>Reyting o‘rni: {user.rank}</p>
    </div>
  );
}
