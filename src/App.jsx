import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, Grid, LayoutDashboard } from 'lucide-react';
import './styles/index.css';

import TodoList from './components/Todo/TodoList';
import Pomodoro from './components/Timer/Pomodoro';
import Matrix from './components/Matrix/EisenhowerMatrix';

function App() {
  const [activeTab, setActiveTab] = useState('todo');
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    const task = {
      id: Date.now(),
      text,
      completed: false,
      quadrant: 0, // 0 = Inbox/Uncategorized
      createdAt: new Date().toISOString()
    };
    setTasks([task, ...tasks]);
  };

  const playCompletionSound = () => {
    // Simple "ding" sound using Oscillator to avoid external assets
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        if (!t.completed) playCompletionSound();
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTaskQuadrant = (id, quadrant) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, quadrant } : t
    ));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'todo': return <TodoList tasks={tasks} onAdd={addTask} onToggle={toggleTask} onDelete={deleteTask} onUpdateQuadrant={updateTaskQuadrant} />;
      case 'timer': return <Pomodoro tasks={tasks} onToggle={toggleTask} />;
      case 'matrix': return <Matrix tasks={tasks} onUpdateQuadrant={updateTaskQuadrant} onToggle={toggleTask} onDelete={deleteTask} />;
      default: return <TodoList tasks={tasks} onAdd={addTask} onToggle={toggleTask} onDelete={deleteTask} onUpdateQuadrant={updateTaskQuadrant} />;
    }
  };

  return (
    <div className="app-container">
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '80px',
        padding: '2rem 0',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid var(--glass-border)'
      }}>

        {/* Dummy Profile Icon */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ width: '20px', height: '20px', background: 'currentColor', borderRadius: '50%', opacity: 0.5 }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', alignItems: 'center' }}>
          <button
            className={`btn`}
            onClick={() => setActiveTab('todo')}
            style={{
              color: activeTab === 'todo' ? 'white' : 'var(--text-secondary)',
              background: activeTab === 'todo' ? 'var(--accent-primary)' : 'transparent',
              width: '50px',
              height: '50px',
              borderRadius: '16px', // Squircle like shape
              padding: 0,
              boxShadow: activeTab === 'todo' ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none'
            }}
            title="Todo"
          >
            <CheckSquare size={24} />
          </button>

          <button
            className={`btn`}
            onClick={() => setActiveTab('matrix')} // Matrix is "Calendar" icon in user screenshot vibe
            style={{
              color: activeTab === 'matrix' ? 'white' : 'var(--text-secondary)',
              background: activeTab === 'matrix' ? 'var(--accent-primary)' : 'transparent',
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              padding: 0,
              boxShadow: activeTab === 'matrix' ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none'
            }}
            title="Matrix"
          >
            <Grid size={24} />
          </button>

          <button
            className={`btn`}
            onClick={() => setActiveTab('timer')}
            style={{
              color: activeTab === 'timer' ? 'white' : 'var(--text-secondary)',
              background: activeTab === 'timer' ? 'var(--accent-primary)' : 'transparent',
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              padding: 0,
              boxShadow: activeTab === 'timer' ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none'
            }}
            title="Timer"
          >
            <Clock size={24} />
          </button>
        </div>
      </nav>

      <main className="container" style={{
        paddingLeft: '120px', // 80px sidebar + 40px gap
        paddingTop: '2rem',
        paddingBottom: '2rem',
        maxWidth: '1400px' // Allow wider content
      }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{
            background: 'linear-gradient(to right, #818cf8, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
            fontSize: '2rem'
          }}>
            Task Master
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Focus. Organize. Achieve.</p>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}

export default App;
