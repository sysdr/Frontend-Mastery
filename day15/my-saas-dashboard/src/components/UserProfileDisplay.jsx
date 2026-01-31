import React from 'react';
import { useUserProfileStore } from '../stores/userProfileStore';
import DashboardPanel from './DashboardPanel'; // Reusing panel for consistent styling

function UserProfileDisplay() {
    const { userName, userEmail, isLoggedIn, logout } = useUserProfileStore();

    return (
        <DashboardPanel title="User Profile">
            {isLoggedIn ? (
                <div className="user-details">
                    <p><strong>Name:</strong> {userName}</p>
                    <p><strong>Email:</strong> {userEmail}</p>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <p>Please log in to view your profile.</p>
            )}
        </DashboardPanel>
    );
}

export default UserProfileDisplay;
