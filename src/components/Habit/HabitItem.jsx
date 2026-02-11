import React from 'react';
import { Check, Flame, Zap } from 'lucide-react';

const HabitItem = ({ habit, weekDates, onToggle, currentDayIndex }) => {
    // Simple streak calculation (consecutive days ending on or immediately before "today")
    // For a real app, you'd calculate this based on history. 
    // Here we just mock it or calculate based on the current week's continuous checks.

    const getStreak = () => {
        // Basic streak logic for this week view
        let streak = 0;
        // Walk backwards from today
        for (let i = currentDayIndex; i >= 0; i--) {
            const dateStr = weekDates[i].toISOString().split('T')[0];
            if (habit.history[dateStr]) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    const currentStreak = getStreak();

    return (
        <div className="card" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem',
            marginBottom: '1rem',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            transition: 'transform 0.2s',
            borderRadius: '24px' // More rounded as per design
        }}>
            {/* Left: Icon & Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                {/* Habit Icon/Avatar */}
                <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: habit.color || 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                    {habit.icon || '📝'}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                        {habit.title}
                    </span>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Zap size={14} color="#fbbf24" fill="#fbbf24" />
                            {currentStreak} days
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Flame size={14} color="#f87171" />
                            0 days {/* Best streak not implemented yet */}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Weekly Checkboxes */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {weekDates.map((date, index) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const isCompleted = habit.history && habit.history[dateStr];
                    const isToday = index === currentDayIndex;

                    return (
                        <button
                            key={dateStr}
                            onClick={() => onToggle(habit.id, dateStr)}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: 'none',
                                background: isCompleted ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                color: 'white',
                                boxShadow: isCompleted ? '0 2px 8px rgba(99, 102, 241, 0.4)' : 'none'
                            }}
                            title={date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        >
                            {isCompleted && <Check size={20} />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default HabitItem;
