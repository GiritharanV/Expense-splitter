import React from "react";
import "../styles/Dashboard.css";

interface Group {
  group_id: number;
  name: string;
  created_by: number;
  created_at: string;
  members: number[];
}

interface UserDashboardProps {
  groups?: Group[];
}

const UserDashboard: React.FC<UserDashboardProps> = ({ groups =[] }) => {
  return (
    <div className="chat-page">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>My Groups</h2>
          <button className="create-group-btn">+</button>
        </div>
        <div className="groups-list">
          {groups.length === 0 ? (
            <p className="no-groups">No groups joined yet.</p>
          ) : (
            groups.map((group) => (
              <div key={group.group_id} className="group-item">
                <div className="group-avatar">{group.name[0]}</div>
                <div className="group-info">
                  <h3 className="group-name">{group.name}</h3>
                  <p className="group-members">
                    {group.members.length} member{group.members.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default UserDashboard;
