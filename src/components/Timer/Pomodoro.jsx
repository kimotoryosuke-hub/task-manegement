import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

const MODES = {
    work: { label: 'Focus', time: 25 * 60, color: 'var(--accent-primary)' },
    short: { label: 'Short Break', time: 5 * 60, color: 'var(--success)' },
    long: { label: 'Long Break', time: 15 * 60, color: 'var(--accent-secondary)' }
};

const Pomodoro = ({ tasks, onToggle }) => {
    const [mode, setMode] = useState('work');
    const [timeLeft, setTimeLeft] = useState(MODES.work.time);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            handleComplete();
        }

        return () => clearInterval(timerRef.current);
    }, [isRunning, timeLeft]);

    const handleComplete = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#a855f7', '#22c55e']
        });

        // Optional: Play sound here if assets available
    };

    const toggleTimer = () => setIsRunning(!isRunning);

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(MODES[mode].time);
    };

    const changeMode = (newMode) => {
        setMode(newMode);
        setIsRunning(false);
        setTimeLeft(MODES[newMode].time);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Calculate progress for circle
    const totalTime = MODES[mode].time;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    const radius = 120;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const [selectedTaskId, setSelectedTaskId] = useState('');

    // Filter out completed tasks for the dropdown
    const availableTasks = tasks ? tasks.filter(t => !t.completed) : [];
    const selectedTask = tasks ? tasks.find(t => t.id === parseInt(selectedTaskId)) : null;

    return (
        <div className="animate-fade-in" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '600px',
            margin: '0 auto'
        }}>

            {/* Mode Selectors */}
            <div
                className="card"
                style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.5rem',
                    marginBottom: '2rem',
                    borderRadius: '2rem'
                }}
            >
                {Object.keys(MODES).map((k) => (
                    <button
                        key={k}
                        onClick={() => changeMode(k)}
                        style={{
                            padding: '0.5rem 1.5rem',
                            borderRadius: '2rem',
                            border: 'none',
                            background: mode === k ? MODES[k].color : 'transparent',
                            color: mode === k ? 'white' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {MODES[k].label}
                    </button>
                ))}
            </div>

            {/* Task Selector */}
            <div style={{ marginBottom: '2rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <select
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--glass-border)',
                        background: 'rgba(30, 41, 59, 0.5)',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none',
                        marginBottom: '1rem'
                    }}
                >
                    <option value="">Select a task to focus on...</option>
                    {availableTasks.map(t => (
                        <option key={t.id} value={t.id}>{t.text}</option>
                    ))}
                </select>

                {selectedTask && (
                    <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{selectedTask.text}</span>
                        <button
                            onClick={() => {
                                onToggle(selectedTask.id);
                                setSelectedTaskId(''); // Clear selection on complete
                            }}
                            className="btn"
                            style={{
                                background: 'var(--success)',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem'
                            }}
                        >
                            Complete
                        </button>
                    </div>
                )}
            </div>

            {/* Timer Display */}
            <div style={{ position: 'relative', width: radius * 2, height: radius * 2, marginBottom: '2rem' }}>
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    style={{ transform: 'rotate(-90deg)' }}
                >
                    <circle
                        stroke="var(--bg-secondary)"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        fill="transparent"
                    />
                    <circle
                        stroke={MODES[mode].color}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        fill="transparent"
                    />
                </svg>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '3.5rem',
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--text-primary)'
                }}>
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    onClick={toggleTimer}
                    className="btn"
                    style={{
                        background: isRunning ? 'var(--bg-secondary)' : MODES[mode].color,
                        color: 'white',
                        padding: '1rem 2rem',
                        fontSize: '1.2rem',
                        borderRadius: '2rem',
                        boxShadow: isRunning ? 'none' : `0 0 20px ${MODES[mode].color}60`
                    }}
                >
                    {isRunning ? <Pause size={28} /> : <Play size={28} />}
                </button>

                <button
                    onClick={resetTimer}
                    className="btn"
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        padding: 0
                    }}
                >
                    <RotateCcw size={24} />
                </button>
            </div>
        </div>
    );
};

export default Pomodoro;
