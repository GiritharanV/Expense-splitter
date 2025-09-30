import Dashboard from "./pages/Dashboard"


function App() {
  
const sampleGroups = [
  {
    group_id: 1,
    name: "Friends",
    created_by: 2,
    created_at: "2025-09-30T08:00:00.000Z",
    members: [2, 3, 5],
  },
  {
    group_id: 2,
    name: "Work",
    created_by: 4,
    created_at: "2025-09-29T12:00:00.000Z",
    members: [4, 5],
  },
  {
    group_id: 3,
    name: "Gaming",
    created_by: 5,
    created_at: "2025-09-28T10:00:00.000Z",
    members: [5, 6, 7],
  },
  {
    group_id: 4,
    name: "Family",
    created_by: 1,
    created_at: "2025-09-27T09:00:00.000Z",
    members: [1, 2, 3, 4],
  },
  {
    group_id: 5,
    name: "Travel Buddies",
    created_by: 6,
    created_at: "2025-09-26T14:30:00.000Z",
    members: [6, 7, 8],
  },
];

  return (
    <>
      <div>
        <Dashboard groups={sampleGroups} />
      </div>
    </>
  )
}

export default App
