import React from 'react';

interface ControlsProps {
  onRotateLeft: () => void;
  onMoveForward: () => void;
  onRotateRight: () => void;
  onReport: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onRotateLeft, onMoveForward, onRotateRight, onReport }) => (
  <>
    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
      <button onClick={onRotateLeft} style={{ background: '#06b6d4', padding: '8px 16px', borderRadius: '6px', border: 'none', color: 'white' }}>Left</button>
      <button onClick={onMoveForward} style={{ background: '#06b6d4', padding: '8px 16px', borderRadius: '6px', border: 'none', color: 'white' }}>Move</button>
      <button onClick={onRotateRight} style={{ background: '#06b6d4', padding: '8px 16px', borderRadius: '6px', border: 'none', color: 'white' }}>Right</button>
    </div>
    <button onClick={onReport} style={{ border: '1px solid #06b6d4', padding: '8px 16px', borderRadius: '6px', background: 'none', color: 'white' }}>Report</button>
  </>
);

export default Controls;
