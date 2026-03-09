export default function Controls({ difficulty, setDifficulty }) {
  return (
    <div className="controls">
      <label>Difficulty:</label>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="easy">Easy (3 mines)</option>
        <option value="medium">Medium (10 mines)</option>
        <option value="hard">Hard (25 mines)</option>
      </select>
    </div>
  );
}