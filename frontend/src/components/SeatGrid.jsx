import React from 'react';

const rows = 'ABCDEFGHIJ'.split('');
const cols = Array.from({ length: 12 }, (_, i) => i + 1);

export default function SeatGrid({ bookedSeats = [], selectedSeats = [], onToggle }) {
  return (
    <div className="seat-wrap">
      <div className="screen" aria-hidden="true"><span>Screen this way</span></div>
      <div className="seat-grid">
        {rows.map((r) => (
          <div className="seat-row" key={r}>
            <span className="row-label">{r}</span>
            {cols.map((c) => {
              const id = `${r}${c}`;
              const booked = bookedSeats.includes(id);
              const selected = selectedSeats.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  className={`seat ${booked ? 'booked' : ''} ${selected ? 'selected' : ''} ${c === 6 ? 'aisle' : ''}`}
                  onClick={() => !booked && onToggle(id)}
                  disabled={booked}
                  aria-pressed={selected}
                  aria-label={`Seat ${id}${booked ? ', taken' : ''}`}
                  title={booked ? `${id} is taken` : id}
                >
                  {c}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="legend">
        <span><i className="seat sample" /> Free</span>
        <span><i className="seat sample selected" /> Yours</span>
        <span><i className="seat sample booked" /> Taken</span>
      </div>
    </div>
  );
}
