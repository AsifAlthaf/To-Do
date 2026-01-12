import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ title: '', text: '', date: '', time: '', priority: 'medium' });
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTodos(); }, []);

  const handleChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const addTodo = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      const res = await axios.post(API, form);
      setTodos([res.data, ...todos]);
      setForm({ title: '', text: '', date: '', time: '', priority: 'medium' });
    } catch (err) { console.error(err); }
  };

  const toggle = async (id, completed) => {
    try {
      const res = await axios.put(`${API}/${id}`, { completed: !completed });
      setTodos(todos.map(t => t._id === id ? res.data : t));
    } catch (err) { console.error(err); }
  };

  const remove = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) { console.error(err); }
  };

  // format 24-hour time (HH:MM) to 12-hour with AM/PM for display
  const formatTime12 = (time24) => {
    if (!time24) return '';
    // handle possible full datetime strings by extracting HH:MM
    const match = time24.match(/(\d{1,2}):(\d{2})/);
    if (!match) return time24;
    let hh = parseInt(match[1], 10);
    const mm = match[2];
    const suffix = hh >= 12 ? 'PM' : 'AM';
    hh = hh % 12 === 0 ? 12 : hh % 12;
    return `${hh}:${mm} ${suffix}`;
  };

  return (
    <div className="app-bg min-h-screen p-6">
      <div className="container">
        <div className="card mb-6">
          <h1 className="text-2xl font-bold mb-4">Todo App</h1>
          <form onSubmit={addTodo} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input className="input" value={form.title} onChange={handleChange('title')} placeholder="Task title" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea className="input" value={form.text} onChange={handleChange('text')} placeholder="Details (optional)" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input className="input" type="date" value={form.date} onChange={handleChange('date')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input className="input" type="time" value={form.time} onChange={handleChange('time')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select className="input" value={form.priority} onChange={handleChange('priority')}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="pt-2">
              <button className="btn" type="submit">Add Task</button>
            </div>
          </form>
        </div>

        <div className="space-y-3">
          {loading ? <p>Loading...</p> : todos.map(t => (
            <div key={t._id} className="card flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={t.completed} onChange={() => toggle(t._id, t.completed)} />
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-sm text-gray-600">{t.text}</div>
                    <div className="text-sm mt-1">
                      {t.date ? new Date(t.date).toLocaleDateString() : ''}{t.time ? ` ${formatTime12(t.time)}` : ''}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={t.priority === 'High' ? 'priority-high' : t.priority === 'Low' ? 'priority-low' : 'priority-medium'}>{t.priority}</div>
                <div className="flex gap-2">
                  <button className="text-sm text-red-600" onClick={() => remove(t._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
