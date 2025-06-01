import React from 'react'

const Bulk = ({selectedIds, setShowBulkMessageForm, handleBulkDelete}) => {
  return (
    
    <div style={{ margin: "20px 0" }}>
    <button
      onClick={() => {
        if (selectedIds.length === 0) {
          alert("Please select at least one contact to send messages.");
        } else {
          setShowBulkMessageForm(true);
        }
      }}
    >
      Send Message to Selected ({selectedIds.length})
    </button>
    <button
      onClick={handleBulkDelete}
      disabled={selectedIds.length === 0}
      style={{ marginLeft: "10px" }}
    >
      Delete Selected ({selectedIds.length})
    </button>
  </div>
  )
}

export default Bulk