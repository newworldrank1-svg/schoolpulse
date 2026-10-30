'use client';

import React, { useState } from 'react';
import { 
  Play, BookOpen, Trophy, MessageSquare, Gamepad2, 
  Moon, Sun, Send, Sparkles, UserCheck, Shield, Award, 
  Calendar, CheckCircle2, ChevronRight, LogOut, Bell 
} from 'lucide-react';

export default function SchoolPulseApp() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeRole, setActiveRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [activeTab, setActiveTab] = useState<'stream' | 'homework' | 'tutor' | 'roblox' | 'events' | 'messages'>('stream');

  // AI Tutor State
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [tutorGrade, setTutorGrade] = useState('8th Grade');
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'tutor'; text: string }[]>([
    { sender: 'tutor', text: "Hello! I'm your Socratic AI Tutor. What homework concept can we break down together today?" }
  ]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Homework state
  const [homeworkSubmitted, setHomeworkSubmitted] = useState(false);

  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuestion.trim() || isEvaluating) return;

    const userMsg = tutorQuestion;
    setChatLog(prev => [...prev, { sender: 'user', text: userMsg }]);
    setTutorQuestion('');
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentQuestion: userMsg, gradeLevel: tutorGrade })
      });
      const data = await res.json();
      if (data.success) {
        setChatLog(prev => [...prev, { sender: 'tutor', text: data.reply }]);
      } else {
        setChatLog(prev => [...prev, { sender: 'tutor', text: "Let's look at this another way. Can you tell me what you've tried so far?" }]);
      }
    } catch {
      setChatLog(prev => [...prev, { sender: 'tutor', text: "Hmm, connection hiccup! Let's break down the first step of your problem together." }]);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} min-h-screen font-sans transition-colors duration-200`}>
      
      {/* Top Navbar */}
      <header className={`border-b ${darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/80'} backdrop-blur sticky top-0 z-50 px-4 lg:px-8 py-3 flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl font-black text-xl tracking-wider shadow-lg shadow-indigo-500/30">
            SP
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">SchoolPulse</h1>
            <p className="text-xs text-indigo-400 font-medium">K-12 Community Hub & Learning Portal</p>
          </div>
        </div>

        {/* Role Selector Badges */}
        <div className={`hidden md:flex items-center space-x-1 p-1 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <button 
            onClick={() => setActiveRole('student')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeRole === 'student' ? 'bg-indigo-600 text-white shadow' : 'opacity-70 hover:opacity-100'}`}
          >
            Student View
          </button>
          <button 
            onClick={() => setActiveRole('teacher')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeRole === 'teacher' ? 'bg-indigo-600 text-white shadow' : 'opacity-70 hover:opacity-100'}`}
          >
            Teacher View
          </button>
          <button 
            onClick={() => setActiveRole('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeRole === 'admin' ? 'bg-indigo-600 text-white shadow' : 'opacity-70 hover:opacity-100'}`}
          >
            Admin Portal
          </button>
        </div>

        {/* Utilities */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-800 text-amber-400 hover:bg-slate-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'} transition-all`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className={`hidden sm:flex items-center space-x-2 pl-3 border-l ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
              {activeRole === 'student' ? 'JS' : activeRole === 'teacher' ? 'MR' : 'AD'}
            </div>
            <div className="text-left text-xs">
              <p className="font-bold capitalize">{activeRole} Portal</p>
              <p className="text-indigo-400">Online & Synced</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Sub-Bar */}
      <nav className={`border-b ${darkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white/40'} px-4 lg:px-8 py-2 overflow-x-auto flex space-x-2`}>
        {[
          { id: 'stream', label: 'Morning Stream', icon: Play },
          { id: 'homework', label: 'Homework Hub', icon: BookOpen },
          { id: 'tutor', label: 'Socratic AI Tutor', icon: Sparkles },
          { id: 'roblox', label: '3D Game Lab', icon: Gamepad2 },
          { id: 'events', label: 'Events & Honor Roll', icon: Trophy },
          { id: 'messages', label: 'Direct Messages', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Content Body */}
      <main className="max-w-7xl mx-auto p-4 lg:p-8">

        {/* 1. MORNING STREAM TAB */}
        {activeTab === 'stream' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xl`}>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold border border-rose-500/20 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>LIVE MORNING BROADCAST</span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-black">Episode 42: Fall Science Fair Kickoff & Spirit Week</h2>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Hosted by Principal Vance & Student Council President Maya. Tune in for today's lunch menu, club updates, and championship game schedules!
                  </p>
                  
                  {/* Stream Video Player Frame */}
                  <div className="aspect-video w-full rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-slate-900/60"></div>
                    <button className="z-10 w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-500/50 group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-white ml-1" />
                    </button>
                    <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-2 text-xs font-semibold bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700 backdrop-blur">
                      <Bell className="w-4 h-4 text-indigo-400" />
                      <span>Live Chat Active (1,240 Viewers)</span>
                    </div>
                  </div>
                </div>

                {/* Live Announcements Sidebar */}
                <div className={`lg:w-80 p-5 rounded-xl border ${darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'} flex flex-col justify-between space-y-4`}>
                  <div>
                    <h3 className="font-bold text-sm mb-3 flex items-center justify-between">
                      <span>School Announcements</span>
                      <Calendar className="w-4 h-4 text-indigo-400" />
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className={`p-3 rounded-lg border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <span className="text-indigo-400 font-bold block mb-1">Today @ 3:30 PM</span>
                        <p className="font-medium">Robotics Club regional build session in Lab B.</p>
                      </div>
                      <div className={`p-3 rounded-lg border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <span className="text-amber-400 font-bold block mb-1">Friday Deadline</span>
                        <p className="font-medium">Quarter 1 Honor Roll photo submissions due to advisors.</p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20">
                    View Full Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. HOMEWORK HUB TAB */}
        {activeTab === 'homework' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Digital Homework Hub</h2>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Submit assignments and get AI-guided Socratic hints.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                3 Pending Assignments
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Algebra II: Quadratic Equations', teacher: 'Mr. Henderson', due: 'Tomorrow, 11:59 PM', status: 'Pending' },
                { title: 'AP Chemistry Lab Report', teacher: 'Dr. Sterling', due: 'Oct 28, 3:00 PM', status: 'Submitted' },
                { title: 'World History Essay Outline', teacher: 'Ms. Davis', due: 'Oct 30, 8:00 AM', status: 'Pending' }
              ].map((hw, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4 shadow-xl flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${hw.status === 'Submitted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {hw.status}
                      </span>
                      <span className="text-xs text-indigo-400 font-semibold">{hw.due}</span>
                    </div>
                    <h3 className="font-bold text-base">{hw.title}</h3>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Teacher: {hw.teacher}</p>
                  </div>
                  
                  <div className="pt-2 flex items-center space-x-2">
                    <button 
                      onClick={() => setHomeworkSubmitted(true)}
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
                    >
                      {homeworkSubmitted && i === 0 ? 'Resubmit Work' : 'Upload Assignment'}
                    </button>
                    <button 
                      onClick={() => setActiveTab('tutor')}
                      className={`p-2 rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-800 text-indigo-400 hover:bg-slate-700' : 'border-slate-300 bg-slate-100 text-indigo-600 hover:bg-slate-200'} transition-all`}
                      title="Ask Socratic AI Tutor"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SOCRATIC AI TUTOR TAB */}
        {activeTab === 'tutor' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xl flex flex-col h-[650px]`}>
              
              {/* Tutor Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-black text-lg">SchoolPulse Socratic AI Tutor</h2>
                    <p className="text-xs text-indigo-400">Powered by Gemini 2.5 Flash • Guiding your understanding</p>
                  </div>
                </div>

                <select 
                  value={tutorGrade} 
                  onChange={(e) => setTutorGrade(e.target.value)}
                  className={`text-xs font-bold px-3 py-2 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'} outline-none`}
                >
                  <option>6th Grade</option>
                  <option>7th Grade</option>
                  <option>8th Grade</option>
                  <option>Freshman (9th)</option>
                  <option>Sophomore (10th)</option>
                  <option>Junior/Senior (AP)</option>
                </select>
              </div>

              {/* Chat Log Window */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
                {chatLog.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20' 
                        : darkMode ? 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none' : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isEvaluating && (
                  <div className="flex justify-start">
                    <div className={`p-4 rounded-2xl text-xs ${darkMode ? 'bg-slate-800 text-indigo-400' : 'bg-slate-100 text-indigo-600'} animate-pulse flex items-center space-x-2`}>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Generating Socratic guidance...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleAskTutor} className="pt-4 border-t border-slate-800 flex items-center space-x-2">
                <input 
                  type="text" 
                  value={tutorQuestion}
                  onChange={(e) => setTutorQuestion(e.target.value)}
                  placeholder="Ask a question about your homework or concept..."
                  className={`flex-1 px-4 py-3 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    darkMode 
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'
                  }`}
                />
                <button 
                  type="submit"
                  disabled={isEvaluating}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
                >
                  <span>Ask AI</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 4. 3D GAME LAB TAB */}
        {activeTab === 'roblox' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xl`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                    <Gamepad2 className="w-4 h-4" />
                    <span>IMMERSIVE 3D SIMULATION LAB</span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-black">SchoolPulse 3D Sim Portal</h2>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Launch directly into interactive virtual reality modules for chemistry molecular bonding, historical Rome exploration, and physics velocity tracks.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <a 
                      href="roblox://navigation/game-launch?placeId=12345678"
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center space-x-2"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      <span>Launch 3D Chemistry Sim</span>
                    </a>
                    <a 
                      href="roblox://navigation/game-launch?placeId=87654321"
                      className={`px-5 py-2.5 rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-white' : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-900'} text-xs font-bold transition-all`}
                    >
                      Browse All Simulation Worlds
                    </a>
                  </div>
                </div>
                <div className="w-full md:w-80 aspect-video rounded-xl bg-gradient-to-tr from-purple-900/50 to-indigo-900/50 border border-purple-500/20 flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <Gamepad2 className="w-12 h-12 text-purple-400 animate-bounce" />
                  <span className="font-bold text-sm">Protocol Link Ready</span>
                  <p className="text-[11px] text-slate-400">Launches client desktop or mobile application.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. EVENTS & HONOR ROLL TAB */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black">School Honor Roll & Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xl space-y-4`}>
                <div className="flex items-center space-x-3">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  <h3 className="font-bold text-lg">Principal's Honor Roll (Q1)</h3>
                </div>
                <div className="space-y-3">
                  {['Marcus Vance (Grade 8)', 'Sophia Patel (Grade 7)', 'Devon Miller (Grade 8)'].map((student, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">#{idx+1}</span>
                        <span className="font-semibold text-xs">{student}</span>
                      </div>
                      <span className="text-xs text-emerald-400 font-bold">4.0 GPA</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xl space-y-4`}>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-indigo-400" />
                  <h3 className="font-bold text-lg">Upcoming Varsity Schedule</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { event: 'Home Basketball vs. Westview', time: 'Friday @ 6:00 PM', location: 'Main Gymnasium' },
                    { event: 'Fall Science Fair Showcase', time: 'Next Tuesday @ 4:30 PM', location: 'Auditorium' }
                  ].map((ev, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border flex flex-col justify-between space-y-1 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="font-bold text-xs">{ev.event}</span>
                      <div className="flex items-center justify-between text-[11px] text-indigo-400">
                        <span>{ev.time}</span>
                        <span>{ev.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. MESSAGING TAB */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xl h-[550px] flex flex-col items-center justify-center text-center space-y-3`}>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="font-black text-xl">Secure School Messaging</h3>
              <p className={`text-xs max-w-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Direct teacher-student-parent channels with built-in content filtering and audit logs.
              </p>
              <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30">
                Start New Thread
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}