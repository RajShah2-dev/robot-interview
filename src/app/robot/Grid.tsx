import React from 'react';

interface GridProps {
  robot: { x: number; y: number; dir: number };
  robotImages: string[];
  directions: string[];
  onPlace: (x: number, y: number) => void;
}

const Grid: React.FC<GridProps> = ({ robot, robotImages, directions, onPlace }) => {
  const cells = [];
  const length = 5
  const width = 5
  for (let y = length-1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const isRobot = robot.x === x && robot.y === y;
      cells.push(
        <div
          key={idx}
          data-testid={`cell-${x}-${y}`}
          style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #222', cursor: 'pointer' }}
          onClick={() => onPlace(x, y)}
        >
          {isRobot ? (
            <img
              src={robotImages[robot.dir]}
              alt={`Robot facing ${directions[robot.dir]}`}
              style={{ width: '40px', height: '40px' }}
            />
          ) : null}
        </div>
      );
    }
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 60px)', gridTemplateRows: 'repeat(5, 60px)', gap: '8px', marginBottom: '24px' }}>
      {cells}
    </div>
  );
};

export default Grid;
