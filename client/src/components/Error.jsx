import React from 'react'

const Error = ({error}) => {
  return (
    <>
    {error && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
          {error}
        </div>
      )}
    </>
  )
}

export default Error