import React, { useState } from "react";
import "./ScheduleTable.css";

const ScheduleTable = () => {
  const [activeTab, setActiveTab] = useState("train");
  const [trips, setTrips] = useState({
    train: [
      { departure: "08:00 AM", id: "TR001", capacity: "300 Tons", status: "Completed", lead: "John", route: "Colombo - Kandy" },
      { departure: "10:30 AM", id: "TR002", capacity: "280 Tons", status: "In Transit", lead: "David", route: "Kandy - Badulla" },
      { departure: "01:00 PM", id: "TR003", capacity: "350 Tons", status: "Delayed", lead: "Mark", route: "Colombo - Galle" },
      { departure: "04:00 PM", id: "TR004", capacity: "320 Tons", status: "Completed", lead: "Alex", route: "Galle - Matara" },
      { departure: "07:00 PM", id: "TR005", capacity: "290 Tons", status: "Pending", lead: "Emma", route: "Colombo - Jaffna" },
    ],
    truck: [
      { departure: "07:30 AM", id: "TK101", capacity: "50 Tons", status: "In Transit", lead: "Lucas", route: "Colombo - Gampaha" },
      { departure: "09:00 AM", id: "TK102", capacity: "45 Tons", status: "Completed", lead: "Olivia", route: "Negombo - Kurunegala" },
      { departure: "12:00 PM", id: "TK103", capacity: "60 Tons", status: "Delayed", lead: "Sophia", route: "Colombo - Ratnapura" },
      { departure: "02:30 PM", id: "TK104", capacity: "55 Tons", status: "In Transit", lead: "Ethan", route: "Galle - Hambantota" },
      { departure: "06:30 PM", id: "TK105", capacity: "65 Tons", status: "Pending", lead: "Liam", route: "Matara - Colombo" },
    ],
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTrip, setNewTrip] = useState({
    departure: "",
    id: "",
    capacity: "",
    status: "Pending",
    lead: "",
    route: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 4;

  // Get current trips for pagination
  const currentTrips = trips[activeTab].slice(
    (currentPage - 1) * tripsPerPage,
    currentPage * tripsPerPage
  );

  const totalPages = Math.ceil(trips[activeTab].length / tripsPerPage);

  const handleAddTrip = () => {
    setTrips((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newTrip],
    }));
    setNewTrip({ departure: "", id: "", capacity: "", status: "Pending", lead: "", route: "" });
    setShowAddForm(false);
  };

  const statusClass = (status) => {
    if (status === "Completed") return "train-schedule__status--success";
    if (status === "In Transit") return "train-schedule__status--warning";
    if (status === "Delayed") return "train-schedule__status--danger";
    return "";
  };

  return (
    <div className="train-schedule__card">
      <div className="train-schedule__tabs">
        <button
          className={`train-schedule__tab ${activeTab === "train" ? "train-schedule__tab--active" : ""}`}
          onClick={() => { setActiveTab("train"); setCurrentPage(1); }}
        >
          Train Schedule
        </button>
        <button
          className={`train-schedule__tab ${activeTab === "truck" ? "train-schedule__tab--active" : ""}`}
          onClick={() => { setActiveTab("truck"); setCurrentPage(1); }}
        >
          Truck Schedule
        </button>
      </div>

      {/* Top Add Button */}
      <div className="train-schedule__header">
        <h2>{activeTab === "train" ? "Train" : "Truck"} Schedule</h2>
        <button className="train-schedule__add-btn" onClick={() => setShowAddForm(true)}>
          + Add New
        </button>
      </div>

      <table className="train-schedule__table">
        <thead>
          <tr>
            <th>Departure</th>
            <th>ID</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Lead</th>
            <th>Route</th>
          </tr>
        </thead>
        <tbody>
          {currentTrips.map((trip, index) => (
            <tr key={index}>
              <td>{trip.departure}</td>
              <td>{trip.id}</td>
              <td>{trip.capacity}</td>
              <td>
                <span className={`train-schedule__status ${statusClass(trip.status)}`}>
                  {trip.status}
                </span>
              </td>
              <td>{trip.lead}</td>
              <td>{trip.route}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="train-schedule__pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Prev
        </button>
        <span>Page {currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>

      {/* Add New Trip Form */}
      {showAddForm && (
  <div className="train-schedule__add-form">
    <div>
      <h3>Add New {activeTab === "train" ? "Train" : "Truck"} Trip</h3>
      <input
        type="text"
        placeholder="Departure Time"
        value={newTrip.departure}
        onChange={(e) => setNewTrip({ ...newTrip, departure: e.target.value })}
      />
      <input
        type="text"
        placeholder="Trip ID"
        value={newTrip.id}
        onChange={(e) => setNewTrip({ ...newTrip, id: e.target.value })}
      />
      <input
        type="text"
        placeholder="Capacity"
        value={newTrip.capacity}
        onChange={(e) => setNewTrip({ ...newTrip, capacity: e.target.value })}
      />
      <input
        type="text"
        placeholder="Lead"
        value={newTrip.lead}
        onChange={(e) => setNewTrip({ ...newTrip, lead: e.target.value })}
      />
      <input
        type="text"
        placeholder="Route"
        value={newTrip.route}
        onChange={(e) => setNewTrip({ ...newTrip, route: e.target.value })}
      />
      <div className="train-schedule__form-actions">
        <button onClick={handleAddTrip}>Add</button>
        <button onClick={() => setShowAddForm(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ScheduleTable;
