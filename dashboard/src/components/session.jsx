import { useEffect, useState } from 'react';
import { getJSON } from '../API';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);   // left list
  const [selected, setSelected] = useState(null); // kaun sa session chuna
  const [events, setEvents] = useState([]);       // right side journey
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Component pehli baar dikhte hi sessions ki list laao
  useEffect(() => {
    getJSON('/sessions')
      .then(setSessions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Session pe click -> uske events laao
  function openSession(id) {
    setSelected(id);
    setEvents([]);
    getJSON(`/sessions/${id}/events`)
      .then(setEvents)
      .catch((e) => setError(e.message));
  }

  if (loading) return <p>Loading sessions...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (sessions.length === 0) return <p>Abhi koi session nahi hai. Pehle demo page pe click karo.</p>;

  return (
    <div className="two-col">
      {/* LEFT: sessions list */}
      <div className="col-left">
        <h3>Sessions ({sessions.length})</h3>
        {sessions.map((s) => (
          <div
            key={s._id}
            className={`session-card ${selected === s._id ? 'active' : ''}`}
            onClick={() => openSession(s._id)}
          >
            <div className="session-id">{s._id.slice(0, 14)}…</div>
            <div className="session-meta">
              <span className="badge">{s.total_events} events</span>
              <span>{new Date(s.last_seen).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: user journey */}
      <div className="col-right">
        <h3>User Journey</h3>
        {!selected && <p>select the session(any) from left side.</p>}
        <ol className="timeline">
          {events.map((e) => (
            <li key={e._id} className={`event ${e.type}`}>
              <div className="event-top">
                <span className={`tag ${e.type}`}>{e.type}</span>
                <span className="time">{new Date(e.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="event-url">{e.page_url}</div>
              {e.type === 'click' && (
                <div className="event-pos">click at x: {e.x}, y: {e.y}</div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}