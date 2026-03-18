import React from 'react';

const FilterDropdown = ({ options, selectedValue, onSelect, label }) => {
  const handleChange = (e) => {
    onSelect(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700">{label}:</label>
      <select
        value={selectedValue}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
