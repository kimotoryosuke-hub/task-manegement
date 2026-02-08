import React, { useState } from 'react';
import { Plus, Trash2, Check, LayoutGrid } from 'lucide-react';

const TodoList = ({ tasks, onAdd, onToggle, onDelete, onUpdateQuadrant }) => {
    const [newTask, setNewTask] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        onAdd(newTask.trim());
        setNewTask('');
    };

    const getQuadrantLabel = (q) => {
        switch (q) {
            case 1: return { text: 'Do First', color: 'var(--danger)' };
            case 2: return { text: 'Schedule', color: 'var(--accent-primary)' };
            case 3: return { text: 'Delegate', color: 'var(--warning)' };
            case 4: return { text: 'Don\'t Do', color: 'var(--text-secondary)' };
            default: return { text: 'Inbox', color: 'var(--text-secondary)' };
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What needs to be done?"
                    style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--glass-border)',
                        background: 'rgba(30, 41, 59, 0.5)',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none',
                        backdropFilter: 'blur(5px)'
                    }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
                    <Plus size={24} />
                </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tasks.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        <p>No tasks yet. Add one to get started!</p>
                    </div>
                ) : (
                    tasks.map(task => {
                        const qInfo = getQuadrantLabel(task.quadrant);
                        return (
                            <div
                                key={task.id}
                                className="card"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    gap: '1rem',
                                    opacity: task.completed ? 0.7 : 1,
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <button
                                    onClick={() => onToggle(task.id)}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        border: `2px solid ${task.completed ? 'var(--success)' : 'var(--text-secondary)'}`,
                                        background: task.completed ? 'var(--success)' : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                        flexShrink: 0
                                    }}
                                >
                                    {task.completed && <Check size={14} />}
                                </button>

                                <div style={{ flex: 1 }}>
                                    <span style={{
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                                        fontSize: '1.1rem',
                                        display: 'block'
                                    }}>
                                        {task.text}
                                    </span>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: qInfo.color,
                                            border: `1px solid ${qInfo.color}`,
                                            padding: '0.1rem 0.5rem',
                                            borderRadius: '1rem'
                                        }}>
                                            {qInfo.text}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ position: 'relative', display: 'flex', gap: '0.5rem' }}>
                                    {/* Simple quadrant selector */}
                                    <select
                                        value={task.quadrant || 0}
                                        onChange={(e) => onUpdateQuadrant(task.id, parseInt(e.target.value))}
                                        style={{
                                            background: 'transparent',
                                            color: 'var(--text-secondary)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: 'var(--radius-sm)',
                                            padding: '0.25rem',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        <option value="0">Inbox</option>
                                        <option value="1">Urgent & Important</option>
                                        <option value="2">Not Urgent & Important</option>
                                        <option value="3">Urgent & Not Important</option>
                                        <option value="4">Not Urgent & Not Important</option>
                                    </select>

                                    <button
                                        onClick={() => onDelete(task.id)}
                                        className="btn-danger"
                                        style={{
                                            padding: '0.5rem',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer'
                                        }}
                                        aria-label="Delete task"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TodoList;
