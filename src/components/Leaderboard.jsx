import { useEffect, useState } from "react";

export default function Leaderboard({ difficulty }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const leaderboardKey = `minesweeper-leaderboard-${difficulty}`;
    const data = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    setRecords(data);
  }, [difficulty]);

  return (
    <div className="leaderboard">
      <h2>Leaderboard - {difficulty}</h2>
      {records.length === 0 ? (
        <p>No records yet</p>
      ) : (
        <ul>
          {records.map((record, i) => (
            <li key={i}>
              #{i + 1} - {record.time}s 
              {record.date && (
                <span className="record-date">
                  {' '}({new Date(record.date).toLocaleDateString()})
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}