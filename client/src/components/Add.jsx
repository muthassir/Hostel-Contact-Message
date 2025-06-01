import React from "react";

const Add = ({
  handleAddContact,
  name,
  setName,
  phoneNumber,
  setPhoneNumber,
  callMeBotApiKey,
  setCallMeBotApiKey,
  roomType,
  setRoomType,
  roomNumber,
  setRoomNumber,
  availableRooms,
}) => {
  return (
    <form onSubmit={handleAddContact} className="navbar bg-base-200 rounded mt-1">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Phone Number (+1234567890)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="CallMeBot API Key"
        value={callMeBotApiKey}
        onChange={(e) => setCallMeBotApiKey(e.target.value)}
        required
      />
      <select
        value={roomType}
        onChange={(e) => setRoomType(e.target.value)}
        required
      >
        <option value="single">Single Room</option>
        <option value="double">Double Room</option>
        <option value="triple">Triple Room</option>
      </select>
      <select
        value={roomNumber}
        onChange={(e) => setRoomNumber(e.target.value)}
        required
      >
        <option value="">Select Room Number</option>
        {availableRooms.map((room) => (
          <option key={room} value={room}>
            {room}
          </option>
        ))}
      </select>
      <button type="submit" disabled={!roomNumber}>
        Add Contact
      </button>
    </form>
  );
};

export default Add;
