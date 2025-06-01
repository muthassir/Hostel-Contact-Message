import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Error from "./components/Error";
import Add from "./components/Add";
import Bulk from "./components/Bulk";
import List from "./components/List";
import Message from "./components/Message";
import Messageall from "./components/Messageall";

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callMeBotApiKey, setCallMeBotApiKey] = useState("");
  const [roomType, setRoomType] = useState("single");
  const [roomNumber, setRoomNumber] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [message, setMessage] = useState(
    "Reminder: Please pay your fee by Friday. Pay here: [Your Payment Link]"
  );
  const [selectedContact, setSelectedContact] = useState(null);
  const [useMockApi, setUseMockApi] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQueries, setSearchQueries] = useState({
    single: "",
    double: "",
    triple: "",
  });
  const [showBulkMessageForm, setShowBulkMessageForm] = useState(false);
  const [bulkMessage, setBulkMessage] = useState(
    "Reminder: Please pay your fee by Friday. Pay here: [Your Payment Link]"
  );
  const [bulkUseMockApi, setBulkUseMockApi] = useState(false);

  useEffect(() => {
    const testServer = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/test");
        console.log("Server test response:", response.data);
      } catch (err) {
        console.error("Server test error:", err);
        setError(
          "Cannot connect to server. Ensure it is running on http://localhost:5000."
        );
      }
    };
    testServer();
    fetchContacts();
  }, []);

  const fetchAvailableRooms = async (type) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/available-rooms/${type}`
      );
      console.log(`Available rooms for ${type}:`, response.data);
      setAvailableRooms(response.data);
      setRoomNumber(response.data[0] || "");
    } catch (err) {
      console.error("Error fetching available rooms:", err);
      setError("Failed to fetch available rooms: " + err.message);
      setAvailableRooms([]);
      setRoomNumber("");
    }
  };

  useEffect(() => {
    fetchAvailableRooms(roomType);
  }, [roomType]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/contacts");
      console.log("API response:", response.data);
      if (Array.isArray(response.data)) {
        setContacts(response.data);
        setError(null);
        fetchAvailableRooms(roomType);
      } else {
        console.error("API did not return an array:", response.data);
        setContacts([]);
        setError(
          "Invalid data from server. Check proxy in vite.config.js or server status."
        );
      }
    } catch (err) {
      console.error("Fetch contacts error:", err.message);
      setContacts([]);
      setError(
        "Failed to fetch contacts. Ensure the server is running on http://localhost:5000 and proxy is configured."
      );
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!/^\+\d{10,15}$/.test(phoneNumber)) {
      setError(
        "Please enter a valid phone number in international format (e.g., +1234567890)"
      );
      return;
    }
    if (!roomNumber) {
      setError(
        "No available rooms for the selected room type. Please delete existing contacts or choose another room type."
      );
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/contacts", {
        name,
        phoneNumber,
        callMeBotApiKey,
        roomType,
        roomNumber,
      });
      setName("");
      setPhoneNumber("");
      setCallMeBotApiKey("");
      setRoomType("single");
      setError(null);
      await fetchContacts();
      alert("Contact added successfully");
    } catch (err) {
      console.error("Add contact error:", err);
      setError(
        "Failed to add contact: " + err.response?.data?.error || err.message
      );
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`);
      setError(null);
      await fetchContacts();
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
      alert("Contact deleted successfully");
    } catch (err) {
      console.error("Delete contact error:", err);
      setError("Failed to delete contact: " + err.message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one contact to delete.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/contacts/bulk-delete", {
        ids: selectedIds,
      });
      setError(null);
      await fetchContacts();
      setSelectedIds([]);
      alert("Selected contacts deleted successfully");
    } catch (err) {
      console.error("Bulk delete error:", err);
      setError("Failed to delete selected contacts: " + err.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const endpoint = useMockApi
        ? "http://localhost:5000/api/mock-whatsapp"
        : "http://localhost:5000/api/send-whatsapp";
      await axios.post(endpoint, {
        phoneNumber: selectedContact.phoneNumber,
        message,
        callMeBotApiKey: selectedContact.callMeBotApiKey,
      });
      setMessage(
        "Reminder: Please pay your fee by Friday. Pay here: [Your Payment Link]"
      );
      setSelectedContact(null);
      setUseMockApi(false);
      setError(null);
      alert(
        useMockApi
          ? "Mock WhatsApp message sent! Check server console."
          : "WhatsApp message sent successfully!"
      );
      await fetchContacts(); // Refresh contacts to update lastMessageSent
    } catch (err) {
      console.error("Send message error:", err);
      setError(
        err.response?.data?.error ||
          (useMockApi
            ? "Failed to send mock WhatsApp message"
            : "Failed to send WhatsApp message. Ensure the recipient has opted in and the API key is correct.")
      );
    }
  };

  const handleBulkSendMessage = async (e) => {
    e.preventDefault();
    try {
      const selectedContacts = contacts.filter((contact) =>
        selectedIds.includes(contact._id)
      );
      const endpoint = bulkUseMockApi
        ? "http://localhost:5000/api/mock-whatsapp"
        : "http://localhost:5000/api/bulk-send-whatsapp";
      const response = await axios.post(endpoint, {
        contacts: selectedContacts.map(({ phoneNumber, callMeBotApiKey }) => ({
          phoneNumber,
          callMeBotApiKey,
        })),
        message: bulkMessage,
      });
      setBulkMessage(
        "Reminder: Please pay your fee by Friday. Pay here: [Your Payment Link]"
      );
      setBulkUseMockApi(false);
      setShowBulkMessageForm(false);
      setSelectedIds([]);
      setError(null);
      await fetchContacts(); // Refresh contacts to update lastMessageSent
      let alertMessage = bulkUseMockApi
        ? "Mock WhatsApp messages sent! Check server console."
        : `Bulk WhatsApp messages processed: ${
            response.data.results.filter((r) => r.status === "success").length
          } succeeded, ${
            response.data.results.filter((r) => r.status === "failed").length
          } failed.`;
      if (response.data.ineligible && response.data.ineligible.length > 0) {
        alertMessage += `\n\nMessages not sent to ${response.data.ineligible.length} contact(s) due to 30-day restriction:\n`;
        response.data.ineligible.forEach(({ phoneNumber, nextAvailable }) => {
          alertMessage += `- ${phoneNumber}: Next available on ${nextAvailable}\n`;
        });
      }
      alert(alertMessage);
    } catch (err) {
      console.error("Bulk send message error:", err);
      setError(
        bulkUseMockApi
          ? "Failed to send mock WhatsApp messages"
          : "Failed to send bulk WhatsApp messages: " +
              err.response?.data?.error || err.message
      );
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSearchChange = (roomType, query) => {
    setSearchQueries((prev) => ({ ...prev, [roomType]: query }));
  };

  const filterContacts = (roomType) => {
    const query = searchQueries[roomType].toLowerCase();
    return contacts
      .filter((contact) => contact.roomType === roomType)
      .filter(
        (contact) =>
          contact.name.toLowerCase().includes(query) ||
          contact.phoneNumber.toLowerCase().includes(query)
      );
  };

  const singleRoom = filterContacts("single");
  const doubleRoom = filterContacts("double");
  const tripleRoom = filterContacts("triple");

  const renderRoomSection = (roomType, roomContacts, title) => (
    <div key={roomType}>
      <h2 className="font-bold">{title}</h2>
      <input
        type="text"
        placeholder={`Search ${title} by name or phone`}
        value={searchQueries[roomType]}
        onChange={(e) => handleSearchChange(roomType, e.target.value)}
        className="w-98 justify-center items-center"
      />
      {roomContacts.length === 0 ? (
        <p>No contacts in {title}.</p>
      ) : (
        roomContacts.map((contact, index) => (
          <div key={contact._id} className="contact border-1 border-gray-200">
            <input
              type="checkbox"
              checked={selectedIds.includes(contact._id)}
              onChange={() => handleCheckboxChange(contact._id)}
              className="checkbox checkbox-success "
            />
            <span>
              {index + 1}. {contact.name} ({contact.phoneNumber}) - Room{" "}
              {contact.roomNumber}
            </span>
            <div>
              <button onClick={() => setSelectedContact(contact)}>
                Message
              </button>
              <button onClick={() => handleDeleteContact(contact._id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (


    <div className="App">
      <h1> Hostel Contact App </h1>
      {/* error */}
      <Error error={error} />
      {/* add contact */}
      <Add
        handleAddContact={handleAddContact}
        name={name}
        setName={setName}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        callMeBotApiKey={callMeBotApiKey}
        setCallMeBotApiKey={setCallMeBotApiKey}
        roomType={roomType}
        setRoomType={setRoomType}
        roomNumber={roomNumber}
        setRoomNumber={setRoomNumber}
        availableRooms={availableRooms}
      />
      {/* bulk message send and delete */}
      <Bulk
        selectedIds={selectedIds}
        setShowBulkMessageForm={setShowBulkMessageForm}
        handleBulkDelete={handleBulkDelete}
      />
      {/* contact lists */}
      <List
        renderRoomSection={renderRoomSection}
        singleRoom={singleRoom}
        doubleRoom={doubleRoom}
        tripleRoom={tripleRoom}
      />

      {/* send message and select */}
      <Message
        selectedContact={selectedContact}
        handleSendMessage={handleSendMessage}
        message={message}
        setMessage={setMessage}
        useMockApi={useMockApi}
        setUseMockApi={setUseMockApi}
        setSelectedContact={setSelectedContact}
      />

      {/* send message to all */}
      <Messageall
        showBulkMessageForm={showBulkMessageForm}
        selectedIds={selectedIds}
        handleBulkSendMessage={handleBulkSendMessage}
        bulkMessage={bulkMessage}
        setBulkMessage={setBulkMessage}
        bulkUseMockApi={bulkUseMockApi}
        setBulkUseMockApi={setBulkUseMockApi}
        setShowBulkMessageForm={setShowBulkMessageForm}
      />
    </div>
  );
}

export default App;
