import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Flag, AlignLeft, X } from 'lucide-react';

const TodoList = ({ tasks, onAdd, onToggle, onDelete, onUpdateQuadrant, onUpdateDetails }) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onAdd(inputValue);
            setInputValue('');
        }
    };

    const selectedTask = tasks.find(t => t.id === selectedTaskId);

    return (
        <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 200px)' }}>
            {/* Task List Section */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: '0' }}>
                <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                    <div style={{
                        display: 'flex',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.5rem',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="What needs to be done?"
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
                                borderRadius: 'var(--radius-sm)',
                                width: '50px',
                                padding: 0, // Fix: Remove padding to show icon
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Plus size={24} />
                        </button>
                    </div>
                </form>

                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {tasks.map(task => (
                        <div
                            key={task.id}
                            className="card animate-scale-in"
                            onClick={() => setSelectedTaskId(task.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1.25rem',
                                marginBottom: '1rem',
                                cursor: 'pointer',
                                border: selectedTaskId === task.id ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                                background: selectedTaskId === task.id ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass-bg)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggle(task.id);
                                    }}
                                    style={{
                                        background: 'transparent',
                                        border: `2px solid ${task.completed ? 'var(--success)' : 'var(--text-secondary)'}`,
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'var(--success)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {task.completed && <div style={{ width: '14px', height: '14px', background: 'currentColor', borderRadius: '50%' }} />}
                                </button>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <span style={{
                                        color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        fontSize: '1.1rem'
                                    }}>
                                        {task.text}
                                    </span>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        {task.quadrant > 0 && (
                                            <span style={{
                                                fontSize: '0.8rem',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '1rem',
                                                background: 'rgba(255,255,255,0.1)',
                                                width: 'fit-content',
                                                color: 'var(--text-secondary)'
                                            }}>
                                                {
                                                    task.quadrant === 1 ? 'Urgent & Important' :
                                                        task.quadrant === 2 ? 'Not Urgent & Important' :
                                                            task.quadrant === 3 ? 'Urgent & Not Important' :
                                                                'Not Urgent & Not Important'
                                                }
                                            </span>
                                        )}
                                        {task.dueDate && (
                                            <span style={{
                                                fontSize: '0.8rem',
                                                color: 'var(--text-secondary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem'
                                            }}>
                                                <Calendar size={12} />
                                                {task.dueDate}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(task.id);
                                    if (selectedTaskId === task.id) setSelectedTaskId(null);
                                }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--danger)',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    opacity: 0.7,
                                    transition: 'opacity 0.2s'
                                }}
                                onMouseEnter={e => e.target.style.opacity = 1}
                                onMouseLeave={e => e.target.style.opacity = 0.7}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '4rem' }}>
                            <p>No tasks yet. Add one to get started!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Task Detail Section (Memo) */}
            {selectedTask ? (
                <div className="card" style={{
                    flex: 1,
                    maxWidth: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2rem',
                    background: 'rgba(30, 41, 59, 0.7)' // Slightly darker for contrast
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                                type="checkbox"
                                checked={selectedTask.completed}
                                onChange={() => onToggle(selectedTask.id)}
                                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--success)' }}
                            />
                            <input
                                type="text"
                                value={selectedTask.text}
                                onChange={(e) => onUpdateDetails(selectedTask.id, { text: e.target.value })}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    outline: 'none',
                                    width: '100%'
                                }}
                            />
                        </div>
                        <button onClick={() => setSelectedTaskId(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
                        {/* Memo Field */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                <AlignLeft size={18} />
                                <span>Memo / Description</span>
                            </div>
                            <textarea
                                value={selectedTask.memo || ''}
                                onChange={(e) => onUpdateDetails(selectedTask.id, { memo: e.target.value })}
                                placeholder="Add notes here..."
                                className="custom-scrollbar"
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '1rem',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    resize: 'none',
                                    outline: 'none',
                                    minHeight: '200px'
                                }}
                            />
                        </div>

                        {/* Due Date & Priority (Quick Extras) */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    <Calendar size={18} />
                                    <span>Due Date</span>
                                </div>
                                <input
                                    type="date"
                                    key={`date-${selectedTask.id}`} // Force re-mount on task change
                                    value={selectedTask.dueDate || ''}
                                    onChange={(e) => onUpdateDetails(selectedTask.id, { dueDate: e.target.value })}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '0.5rem',
                                        color: 'var(--text-primary)',
                                        outline: 'none',
                                        colorScheme: 'dark'
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    <Flag size={18} />
                                    <span>Matrix Quadrant</span>
                                </div>
                                <select
                                    value={selectedTask.quadrant || 0}
                                    onChange={(e) => onUpdateQuadrant(selectedTask.id, parseInt(e.target.value))}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '0.65rem',
                                        color: 'var(--text-primary)',
                                        outline: 'none'
                                    }}
                                >
                                    <option value={0}>Inbox</option>
                                    <option value={1}>Urgent & Important</option>
                                    <option value={2}>Not Urgent & Important</option>
                                    <option value={3}>Urgent & Not Important</option>
                                    <option value={4}>Not Urgent & Not Important</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{
                    flex: 1,
                    maxWidth: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    border: '2px dashed var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)'
                }}>
                    <p>Select a task to view details</p>
                </div>
            )}
        </div>
    );
};

export default TodoList;
