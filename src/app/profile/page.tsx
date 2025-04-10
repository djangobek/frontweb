'use client';

import React from 'react';
import { ChevronRight,  Trophy, Clock,} from 'lucide-react';
import { FaFire, FaMedal } from 'react-icons/fa';
import Navbar from '../components/navbar';
const ProfilePage = () => {
  // User data
  const user = {
    name: "<>maqsat</> 👨‍💻",
    initials: "M",
    streak: 15,
    level: 3,
    points: 1245
  };

  // Achievements data
  const achievements = [
    { 
      title: "Early Bird", 
      date: '01 Mart, 2025',
      unlocked: true
    },
    { 
      title: "Marathon Runner", 
      date: '05 Mart, 2025',
      unlocked: true
    },
    { 
      title: "Book Worm", 
      date: 'Coming soon',
      unlocked: false
    },
    { 
      title: "Iron Will", 
      date: 'Coming soon',
      unlocked: false
    }
  ];

  return (
    React.createElement('div', { className: 'bg-black text-white min-h-screen' },
      React.createElement('div', { className: 'px-4 pt-6 pb-20' },
        // Header


        // Profile Section
        React.createElement('div', { className: 'bg-[#1E1E1E] rounded-xl p-4 mb-6' },
          React.createElement('div', { className: 'flex items-center gap-4' },
            React.createElement('div', { className: 'bg-gradient-to-br from-red-600 to-red-900 rounded-full w-14 h-14 flex items-center justify-center text-white font-bold text-xl' },
              user.initials
            ),
            React.createElement('div', null,
              React.createElement('h1', { className: 'text-white font-semibold text-lg' }, user.name),
              React.createElement('p', { className: 'text-gray-400 text-sm' }, 'maqsat30 member')
            )
          ),
          
          // Stats
          React.createElement('div', { className: 'grid grid-cols-3 gap-2 mt-4' },
            React.createElement('div', { className: 'bg-gray-900 rounded-lg p-2 text-center' },
              React.createElement(FaFire, { className: 'text-red-500 mx-auto mb-1' }),
              React.createElement('p', { className: 'text-xs text-gray-400' }, 'Current Streak'),
              React.createElement('p', { className: 'text-sm font-semibold' }, `${user.streak} days`)
            ),
            React.createElement('div', { className: 'bg-gray-900 rounded-lg p-2 text-center' },
              React.createElement(Trophy, { className: 'text-yellow-400 mx-auto mb-1', size: 18 }),
              React.createElement('p', { className: 'text-xs text-gray-400' }, 'Level'),
              React.createElement('p', { className: 'text-sm font-semibold' }, user.level)
            ),
            React.createElement('div', { className: 'bg-gray-900 rounded-lg p-2 text-center' },
              React.createElement(FaMedal, { className: 'text-blue-400 mx-auto mb-1' }),
              React.createElement('p', { className: 'text-xs text-gray-400' }, 'Total Points'),
              React.createElement('p', { className: 'text-sm font-semibold' }, user.points)
            )
          )
        ),
        // Settings Options
        React.createElement('div', { className: 'bg-[#1E1E1E] rounded-xl mb-6' },
          React.createElement('button', { className: 'p-4 w-full flex justify-between items-center hover:bg-gray-800 transition-colors border-b border-gray-700' },
            React.createElement('span', { className: 'text-sm text-white font-medium' }, 'Edit Profile'),
            React.createElement(ChevronRight, { className: 'text-gray-500 w-4 h-4' })
          ),
          React.createElement('button', { className: 'p-4 w-full flex justify-between items-center hover:bg-gray-800 transition-colors border-b border-gray-700' },
            React.createElement('span', { className: 'text-sm text-white font-medium' }, 'Notification Settings'),
            React.createElement(ChevronRight, { className: 'text-gray-500 w-4 h-4' })
          ),
          React.createElement('button', { className: 'p-4 w-full flex justify-between items-center hover:bg-gray-800 transition-colors' },
            React.createElement('span', { className: 'text-sm text-white font-medium' }, 'FAQ & Help'),
            React.createElement(ChevronRight, { className: 'text-gray-500 w-4 h-4' })
          )
        ),

        // Achievements Section
        React.createElement('div', { className: 'mb-6' },
          React.createElement('div', { className: 'flex justify-between items-center mb-3' },
            React.createElement('h2', { className: 'text-white font-semibold text-lg flex items-center gap-2' },
              React.createElement(Trophy, { className: 'text-yellow-400', size: 20 }),
              'Yutuqlar'
            ),
            React.createElement('button', { className: 'text-gray-400 text-sm flex items-center' },
              'See all ',
              React.createElement(ChevronRight, { className: 'ml-1 w-4 h-4' })
            )
          ),
          
          React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
            achievements.map((item, index) => (
              React.createElement('div', {
                key: index,
                className: `rounded-xl p-3 text-center ${item.unlocked ? 'bg-[#1E1E1E]' : 'bg-gray-900 opacity-60'}`
              },
                React.createElement('div', {
                  className: `rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2 ${item.unlocked ? 'bg-red-900/30' : 'bg-gray-800'}`
                },
                  item.unlocked
                    ? React.createElement(Trophy, { className: 'text-yellow-400', size: 18 })
                    : React.createElement(Clock, { className: 'text-gray-500', size: 18 })
                ),
                React.createElement('h3', {
                  className: `text-sm font-semibold ${item.unlocked ? 'text-white' : 'text-gray-500'}`
                }, item.title),
                React.createElement('p', { className: 'text-xs mt-1 text-gray-400' }, item.date)
              )
            ))
          )
        ), // <-- to'g'ri yopish
        // Bottom Navigation
        <Navbar />
      )
    )
  );
}

export default ProfilePage;
