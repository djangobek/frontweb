'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaRunning, FaBook, FaSwimmer, FaFire, FaTrophy, FaClock } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';
import Navbar from './components/navbar';

const API_URL = 'http://127.0.0.1:8000/api/';

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
        showAlert: (message: string, callback?: () => void) => void;
      };
    };
  }
}

type Task = {
  id: number;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  status: boolean;
  created_at: string;
  updated_at: string;
};

export default function ChallengePage() {
  const [user, setUser] = useState<{
    id?: number;
    username?: string;
    full_name?: string;
    telegram_id?: string;
    points?: number;
    rank?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
  });

  useEffect(() => {
    const initTelegram = async () => {
      const tg = window.Telegram?.WebApp;
      
      if (!tg) {
        setAuthError("Please open in Telegram app");
        setLoading(false);
        return;
      }

      tg.expand();
      tg.ready();

      const userData = tg.initDataUnsafe?.user;
      if (userData) {
        const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
        const telegramId = String(userData.id);
        const userInfo = {
          id: userData.id,
          username: userData.username,
          full_name: fullName || userData.username || `User #${userData.id}`,
          telegram_id: telegramId,
        };
        
        setUser(userInfo);
        await fetchUserData(telegramId);
        await fetchTasks(telegramId);
      } else {
        setAuthError("User data not available");
        tg.showAlert("User data not available. Please try again.");
      }
      
      setLoading(false);
    };

    const fetchUserData = async (telegramId: string) => {
      try {
        const response = await fetch(`${API_URL}/rankings/?telegram_id=${telegramId}`);
        const data = await response.json();
        if (data.user) {
          setUser(prev => ({
            ...prev,
            points: data.user.points,
            rank: data.user.rank
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchTasks = async (telegramId: string) => {
      try {
        const response = await fetch(`${API_URL}/tasks/?telegram_id=${telegramId}`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (!window.Telegram) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = initTelegram;
      document.body.appendChild(script);
    } else {
      initTelegram();
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  const toggleTaskStatus = async (taskId: number) => {
    if (!user?.telegram_id) return;

    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;

      const response = await fetch(`${API_URL}/tasks/${taskId}/status/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_id: user.telegram_id,
          status: !taskToUpdate.status
        })
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(task => 
          task.id === taskId ? updatedTask : task
        ));
        
        // Update user points and rank
        if (updatedTask.status) {
          setUser(prev => {
            if (!prev) return null;
            const newPoints = (prev.points || 0) + 2;
            return {
              ...prev,
              points: newPoints,
              rank: Math.floor(newPoints / 10)
            };
          });
        }
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = async () => {
    if (!newTask.title.trim() || !user?.telegram_id) return;

    try {
      const response = await fetch(`${API_URL}/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_id: user.telegram_id,
          title: newTask.title,
          description: newTask.description,
          start_time: newTask.start_time || '00:00:00',
          end_time: newTask.end_time || '23:59:59'
        })
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTasks([...tasks, createdTask]);
        setNewTask({
          title: '',
          description: '',
          start_time: '',
          end_time: '',
        });
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const getIcon = (taskTitle: string) => {
    const icons: Record<string, JSX.Element> = {
      running: <FaRunning />,
      reading: <FaBook />,
      swimming: <FaSwimmer />,
    };
    
    const lowerTitle = taskTitle.toLowerCase();
    if (lowerTitle.includes('run')) return icons.running;
    if (lowerTitle.includes('read')) return icons.reading;
    if (lowerTitle.includes('swim')) return icons.swimming;
    
    return <FaFire />;
  };

  const formatTime = (timeString: string) => {
    return timeString.split(':').slice(0, 2).join(':');
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-red-900/50 p-6 rounded-xl max-w-md">
          <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-6">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto p-4">
        <header className="bg-gradient-to-r from-black via-gray-900 to-red-900 p-4 rounded-xl mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaTrophy className="text-red-500 text-2xl" />
            <div>
              <h1 className="text-xl font-bold">Daily Tasks</h1>
              {user && (
                <div>
                  <p className="text-sm text-gray-300">
                    {user.full_name || user.username || `User #${user.id}`}
                  </p>
                  <div className="flex gap-2 text-xs">
                    {user.points !== undefined && (
                      <span className="text-red-500">Points: {user.points}</span>
                    )}
                    {user.rank !== undefined && (
                      <span className="text-yellow-500">Rank: {user.rank}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl transition-colors"
          >
            <FaPlus size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No tasks yet. Add your first task!</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTaskStatus(task.id)}
                className={`p-4 rounded-xl flex justify-between items-center cursor-pointer transition-colors ${
                  task.status ? 'bg-gray-800' : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      task.status ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {getIcon(task.title)}
                  </div>
                  <div>
                    <p className="text-lg">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-gray-400">{task.description}</p>
                    )}
                    <div className="flex gap-2 text-sm text-gray-400">
                      {task.start_time && (
                        <span className="flex items-center gap-1">
                          <FaClock size={12} /> {formatTime(task.start_time)}
                        </span>
                      )}
                      {task.end_time && task.start_time && (
                        <span>- {formatTime(task.end_time)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                    task.status ? 'bg-green-500' : 'bg-gray-800'
                  }`}
                >
                  {task.status ? '✓' : '0'}
                </div>
              </div>
            ))
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-red-900">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add New Task</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <IoIosClose size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Task Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 rounded-lg p-3 border border-gray-700 focus:border-red-500 focus:outline-none"
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2">Description</label>
                  <textarea
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 rounded-lg p-3 border border-gray-700 focus:border-red-500 focus:outline-none"
                    placeholder="Enter description (optional)"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Start Time</label>
                    <input
                      type="time"
                      name="start_time"
                      value={newTask.start_time}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 rounded-lg p-3 border border-gray-700 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">End Time</label>
                    <input
                      type="time"
                      name="end_time"
                      value={newTask.end_time}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 rounded-lg p-3 border border-gray-700 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!newTask.title.trim()}
                  className={`w-full py-3 rounded-lg font-medium mt-4 transition-colors ${
                    newTask.title.trim()
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
}