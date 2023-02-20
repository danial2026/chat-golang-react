import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    // backgroundColor: "#f4f4f4",
  },
  scrollable: {
    width: "50%",
    height: "50vh",
    overflowY: "scroll",
    marginTop: 20,
    borderRadius: 10,
    // backgroundColor: "white",
    boxShadow: "0 1px 2px #f4f4f4",
  },
  room: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    borderBottom: "1px solid #e5e5e5",
    cursor: "pointer",
  },
  title: {
    flex: 1,
    fontWeight: "bold",
  },
  mutual: {
    backgroundColor: "#263238",
  },
  group: {
    backgroundColor: "#37474F",
  },
};

function RoomList() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchData = async (accessToken) => {
      const response = await fetch('https://chatgraphql.danials.space/query', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            query {
              getRooms {
                data {
                  id
                  title
                  type
                }
                error {
                  code
                  message
                }
              }
            }
          `
        })
      });
      if (response.ok) {
        const data = await response.json();

        if (data && data.data && data.data.getRooms && data.data.getRooms.data) {
          setRooms(data.data.getRooms.data);
        }
      }
    }
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetchData(accessToken);
    }
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={{ fontWeight: "bold", marginBottom: 20 }}>Room List</h1>
      <div style={styles.scrollable}>
        {rooms.map((room) => (
          <div
            key={room.id}
            style={{
              ...styles.room,
              ...(room.type === "mutual" ? styles.mutual : styles.group),
            }}
            onClick={() => window.location.href = `/room?id=${room.id}`}
          >
            <div style={styles.title}>{room.title}</div>
            <div>{room.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomList;
