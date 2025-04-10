"use client";

import { useState } from 'react';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { FaChevronLeft, FaChevronRight, FaCheck } from 'react-icons/fa';
import { IoIosArrowDown } from "react-icons/io";
import Navbar from '../components/navbar';
import { ReactNode } from 'react'

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type Todos = {
  [key: string]: Todo[];
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [todos, setTodos] = useState<Todos>({
    '2024-04-07': [
      { id: 1, text: 'Yugurish', completed: true },
      { id: 2, text: 'Kitob o\'qish', completed: false },
      { id: 3, text: 'Dars qilish', completed: true }
    ],
    '2024-04-08': [
      { id: 1, text: 'Suzish', completed: false },
      { id: 2, text: 'Kod yozish', completed: false }
    ],
    '2024-04-15': [
      { id: 1, text: 'Dam olish', completed: false }
    ]
  });

  // Kalendar render qilish
  const renderCalendar = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const rows: ReactNode[] = []
    let days: ReactNode[] = []
    const day = new Date(startDate);

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(day); // Yangi reference yaratamiz
        const dayKey = format(currentDay, 'yyyy-MM-dd');
        const dayTodos = todos[dayKey] ||  [];
        const isCurrentMonth = isSameMonth(currentDay, monthStart);
        const isSelected = isSameDay(currentDay, selectedDate);

        days.push(
          <div
            key={currentDay.toString()}
            className={`h-12 flex flex-col items-center justify-start p-1 m-1 rounded-lg cursor-pointer transition-all duration-200 ${
              !isCurrentMonth ? 'text-gray-600' : 'text-white'
            } ${
              isSelected ? 'bg-red-600 border-2 border-white' : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => {
              setSelectedDate(new Date(currentDay));
            }}
          >
            <span className="text-sm">{format(currentDay, 'd')}</span>
            {dayTodos.length > 0 && (
              <div className="flex space-x-1 mt-1">
                {dayTodos.slice(0, 3).map(todo => (
                  <span 
                    key={todo.id} 
                    className={`w-1 h-1 rounded-full ${todo.completed ? 'bg-green-400' : 'bg-red-400'}`}
                  ></span>
                ))}
              </div>
            )}
          </div>
        );
        day.setDate(day.getDate() + 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  };

  // Todo holatini o'zgartirish
  const toggleTodo = (dateKey: string, todoId: number): void => {
    setTodos(prev => ({
      ...prev,
      [dateKey]: prev[dateKey]?.map(todo => 
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      ) || []
    }));
  };

  // Oy o'zgartirish
  const changeMonth = (delta: number): void => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  // Tanlangan sanadagi todolar
  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const currentTodos = todos[selectedDateKey] || [];
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 p-4">
        {/* Kalendar header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-red-500">•</span> Kalendar
          </h1>
          <div className="flex border-none rounded-xl bg-gray-800 items-center p-2 gap-3 cursor-pointer hover:bg-gray-700">
            <span>Challenge tanlang</span>
            <IoIosArrowDown />
          </div>
        </div>

        {/* Kalendar kontrolleri */}
        <div className="flex items-center justify-between mb-4 px-2">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <FaChevronLeft />
          </button>
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button 
            onClick={() => changeMonth(1)}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Hafta kunlari */}
        <div className="grid grid-cols-7 text-center text-gray-400 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="py-1">{day}</div>
          ))}
        </div>

        {/* Kalendar */}
        <div className="mb-6">
          {renderCalendar()}
        </div>

        {/* Tanlangan sana va todolar */}
        <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3">
            {format(selectedDate, 'MMMM d, yyyy')}
          </h3>

          {/* Todo ro'yxati */}
          <div className="space-y-2">
            {currentTodos.length > 0 ? (
              currentTodos.map(todo => (
                <div 
                  key={todo.id} 
                  className="flex items-center justify-between bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <span className={`${todo.completed ? 'line-through text-gray-400' : ''}`}>
                    {todo.text}
                  </span>
                  <button
                    onClick={() => toggleTodo(selectedDateKey, todo.id)}
                    className={`p-1 rounded-full ${todo.completed ? 'text-green-400' : 'text-gray-400'}`}
                  >
                    <FaCheck />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">Bu kunda vazifalar yo`q</p>
            )}
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
}