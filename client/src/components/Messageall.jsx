import React from "react";

const Messageall = ({
  showBulkMessageForm,
  selectedIds,
  handleBulkSendMessage,
  bulkMessage,
  setBulkMessage,
  bulkUseMockApi,
  setBulkUseMockApi,
  setShowBulkMessageForm,
}) => {
  return (
    <>
      {showBulkMessageForm && (
        <div className="message-form">
          <h2>
            Send WhatsApp Message to Selected Contacts ({selectedIds.length})
          </h2>
          <form onSubmit={handleBulkSendMessage}>
            <textarea
              placeholder="Type your message"
              value={bulkMessage}
              onChange={(e) => setBulkMessage(e.target.value)}
              required
            />
            <label>
              <input
                type="checkbox"
                checked={bulkUseMockApi}
                onChange={() => setBulkUseMockApi(!bulkUseMockApi)}
              />
              Use Mock API (for testing)
            </label>
            <button type="submit">Send Message</button>
            <button
              type="button"
              onClick={() => {
                setShowBulkMessageForm(false);
                setBulkMessage(
                  "Reminder: Please pay your fee by Friday. Pay here: [Your Payment Link]"
                );
                setBulkUseMockApi(false);
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Messageall;
