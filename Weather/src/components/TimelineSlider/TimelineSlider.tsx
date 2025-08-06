import React, { useContext, useEffect } from 'react';
import { Range } from 'react-range';
import { AppContext } from '../../ContextApi/AppContext';
import { formatHour } from '../../utils/helper';
import './TimelineSlider.css';

const TimelineSlider: React.FC = () => {
  const { state, setSelectedTimeRange } = useContext(AppContext)!;

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minHour = 0;
  const maxHour = 23;

  useEffect(() => {
    // Initialize with full day range
    if (state.selectedTimeRange[0] === 0 && state.selectedTimeRange[1] === 0) {
      setSelectedTimeRange([minHour, maxHour]);
    }
  }, [state.selectedTimeRange, setSelectedTimeRange]);

  const handleChange = (values: number[]) => {
    setSelectedTimeRange([values[0], values[1]]);
  };

  return (
    <div className="timeline-slider p-3 bg-light rounded">
      <h5 className="text-center mb-3">Select Time Range</h5>
      <div className="d-flex justify-content-between mb-2">
        <span>{formatHour(state.selectedTimeRange[0])}</span>
        <span>{formatHour(state.selectedTimeRange[1])}</span>
      </div>
      <Range
        step={1}
        min={minHour}
        max={maxHour}
        values={state.selectedTimeRange}
        onChange={handleChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '6px',
              width: '100%',
              backgroundColor: '#ddd',
              borderRadius: '3px',
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '20px',
              width: '20px',
              backgroundColor: '#007bff',
              borderRadius: '50%',
              outline: 'none',
            }}
          />
        )}
      />
      <div className="d-flex justify-content-between mt-1">
        {hours.map(hour => (
          <div key={hour} className="hour-tick">
            {hour % 6 === 0 ? (
              <small className="d-block text-center">{formatHour(hour)}</small>
            ) : (
              <small className="d-block text-center">·</small>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineSlider;