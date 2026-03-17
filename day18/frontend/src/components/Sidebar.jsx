import React from 'react';
import './Sidebar.css';

const MENU_ITEMS = ['Dashboard', 'Analytics', 'Reports', 'Settings'];

const Sidebar = ({ onMenuSelect }) => {
    const handleClick = (item) => {
        if (typeof onMenuSelect === 'function') {
            onMenuSelect(item);
        } else {
            alert(`Selected: ${item}`);
        }
    };

    return (
        <nav className="dashboard-sidebar" aria-label="Main navigation">
            <h2>Menu</h2>
            <ul>
                {MENU_ITEMS.map((item) => (
                    <li key={item}>
                        <button
                            type="button"
                            className="sidebar-menu-item"
                            onClick={() => handleClick(item)}
                            aria-label={`Open ${item}`}
                        >
                            {item}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
export default Sidebar;
