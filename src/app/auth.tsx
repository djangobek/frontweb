"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TelegramLogin() {
  const router = useRouter();

  useEffect(() => {
    const telegram = (window as any).Telegram?.WebApp;
    telegram?.ready();

    if (!telegram?.initData || telegram.initData === "") {
      alert("❌ Telegram initData topilmadi. Iltimos, sahifani Telegram ilovasida oching.");
      return;
    }

    // POST initData (raw string) to Django backend
    fetch("https://9af3-95-214-210-137.ngrok-free.app/api/auth/telegram/", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain", // plain text yuboramiz
      },
      credentials: "include", // 🧠 bu sessionni ishlashi uchun muhim!
      body: telegram.initData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Login failed");
        return res.json();
      })
      .then((data) => {
        if (data.status === "authenticated") {
          router.push("/dashboard");
        } else {
          alert("❌ Avtorizatsiya muvaffaqiyatsiz.");
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        alert("❌ Login xatolikka uchradi.");
      });
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
      ⏳ Yuklanmoqda...
        </div>
  );
}
