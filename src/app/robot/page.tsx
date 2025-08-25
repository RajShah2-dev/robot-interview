"use client";
import React, { useState, useEffect } from 'react'
import { rotateLeft, rotateRight, moveForward, apiRotate, apiMove, apiReport } from './moveLogic';

function RobotPage() {
  async function place(x: number, y: number) {
    setRobot({ x, y, dir: 0 });
    await apiMove(x, y);
    await apiRotate('North');
  }

  function setGrid() {
    const cells = [];
    for (let y = 4; y >= 0; y--) {
      for (let x = 0; x < 5; x++) {
        const idx = y * 5 + x;
        const isRobot = robot.x === x && robot.y === y;
        cells.push(
          <div
            key={idx}
            data-testid={`cell-${x}-${y}`}
            style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #222', cursor: 'pointer' }}
            onClick={() => place(x, y)}
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
    return cells;
  }
  const [report, setReport] = useState<string | null>(null);
  // 0: North, 1: East, 2: South, 3: West
  const [robot, setRobot] = useState({ x: 2, y: 2, dir: 0 });
  const directions = ['North', 'East', 'South', 'West'];
  const robotImages = [
    '/images/robot-up.png',
    '/images/robot-right.png',
    '/images/robot-down.png',
    '/images/robot-left.png'
  ];

  // Load robot position from API on mount
  useEffect(() => {
    async function fetchRobot() {
      try {
        const res = await fetch('http://localhost:4000/api/report');
        const data = await res.json();
        // Map direction string to dir index
        const dirIndex = directions.findIndex(
          d => d.toLowerCase() === (data.direction || '').toLowerCase()
        );
        setRobot({
          x: typeof data.x === 'number' ? data.x : 2,
          y: typeof data.y === 'number' ? data.y : 2,
          dir: dirIndex >= 0 ? dirIndex : 0
        });
      } catch (e) {
        // fallback to default
      }
    }
    fetchRobot();
  }, []);

  const handleRotateLeft = async () => {
    setRobot(r => {
      const newDir = rotateLeft(r.dir);
      apiRotate(directions[newDir]);
      return { ...r, dir: newDir };
    });
  };
  const handleRotateRight = async () => {
    setRobot(r => {
      const newDir = rotateRight(r.dir);
      apiRotate(directions[newDir]);
      return { ...r, dir: newDir };
    });
  };
  const handleMoveForward = async () => {
    setRobot(r => {
      const next = moveForward(r.x, r.y, r.dir);
      apiMove(next.x, next.y);
      return next;
    });
  };

  const handleReport = async () => {
    const data = await apiReport();
    setReport(`Position: (${data.x}, ${data.y}) | Facing: ${data.direction}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#111827', color: 'white' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '24px', padding: '16px', background: '#1f2937', borderRadius: '8px', textAlign: 'center' }}>
          Click to place the robot, use the buttons or arrows to move
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 60px)', gridTemplateRows: 'repeat(5, 60px)', gap: '8px', marginBottom: '24px' }}>
          {setGrid()}
        </div>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <button onClick={handleRotateLeft} style={{ background: '#06b6d4', padding: '8px 16px', borderRadius: '6px', border: 'none', color: 'white' }}>Left</button>
          <button onClick={handleMoveForward} style={{ background: '#06b6d4', padding: '8px 16px', borderRadius: '6px', border: 'none', color: 'white' }}>Move</button>
          <button onClick={handleRotateRight} style={{ background: '#06b6d4', padding: '8px 16px', borderRadius: '6px', border: 'none', color: 'white' }}>Right</button>
        </div>
        <button onClick={handleReport} style={{ border: '1px solid #06b6d4', padding: '8px 16px', borderRadius: '6px', background: 'none', color: 'white' }}>Report</button>
        {report && (
          <div style={{ marginTop: '12px', color: '#06b6d4', fontSize: '1.1rem', textAlign: 'center' }}>{report}</div>
        )}
      </div>
    </div>
  );
}

export default RobotPage
