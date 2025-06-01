import React from 'react'

const List = ({renderRoomSection, singleRoom, doubleRoom, tripleRoom}) => {
  return (
    <div className="contact-list table border-2 p-2 overflow-scroll h-96 ">
    {renderRoomSection("single", singleRoom, "Single Room")}
    {renderRoomSection("double", doubleRoom, "Double Room")}
    {renderRoomSection("triple", tripleRoom, "Triple Room")}
  </div>
  )
}

export default List