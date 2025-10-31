import React from 'react';
import type { FilterType } from '../types/Task';
import './FilterButtons.css';

interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  currentFilter,
  onFilterChange,
  taskCounts,
}) => {
  const filters: { label: string; value: FilterType }[] = [
    { label: `All (${taskCounts.all})`, value: 'all' },
    { label: `Active (${taskCounts.active})`, value: 'active' },
    { label: `Completed (${taskCounts.completed})`, value: 'completed' },
  ];

  return (
    <div className="filter-buttons">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={currentFilter === filter.value ? 'filter-btn active' : 'filter-btn'}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;