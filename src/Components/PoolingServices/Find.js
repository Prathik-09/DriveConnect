import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHistory } from "react-icons/fa"; // Importing FaHistory for the history icon
import Fuse from "fuse.js";

function FindRide() {
  const [rideOffers, setRideOffers] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [time, setTime] = useState("");
  const [filteredRides, setFilteredRides] = useState([]);
  const [showAllRides, setShowAllRides] = useState(false);
  const [suggestions, setSuggestions] = useState({ from: [], to: [] });
  const [sidebarVisible, setSidebarVisible] = useState(false); // Control the sidebar visibility
  const [history, setHistory] = useState([]); // To store booked rides

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRideOffers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/findride");
        setRideOffers(response.data);
        setFilteredRides(response.data);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    fetchRideOffers();
  }, []);

  // Configure Fuse.js for fuzzy matching
  const fuseOptions = {
    keys: ["pickupLocation", "dropoffLocation"],
    threshold: 0.4,
  };
  const fuse = new Fuse(rideOffers, fuseOptions);

  const handleSearch = () => {
    const inputDate = new Date(time);

    const exactMatches = rideOffers.filter((ride) => {
      const rideDate = new Date(ride.dateTime);
      const isLocationMatch =
        ride.pickupLocation.toLowerCase() === from.toLowerCase() &&
        ride.dropoffLocation.toLowerCase() === to.toLowerCase();
      const isDateMatch = inputDate.toLocaleDateString() === rideDate.toLocaleDateString();
      return isLocationMatch && isDateMatch;
    });

    if (exactMatches.length > 0) {
      setFilteredRides(exactMatches);
    } else {
      const nearbyRides = rideOffers.filter((ride) => {
        const rideDate = new Date(ride.dateTime);
        const isLocationMatch =
          ride.pickupLocation.toLowerCase() === from.toLowerCase() &&
          ride.dropoffLocation.toLowerCase() === to.toLowerCase();
        const isDateMatch = inputDate.toLocaleDateString() === rideDate.toLocaleDateString();
        return isLocationMatch && isDateMatch;
      });

      if (nearbyRides.length > 0) {
        setFilteredRides(nearbyRides);
      } else {
        setFilteredRides([]);
        alert("No rides are available for the selected location and date.");
      }
    }

    setShowAllRides(false);
  };

  const handleInputChange = (value, field) => {
    if (field === "from") setFrom(value);
    else setTo(value);

    const matches = fuse.search(value).map((result) =>
      field === "from" ? result.item.pickupLocation : result.item.dropoffLocation
    );
    const uniqueMatches = [...new Set(matches)];
    setSuggestions((prev) => ({ ...prev, [field]: uniqueMatches }));
  };

  const handleSuggestionClick = (value, field) => {
    if (field === "from") setFrom(value);
    else setTo(value);

    setSuggestions((prev) => ({ ...prev, [field]: [] }));
  };

  const handleBookNow = (ride) => {
    // Save the ride to the history
    setHistory((prevHistory) => {
      console.log('Adding ride to history:', ride);  // Log for debugging
      return [...prevHistory, ride];
    });
    alert(`Booking ride from ${ride.pickupLocation} to ${ride.dropoffLocation}`);
    navigate("/ridedetails", { state: { ride } });
  };

  const toggleShowAllRides = () => {
    setShowAllRides((prevState) => !prevState);
  };

  const toggleSidebar = () => {
    console.log('Sidebar toggled', sidebarVisible);  // Log for debugging
    setSidebarVisible((prevState) => !prevState);
  };

  const ridesToDisplay = showAllRides ? filteredRides : filteredRides.slice(0, 4);

  return (
    <div style={styles.container}>
      <button style={styles.backButtonStyle} onClick={() => navigate(-1)}>
        Back
      </button>

      {/* History icon to toggle the sidebar */}
      <button onClick={toggleSidebar} style={styles.historyButton}>
        <FaHistory size={30} />
      </button>

      {/* Sidebar */}
      {sidebarVisible && (
        <div style={styles.sidebar}>
          <h2>Booked Orders</h2>
          <ul>
            {history.map((ride, index) => (
              <li key={index}>
                {ride.pickupLocation} → {ride.dropoffLocation} on{" "}
                {new Date(ride.dateTime).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="container"
        style={{
          background: "linear-gradient(to right, #FFFFFF, #a7ff8e)",
          marginTop: "4rem",
          padding: "40px",
          borderRadius: "8px",
        }}
      >
        <div className="row">
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <div className="fw-bolder fs-1 typing">FIND A RIDE AND SAVE</div>
            <div className="fs-3 mt-5">
              Share your journey and reduce your travel charge
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "50px",
        }}
      >
        <div style={styles.search}>
          <div style={styles.searchDivInline}>
            <h2 style={styles.h2}>From:</h2>
            <input
              type="text"
              placeholder="Source"
              style={styles.input}
              value={from}
              onChange={(e) => handleInputChange(e.target.value, "from")}
            />
            <ul style={styles.suggestionsList}>
              {suggestions.from.map((suggestion, index) => (
                <li
                  key={index}
                  style={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(suggestion, "from")}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
          <div style={styles.searchDivInline}>
            <h2 style={styles.h2}>To:</h2>
            <input
              type="text"
              placeholder="Destination"
              style={styles.input}
              value={to}
              onChange={(e) => handleInputChange(e.target.value, "to")}
            />
            <ul style={styles.suggestionsList}>
              {suggestions.to.map((suggestion, index) => (
                <li
                  key={index}
                  style={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(suggestion, "to")}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
          <div style={styles.searchDivInline}>
            <h2 style={styles.h2}>Time:</h2>
            <input
              type="date"
              style={styles.input}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div style={styles.searchDivInline}>
            <button
              style={styles.findButton}
              onMouseOver={(e) =>
                (e.target.style.backgroundColor =
                  styles.findButtonHover.backgroundColor)
              }
              onMouseOut={(e) =>
                (e.target.style.backgroundColor =
                  styles.findButton.backgroundColor)
              }
              onClick={handleSearch}
            >
              Find
            </button>
          </div>
        </div>

        <div style={styles.availableRidesSection}>
          <h2>Available Rides</h2>
          <div className="row">
            {ridesToDisplay.map((ride, index) => (
              <div className="row" key={index} style={styles.rideCard}>
                <div className="col-md-9" style={styles.rideDetails}>
                  <div>
                    <strong>Location:</strong>
                    <p>{`${ride.pickupLocation} --> ${ride.dropoffLocation}`}</p>
                  </div>
                  <div>
                    <strong>Date & Time:</strong>
                    {new Date(ride.dateTime).toLocaleString()}
                  </div>
                  <div>
                    <strong>Available Seats:</strong> {ride.availableSeats}
                  </div>
                  <div>
                    <strong>Price Per Seat:</strong> {ride.pricePerSeat}
                  </div>
                  {ride.user && (
                    <div>
                      <strong>Offered by:</strong> {ride.user.name}
                    </div>
                  )}
                </div>
                <div className="col-md-3" style={styles.buttonContainer}>
                  <button
                    style={styles.bookButton}
                    onClick={() => handleBookNow(ride)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredRides.length > 4 && (
            <div style={styles.seeMoreContainer}>
              <button style={styles.seeMoreButton} onClick={toggleShowAllRides}>
                {showAllRides ? "Show Less" : "See More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default FindRide;



const styles = {
  sidebar: {
    position: "absolute",
    top: "110px",
    right: "0",
    width: "300px",
    background: "#f4f4f4",
    padding: "10px",
    boxShadow: "0 0 5px rgba(0,0,0,0.3)",
    zIndex: 100,
    height: "100%",
  },
  historyButton: {
    position: "absolute",
    top: "110px",
    right: "20px",
    backgroundColor: "#0078d7",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "16px",
  },
  container: {
    padding: "20px",
    position: "relative",
  },
  backButtonStyle: {
    backgroundColor: "#0078d7",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  search: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    gap: "20px",
  },
  searchDivInline: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  h2: {
    fontSize: "16px",
    marginBottom: "5px",
  },
  input: {
    width: "200px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  suggestionsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    borderRadius: "5px",
    backgroundColor: "#fff",
    maxHeight: "100px",
    overflowY: "auto",
    position: "absolute",
    zIndex: 1000,
    width: "100%",
  },
  suggestionItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #ddd",
  },
  findButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    
  },
  findButtonHover: {
    backgroundColor: "#45a049",
  },
  availableRidesSection: {
    marginTop: "40px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  rideCard: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    margin: "20px auto",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "start",
    transition: "transform 0.2s ease-in-out",
    maxWidth: "600px",
  },
  rideDetails: {
    flex: 1,
    paddingRight: "20px",
  },
  buttonContainer: {
    textAlign: "center",
    paddingTop: "10px",
  },
  bookButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    fontSize: "14px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  seeMoreContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  seeMoreButton: {
    backgroundColor: "#0078d7",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};
