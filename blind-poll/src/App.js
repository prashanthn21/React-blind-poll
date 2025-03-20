import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const POLL_STORAGE_KEY = "pollData";
const VOTE_STORAGE_KEY = "userVote";

const pollQuestion = "Which JavaScript framework do you prefer?";
const pollOptions = ["React", "Vue", "Angular", "Svelte"];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const App = () => {
  const [votes, setVotes] = useState({});
  const [userVote, setUserVote] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Load votes and user status from Local Storage on mount
  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem(POLL_STORAGE_KEY)) || {};
    const savedVote = localStorage.getItem(VOTE_STORAGE_KEY);
    setVotes(storedVotes);
    setUserVote(savedVote);
  }, []);

  // Handle vote submission
  const handleVote = () => {
    if (!selectedOption) return alert("Please select an option!");

    const updatedVotes = { ...votes };
    if (userVote) {
      // Remove previous vote
      updatedVotes[userVote] = (updatedVotes[userVote] || 1) - 1;
    }

    // Add new vote
    updatedVotes[selectedOption] = (updatedVotes[selectedOption] || 0) + 1;

    setVotes(updatedVotes);
    setUserVote(selectedOption);
    localStorage.setItem(POLL_STORAGE_KEY, JSON.stringify(updatedVotes));
    localStorage.setItem(VOTE_STORAGE_KEY, selectedOption);
  };

  // Handle showing results
  const toggleResults = () => setShowResults(!showResults);

  // Prepare data for pie chart
  const pieChartData = pollOptions.map((option) => ({
    name: option,
    value: votes[option] || 0,
  }));

  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      <div className="card shadow p-4 w-50 text-center">
        <h2 className="text-primary">Blind Poll</h2>
        <p>{pollQuestion}</p>

        {!showResults ? (
          <div>
            {pollOptions.map((option) => (
              <div key={option} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id={option}
                  name="poll"
                  value={option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  checked={selectedOption === option}
                />
                <label className="form-check-label" htmlFor={option}>
                  {option}
                </label>
              </div>
            ))}
            <button className="btn btn-primary w-100 mt-3" onClick={handleVote}>
              {userVote ? "Change Vote" : "Submit Vote"}
            </button>
            <button className="btn btn-secondary w-100 mt-2" onClick={toggleResults}>
              Show Results
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-success mt-3">Results:</h3>
            <ul className="list-group mb-3">
              {pollOptions.map((option) => (
                <li key={option} className="list-group-item d-flex justify-content-between">
                  <span>{option}</span>
                  <span className="badge bg-success">{votes[option] || 0} votes</span>
                </li>
              ))}
            </ul>

            {/* Pie Chart */}
            <PieChart width={300} height={300}>
              <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>

            <button className="btn btn-secondary w-100 mt-3" onClick={toggleResults}>
              Hide Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
