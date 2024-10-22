import React, { useState, useEffect } from 'react';
import './App.css'; // You will style your application using this

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [grouping, setGrouping] = useState(localStorage.getItem('grouping') || 'status');
  const [ordering, setOrdering] = useState(localStorage.getItem('ordering') || 'priority');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
    const data = await response.json();
    setTickets(data.tickets);
  };

  const groupTickets = () => {
    switch (grouping) {
      case 'status':
        return tickets.reduce((acc, ticket) => {
          acc[ticket.status] = acc[ticket.status] || [];
          acc[ticket.status].push(ticket);
          return acc;
        }, {});
      case 'user':
        return tickets.reduce((acc, ticket) => {
          acc[ticket.user] = acc[ticket.user] || [];
          acc[ticket.user].push(ticket);
          return acc;
        }, {});
      case 'priority':
        return tickets.reduce((acc, ticket) => {
          acc[ticket.priority] = acc[ticket.priority] || [];
          acc[ticket.priority].push(ticket);
          return acc;
        }, {});
      default:
        return {};
    }
  };

  const sortTickets = (tickets) => {
    if (ordering === 'priority') {
      return tickets.sort((a, b) => b.priority - a.priority);
    } else {
      return tickets.sort((a, b) => a.title.localeCompare(b.title));
    }
  };

  const groupedTickets = groupTickets();
  const groupedKeys = Object.keys(groupedTickets);

  const handleGroupingChange = (e) => {
    setGrouping(e.target.value);
    localStorage.setItem('grouping', e.target.value);
  };

  const handleOrderingChange = (e) => {
    setOrdering(e.target.value);
    localStorage.setItem('ordering', e.target.value);
  };

  return (
    <div className="kanban-board">
      <div className="controls">
        <label>
          Grouping:
          <select value={grouping} onChange={handleGroupingChange}>
            <option value="status">Status</option>
            <option value="user">User</option>
            <option value="priority">Priority</option>
          </select>
        </label>
        <label>
          Ordering:
          <select value={ordering} onChange={handleOrderingChange}>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>
      
      <div className="columns">
        {groupedKeys.map((key) => (
          <div key={key} className="column">
            <h2>{key}</h2>
            {sortTickets(groupedTickets[key]).map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <h3>{ticket.title}</h3>
                <p>{ticket.description}</p>
                <p>Priority: {ticket.priority}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;