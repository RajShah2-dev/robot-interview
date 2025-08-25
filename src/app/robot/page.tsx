"use client";
import React, { useState, useEffect } from 'react';
import { rotateLeft, rotateRight, moveForward, apiRotate, apiMove, apiReport } from './moveLogic';
import Grid from './Grid';
import Controls from './Controls';


const directions = ['North', 'East', 'South', 'West'];
const robotImages = [
  '/images/robot-up.png',
  '/images/robot-right.png',
  '/images/robot-down.png',
  '/images/robot-left.png'
];

function RobotPage() {
  const [robot, setRobot] = useState<{ x: number; y: number; dir: number } | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load robot position from API on mount
  useEffect(() => {
    async function fetchRobot() {
      try {
        const res = await fetch('http://localhost:4000/api/report');
        const data = await res.json();
        const dirIndex = directions.findIndex(
          d => d.toLowerCase() === (data.direction || '').toLowerCase()
        );
        setRobot({
          x: typeof data.x === 'number' ? data.x : 2,
          y: typeof data.y === 'number' ? data.y : 2,
          dir: dirIndex >= 0 ? dirIndex : 0
        });
      } catch (e) {
        setRobot({ x: 2, y: 2, dir: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchRobot();
  }, []);

  const place = async (x: number, y: number) => {
    if (!robot) return;
    setRobot({ x, y, dir: 0 });
    await apiMove(x, y);
    await apiRotate('North');
  };

  const handleRotateLeft = () => {
    setRobot(r => {
      if (!r) return r;
      const newDir = rotateLeft(r.dir);
      apiRotate(directions[newDir]);
      return { ...r, dir: newDir };
    });
  };
  const handleRotateRight = () => {
    setRobot(r => {
      if (!r) return r;
      const newDir = rotateRight(r.dir);
      apiRotate(directions[newDir]);
      return { ...r, dir: newDir };
    });
  };
  const handleMoveForward = () => {
    setRobot(r => {
      if (!r) return r;
      const next = moveForward(r.x, r.y, r.dir);
      apiMove(next.x, next.y);
      return next;
    });
  };
  const handleReport = async () => {
    const data = await apiReport();
    setReport(`Position: (${data.x}, ${data.y}) | Facing: ${data.direction}`);
  };

  if (loading || !robot) {
    return <></>;
  }
  return (
    <main style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#111827', color: 'white' }}>
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content' }}>
        <h2 style={{ marginBottom: 24, padding: 16, background: '#1f2937', borderRadius: 8, textAlign: 'center', fontWeight: 500 }}>
          Click to place the robot, use the buttons or arrows to move
        </h2>
        <Grid robot={robot} robotImages={robotImages} directions={directions} onPlace={place} />
        <Controls
          onRotateLeft={handleRotateLeft}
          onMoveForward={handleMoveForward}
          onRotateRight={handleRotateRight}
          onReport={handleReport}
        />
        {report && (
          <div style={{ marginTop: 12, color: '#06b6d4', fontSize: '1.1rem', textAlign: 'center' }}>{report}</div>
        )}
      </section>
    </main>
  );
}

export default RobotPage
