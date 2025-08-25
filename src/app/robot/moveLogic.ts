
const API_URL = 'http://localhost:4000/api';

// Direction: 0=up, 1=right, 2=down, 3=left
export function rotateLeft(dir: number): number {
  // Counterclockwise: North -> West -> South -> East -> North
  return (dir - 1 + 4) % 4;
}

export function rotateRight(dir: number): number {
  // Clockwise: North -> East -> South -> West -> North
  return (dir + 1) % 4;
}

export function moveForward(x: number, y: number, dir: number): { x: number; y: number; dir: number } {
  // 0: north (up), 1: east (right), 2: south (down), 3: west (left)
  if (dir === 0 && y < 4) y += 1; // north is up, so increase y
  if (dir === 1 && x < 4) x += 1; // east
  if (dir === 2 && y > 0) y -= 1; // south is down, so decrease y
  if (dir === 3 && x > 0) x -= 1; // west
  return { x, y, dir };
}

// API calls
export async function apiRotate(direction: string): Promise<any> {
  const res = await fetch(`${API_URL}/rotate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ direction })
  });
  return res.json();
}

export async function apiMove(x: number, y: number): Promise<any> {
  const res = await fetch(`${API_URL}/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ x, y })
  });
  return res.json();
}

export async function apiReport(): Promise<any> {
  const res = await fetch(`${API_URL}/report`);
  return res.json();
}
