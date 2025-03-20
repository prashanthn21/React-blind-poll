import React, { useState, useEffect } from "react";

function Poll() {
  const [pollQuestion, setPollQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [votes, setVotes] = useState({});
  const [pollActive, setPollActive] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const savedPoll = JSON.parse(localStorage.getItem("poll"));
    if (savedPoll) {
      setPollQuestion(savedPoll.question);
      setOptions(savedPoll.options);
      setVotes(savedPoll.votes || {});
      setPollActive(savedPoll.active);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("poll", JSON.stringify({ question: pollQuestion, options, votes, active: pollActive }));
  }, [pollQuestion, options, votes, pollActive]);

  const handleVote = (option) => {
    if (!pollActive) return;
    setVotes({ ...votes, [option]: (votes[option] || 0) + 1 });
  };

  const closePoll = () => {
    setPollActive(false);
    setShowResults(true);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Blind Poll - Anonymous Voting</h2>
      {!pollQuestion ? (
        <>
          <input
            type="text"
            placeholder="Enter poll question..."
            onChange={(e) => setPollQuestion(e.target.value)}
          />
          {options.map((opt, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[i] = e.target.value;
                setOptions(newOptions);
              }}
            />
          ))}
          <button onClick={() => setOptions([...options, ""])}>Add Option</button>
        </>
      ) : (
        <>
          <h3>{pollQuestion}</h3>
          {options.map((opt, i) => (
            <button key={i} onClick={() => handleVote(opt)} disabled={!pollActive}>
              {opt}
            </button>
          ))}
          {pollActive && <button onClick={closePoll}>Close Poll</button>}
        </>
      )}
      {showResults && (
        <div>
          <h3>Final Results</h3>
          {options.map((opt, i) => (
            <p key={i}>{opt}: {votes[opt] || 0} votes</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Poll;
