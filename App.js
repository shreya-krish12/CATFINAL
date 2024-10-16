import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2"; 
import GaugeChart from "react-gauge-chart";
import "./App.css";
// Import Chart.js components
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  ArcElement, 
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
} from 'chart.js';

// Register necessary chart types
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  ArcElement
);



function App() {
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    gender: "",
    section1Score: 0,
    section2Score: 0,
    section3Score: 0,
  });
  const [users, setUsers] = useState([]);
  const [genderChartData, setGenderChartData] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const [barChartData, setBarChartData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [overallPercentile, setOverallPercentile] = useState(0); // State for overall percentile

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !userData.name ||
      !userData.age ||
      !userData.gender ||
      userData.section1Score === 0 ||
      userData.section2Score === 0 ||
      userData.section3Score === 0
    ) {
      alert("All fields must be filled with valid values.");
      return;
    }

    // Calculate overall percentile as the average of the three sections
    const averagePercentile = (
      (Number(userData.section1Score) +
        Number(userData.section2Score) +
        Number(userData.section3Score)) / 
      3
    ).toFixed(2);
    setOverallPercentile(averagePercentile); // Set the calculated overall percentile

    try {
      await axios.post("http://localhost:5000/api/users", { ...userData, overallPercentile: averagePercentile }); // Send the calculated percentile
      alert("Data saved successfully!");
      fetchUsers(); // Fetch user data again to update charts
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to save data.");
    }
  };

  const fetchUsers = usdeCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
      prepareGenderChartData(response.data);
      prepareLineChartData(response.data);
      prepareBarChartData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },[]);

  const prepareGenderChartData = (data) => {
    const genderCount = { Male: 0, Female: 0, Other: 0 };

    data.forEach((user) => {
      if (user.gender) {
        genderCount[user.gender]++;
      }
    });

    const total = data.length;
    setGenderChartData({
      labels: ["Male", "Female", "Other"],
      datasets: [
        {
          label: "Gender Distribution",
          data: [
            ((genderCount.Male / total) * 100).toFixed(2),
            ((genderCount.Female / total) * 100).toFixed(2),
            ((genderCount.Other / total) * 100).toFixed(2),
          ],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 99, 132, 0.6)",
          ],
        },
      ],
    });
  };

  const prepareLineChartData = (data) => {
    const highestScores = {
      section1: Math.max(...data.map((user) => user.section1Score)),
      section2: Math.max(...data.map((user) => user.section2Score)),
      section3: Math.max(...data.map((user) => user.section3Score)),
    };

    const currentUserScores = [userData.section1Score, userData.section2Score, userData.section3Score];

    setLineChartData({
      labels: ["Section 1", "Section 2", "Section 3"],
      datasets: [
        {
          label: "Highest Score",
          data: [highestScores.section1, highestScores.section2, highestScores.section3],
          borderColor: "rgba(255, 99, 132, 0.6)",
          fill: false,
        },
        {
          label: `${userData.name}'s Score`,
          data: currentUserScores,
          borderColor: "rgba(75, 192, 192, 0.6)",
          fill: false,
        },
      ],
    });
  };

  const prepareBarChartData = (allUsers) => {
    const overallPercentiles = allUsers.map((user) => user.overallPercentile || 0);
    const userPercentile = overallPercentile || 0;

    setBarChartData({
      labels: ["Your Percentile", "Highest User Percentile"],
      datasets: [
        {
          label: "Overall Percentile",
          data: [userPercentile, Math.max(...overallPercentiles)],
          backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        },
      ],
    });
  };

  useEffect(() => {
     // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>User Profile</h1>
        <div className="profile-container">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Name: </label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="input-group">
              <label>Age: </label>
              <input
                type="number"
                name="age"
                value={userData.age}
                onChange={handleChange}
                placeholder="Enter your age"
              />
            </div>

            <div className="input-group">
              <label>Gender: </label>
              <select
                type="text"
                name="gender"
                value={userData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label>Section 1 Score: </label>
              <input
                type="number"
                name="section1Score"
                value={userData.section1Score}
                onChange={handleChange}
                placeholder="Enter Section 1 score"
              />
            </div>

            <div className="input-group">
              <label>Section 2 Score: </label>
              <input
                type="number"
                name="section2Score"
                value={userData.section2Score}
                onChange={handleChange}
                placeholder="Enter Section 2 score"
              />
            </div>

            <div className="input-group">
              <label>Section 3 Score: </label>
              <input
                type="number"
                name="section3Score"
                value={userData.section3Score}
                onChange={handleChange}
                placeholder="Enter Section 3 score"
              />
            </div>

            <button type="submit">Submit</button>
          </form>

          {isSubmitted && (
            <>
              <div className="overall-percentile">
                <h2>{userData.name}'s Overall Percentile: {overallPercentile}</h2>
                <h2>Your Overall Percentile Gauge</h2>
                <GaugeChart
                  id="gauge-chart"
                  nrOfLevels={30}
                  arcsLength={[0.3, 0.4, 0.3]}
                  colors={["#FF9999", "#FFD580", "#99FF99"]} // Darker pastel colors


                  percent={overallPercentile / 100} // Divide by 100 to convert to a percentage
                  style={{ width: "100%" }}
                />
              </div>

              {/* Pie Chart for Gender Distribution */}
              {users.length > 0 && (
                <div className="chart-container" style={{ marginTop: '-20px' }}>
                  <h2>Gender Distribution Chart</h2>
                  <Pie
                    data={genderChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                    }}
                  />
                </div>
              )}

              {/* Line Chart for Scores */}
              <div className="chart-container">
                <h2>Line Chart for User Scores</h2>
                <Line
                  data={lineChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                  }}
                />
              </div>

             
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
