import { useEffect, useState } from 'react';
import { getJSON } from '../API';

export default function Heatmap() {
  const [pages, setPages] = useState([]);   // dropdown options
  const [page, setPage] = useState('');     // chuna hua page
  const [clicks, setClicks] = useState([]); // us page ke saare clicks
  const [error, setError] = useState('');

  // Dropdown ke liye pages laao
  useEffect(() => {
    getJSON('/pages').then(setPages).catch((e) => setError(e.message));
  }, []);

  // Page badalte hi us page ke clicks laao
  useEffect(() => {
    if (!page) return;
    setClicks([]);
    getJSON(`/heatmap?url=${encodeURIComponent(page)}`)
      .then(setClicks)
      .catch((e) => setError(e.message));
  }, [page]);

  // Canvas ka size = sabse bada page size jo clicks me mila
  const pw = Math.max(1, ...clicks.map((c) => c.page_width || 0));
  const ph = Math.max(1, ...clicks.map((c) => c.page_height || 0));

  return (
    <div>
      <h3>Click Heatmap</h3>
      {error && <p className="error">Error: {error}</p>}

      <div className="heat-controls">
        <select value={page} onChange={(e) => setPage(e.target.value)}>
          <option value="">-- Select page URL --</option>
          {pages.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {page && <span className="badge">{clicks.length} clicks</span>}
      </div>

      {!page && <p>Upar se koi page select karo.</p>}

      {page && clicks.length > 0 && (
        <div className="heat-box" style={{ aspectRatio: `${pw} / ${ph}` }}>
          {clicks.map((c, i) => (
            <div
              key={i}
              className="dot"
              style={{
                left: `${(c.x / pw) * 100}%`, // x ko % me badla
                top: `${(c.y / ph) * 100}%`,  // y ko % me badla
              }}
            />
          ))}
        </div>
      )}

      {page && clicks.length === 0 && <p>Is page pe abhi koi click nahi.</p>}
    </div>
  );
}