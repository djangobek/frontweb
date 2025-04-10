"use client";
import React, { useState, useEffect } from 'react';
import { CgProfile } from "react-icons/cg";
import { FaCrown, FaMedal, FaFire, FaTrophy } from "react-icons/fa";
import Navbar from '../components/navbar';

const API_URL = 'http://127.0.0.1:8000/api';

declare global {
  interface Window {
     Telegram?: {
      WebApp: {
        initData?: string;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          query_id?: string;
        };
        ready: () => void;
        expand: () => void;
      };
    };
  }
}

type UserRanking = {
  telegram_id: string;
  name: string;
  points: number;
  rank: number;
  streak?: number;
};

export default function Reyting() {
  const [activeTab, setActiveTab] = useState('umumiy');
  const [topUsers, setTopUsers] = useState<UserRanking[]>([]);
  const [currentUser, setCurrentUser] = useState<UserRanking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [telegramId, setTelegramId] = useState<string | null>(null);

  useEffect(() => {
    const initTelegram = async () => {
      const tg = window.Telegram?.WebApp;

      if (!tg) {
        setError("Please open this page in the Telegram app.");
        setLoading(false);
        return;
      }

      tg.expand();
      tg.ready();

      const userData = tg.initDataUnsafe?.user;
      if (userData) {
        const tgId = String(userData.id);
        setTelegramId(tgId);
        await fetchRankingData(tgId);
      } else {
        setError("User data not available");
      }

      setLoading(false);
    };

    const fetchRankingData = async (tgId: string) => {
      try {
        // Fetch top users
        const res = await fetch(`${API_URL}/rankings/`);
        if (!res.ok) throw new Error("Failed to fetch top users");

        const data = await res.json();
        const users = Array.isArray(data) ? data :
                      data.users || data.top_users || [];

        setTopUsers(users.slice(0, 10));

        // Fetch current user
        const userRes = await fetch(`${API_URL}/rankings/?telegram_id=${tgId}`);
        if (!userRes.ok) throw new Error("Failed to fetch user data");

        const userData = await userRes.json();
        const user = userData.user || userData;

        setCurrentUser({
          telegram_id: tgId,
          name: user.name || user.first_name || `User ${tgId}`,
          points: user.points || 0,
          rank: user.rank || 0,
          streak: user.streak || 0
        });
      } catch (err) {
        console.error(err);
        setError("Ranking data could not be loaded. Please try again later.");
      }
    };

    if (!window.Telegram) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true;
      script.onload = initTelegram;
      document.body.appendChild(script);
    } else {
      initTelegram();
    }
  }, []);

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center p-4">
        <div className="bg-red-900/50 p-6 rounded-xl max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">Xatolik</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Qayta urinib korish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="w-full min-h-screen p-5 flex flex-col text-white gap-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-red-900 opacity-90 z-0"></div>

        <div className='flex justify-between items-center relative z-10'>
          <h1 className='text-2xl font-bold flex items-center gap-2'>
            <FaTrophy className="text-red-500" /> Reyting
          </h1>
        </div>

        <div className='bg-gray-900 rounded-xl flex items-center p-1 gap-1 relative z-10 border border-gray-800'>
          <button 
            className={`w-1/2 p-3 flex justify-center rounded-xl transition-colors ${
              activeTab === 'umumiy' ? 'bg-red-600 font-bold' : 'hover:bg-gray-800 text-gray-400'
            }`}
            onClick={() => setActiveTab('umumiy')}
          >
            Umumiy
          </button>
          <button 
            className={`w-1/2 p-3 flex justify-center rounded-xl transition-colors ${
              activeTab === 'yakunlanganlar' ? 'bg-red-600 font-bold' : 'hover:bg-gray-800 text-gray-400'
            }`}
            onClick={() => setActiveTab('yakunlanganlar')}
          >
            Yakunlanganlar
          </button>
        </div>

        <div className='flex flex-col gap-2 relative z-10'>
          {topUsers.length === 0 ? (
            <div className="text-gray-400 text-center py-4">Hozircha reytingda hech kim yoq</div>
          ) : (
            topUsers.map((user, index) => (
              <div 
                key={user.telegram_id || index}
                className={`bg-gray-900 rounded-xl flex justify-between items-center p-4 transition-all hover:bg-gray-800 hover:scale-[1.01] ${
                  index === 0 ? 'border-l-4 border-yellow-400' : 'border-l-4 border-transparent'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <div className={`relative ${index < 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                    <CgProfile size={30} />
                    {index === 0 && (
                      <FaCrown className="absolute -top-2 -right-2 text-yellow-400" size={16} />
                    )}
                  </div>
                  <div>
                    <div className='font-bold flex items-center gap-2'>
                      {user.name || `Foydalanuvchi ${index + 1}`}
                      {index < 3 && (
                        <FaMedal className={`${
                          index === 0 ? 'text-yellow-400' : 
                          index === 1 ? 'text-gray-300' : 
                          'text-amber-600'
                        }`} />
                      )}
                    </div>
                    <div className='text-gray-400 text-sm flex items-center gap-1'>
                      <FaFire className="text-red-500" /> {user.points || 0} ball
                    </div>
                  </div>
                </div>
                <div className='font-bold flex items-center gap-3'>
                  <span className={index < 3 ? 'text-red-500' : 'text-gray-400'}>
                    #{index + 1}
                  </span>
                  <span className="text-gray-400 text-sm">{user.rank || index + 1} orin</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Current user */}
        {currentUser ? (
          <div className="bg-gray-900 rounded-xl p-4 mt-2 relative z-10 border border-gray-800">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Sizning statistikangiz</h3>
              <div className="text-red-500 flex items-center gap-1 text-sm">
                <FaFire /> {currentUser.points} ball
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-600 to-red-400 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (currentUser.points / 100) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>#{currentUser.rank} reytingda</span>
              <span>{currentUser.streak || 0} kun</span>
            </div>
          </div>
        ) : telegramId ? (
          <div className="bg-gray-900 rounded-xl p-4 mt-2 relative z-10 border border-gray-800">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Sizning statistikangiz</h3>
              <div className="text-red-500 flex items-center gap-1 text-sm">
                <FaFire /> 0 ball
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-red-600 to-red-400 h-2 rounded-full w-0"></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>Reytingda emas</span>
              <span>0 kun</span>
            </div>
          </div>
        ) : null}
      </div>
      <Navbar />
    </div>
  );
}
