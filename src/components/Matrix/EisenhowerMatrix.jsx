import React from 'react';

const EisenhowerMatrix = ({ tasks, onUpdateQuadrant, onToggle, onDelete }) => {

    const quadrants = [
        { id: 1, title: 'Urgent & Important', color: 'var(--danger)', desc: 'Do First' },
        { id: 2, title: 'Not Urgent & Important', color: 'var(--accent-primary)', desc: 'Schedule' },
        { id: 3, title: 'Urgent & Not Important', color: 'var(--warning)', desc: 'Delegate' },
        { id: 4, title: 'Not Urgent & Not Important', color: 'var(--text-secondary)', desc: 'Eliminate' }
    ];

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDrop = (e, quadrantId) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('taskId'));
        onUpdateQuadrant(taskId, quadrantId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="animate-fade-in" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            {quadrants.map(q => {
                const qTasks = tasks.filter(t => t.quadrant === q.id);
                return (
                    <div
                        key={q.id}
                        className="card"
                        onDrop={(e) => handleDrop(e, q.id)}
                        onDragOver={handleDragOver}
                        style={{
                            minHeight: '300px',
                            display: 'flex',
                            flexDirection: 'column',
                            borderTop: `4px solid ${q.color}`
                        }}
                    >
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem', color: q.color }}>{q.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{q.desc}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                            {qTasks.map(task => (
                                <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                    style={{
                                        padding: '0.75rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--glass-border)',
                                        cursor: 'move',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        opacity: task.completed ? 0.6 : 1
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => onToggle(task.id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <span style={{
                                        flex: 1,
                                        fontSize: '0.95rem',
                                        textDecoration: task.completed ? 'line-through' : 'none'
                                    }}>
                                        {task.text}
                                    </span>
                                </div>
                            ))}
                            {qTasks.length === 0 && (
                                <div style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px dashed rgba(255,255,255,0.1)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem'
                                }}>
                                    Drop items here
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Inbox for uncategorized tasks in Matrix view */}
            <div
                className="card"
                onDrop={(e) => handleDrop(e, 0)}
                onDragOver={handleDragOver}
                style={{
                    gridColumn: '1 / -1',
                    borderTop: '4px solid var(--text-primary)'
                }}
            >
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Inbox / Uncategorized</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {tasks.filter(t => !t.quadrant).map(task => (
                        <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--glass-border)',
                                cursor: 'move',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {task.text}
                        </div>
                    ))}
                    {tasks.filter(t => !t.quadrant).length === 0 && (
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No uncategorized tasks.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EisenhowerMatrix;
