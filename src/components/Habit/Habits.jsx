import React, { useState, useMemo } from 'react';
import HabitItem from './HabitItem';
import HabitProgressRing from './HabitProgressRing';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const Habits = ({ habits, onToggle, onAdd, onDelete }) => {
    const [inputValue, setInputValue] = useState('');

    // Calculate current week's dates
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon, ...
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek; // Adjust so week starts on Monday

    const weekDates = useMemo(() => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + mondayOffset + i);
            dates.push(d);
        }
        return dates;
    }, [today.getDate()]); // Recalculate if date changes

    const currentDayIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // 0 = Mon, 6 = Sun

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onAdd(inputValue);
            setInputValue('');
        }
    };

    const getDayProgress = (dateStr) => {
        if (habits.length === 0) return 0;
        const completedCount = habits.filter(h => h.history && h.history[dateStr]).length;
        return (completedCount / habits.length) * 100;
    };

    const weekDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', paddingBottom: '2rem' }}>

            {/* Weekly Header with Progress Rings */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 2rem', // Align with habit items
                marginLeft: 'auto', // Push right to align with checkboxes
                width: 'fit-content', // Only take necessary width
                gap: '0.75rem' // Match gap in HabitItem
            }}>
                {/* Spacer to align with text part of habit item if we wanted perfect alignment,
             but per design, the header is just the dates/rings.
             Let's put the whole header in a container that emulates the right side of the habit item. 
         */}
            </div>

            {/* Better Header Implementation to match screenshot */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end', // Align to right side
                paddingRight: '1.25rem', // Match card padding
                marginBottom: '1rem'
            }}>
                <div style={{ display: 'flex', gap: '0.75rem', width: 'fit-content' }}>
                    {weekDates.map((date, index) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const progress = getDayProgress(dateStr);
                        const isToday = index === currentDayIndex;

                        return (
                            <div key={dateStr} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                width: '40px'
                            }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: isToday ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    fontWeight: isToday ? 'bold' : 'normal'
                                }}>
                                    {weekDayNames[index]}
                                </span>
                                <span style={{
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    color: isToday ? 'var(--accent-primary)' : 'var(--text-primary)'
                                }}>
                                    {date.getDate()}
                                </span>
                                <HabitProgressRing
                                    radius={20}
                                    stroke={3}
                                    progress={progress}
                                    color={isToday ? 'var(--accent-primary)' : 'var(--glass-border)'}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>


            {/* Add Habit Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
                <div style={{
                    display: 'flex',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '24px',
                    padding: '0.5rem',
                    backdropFilter: 'blur(10px)'
                }}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Add a new habit..."
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            padding: '1rem',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            borderRadius: '20px',
                            width: '50px',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '0.5rem'
                        }}
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </form>

            {/* Habits List */}
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
                {habits.map(habit => (
                    <HabitItem
                        key={habit.id}
                        habit={habit}
                        weekDates={weekDates}
                        onToggle={onToggle}
                        currentDayIndex={currentDayIndex}
                    />
                ))}
                {habits.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '4rem' }}>
                        <p>No habits yet. Start building your routine!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Habits;
