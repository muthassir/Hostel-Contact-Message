import React from 'react'

const Message = ({selectedContact, handleSendMessage, message, setMessage, useMockApi, setUseMockApi, setSelectedContact}) => {
  return (
    <>
    {selectedContact && (
        <div className="message-form">
          <h2>
            Send WhatsApp Message to {selectedContact.name} (
            {selectedContact.roomType}, Room {selectedContact.roomNumber})
          </h2>
          <form onSubmit={handleSendMessage}>
            <textarea
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <label>
              <input
                type="checkbox"
                checked={useMockApi}
                onChange={() => setUseMockApi(!useMockApi)}
              />
              Use Mock API (for testing)
            </label>
            <button type="submit">Send Message</button>
            <button type="button" onClick={() => setSelectedContact(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default Message