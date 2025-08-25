import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RobotPage from './page';

// Mock moveLogic API functions
jest.mock('./moveLogic', () => ({
  rotateLeft: jest.fn(dir => (dir + 3) % 4),
  rotateRight: jest.fn(dir => (dir + 1) % 4),
  moveForward: jest.fn((x, y, dir) => {
    if (dir === 0 && y < 4) y += 1;
    if (dir === 1 && x < 4) x += 1;
    if (dir === 2 && y > 0) y -= 1;
    if (dir === 3 && x > 0) x -= 1;
    return { x, y, dir };
  }),
  apiRotate: jest.fn(),
  apiMove: jest.fn(),
  apiReport: jest.fn(() => Promise.resolve({ x: 2, y: 3, direction: 'North' }))
}));

describe('RobotPage UI', () => {
  test('robot follows PLACE 1,2,North; MOVE; MOVE; RIGHT; MOVE; REPORT sequence', async () => {
    render(<RobotPage />);
    // PLACE 1,2,North (x=1, y=2, dir=0)
    // Since grid is rendered from y=4 to y=0, idx = (4-y)*5 + x
    await waitFor(() => {
        fireEvent.click(screen.getByTestId('cell-1-2'));
    });
    await waitFor(() => {
      expect(require('./moveLogic').apiMove).toHaveBeenCalledWith(1, 2);
      expect(require('./moveLogic').apiRotate).toHaveBeenCalledWith('North');
    });

    // MOVE (should go north, y+1)
    const moveBtn = screen.getByText('Move');
    fireEvent.click(moveBtn);
    await waitFor(() => {
      expect(require('./moveLogic').apiMove).toHaveBeenCalled();
    });

    // MOVE again
    fireEvent.click(moveBtn);
    await waitFor(() => {
      expect(require('./moveLogic').apiMove).toHaveBeenCalled();
    });

    // RIGHT (rotate right)
    const rightBtn = screen.getByText('Right');
    fireEvent.click(rightBtn);
    await waitFor(() => {
      expect(require('./moveLogic').apiRotate).toHaveBeenCalled();
    });

    // MOVE (should go east, x+1)
    fireEvent.click(moveBtn);
    await waitFor(() => {
      expect(require('./moveLogic').apiMove).toHaveBeenCalled();
    });

    // REPORT
    const reportBtn = screen.getByText('Report');
    fireEvent.click(reportBtn);
    await waitFor(() => {
    expect(screen.getByText('Position: (2, 4) | Facing: East')).toBeInTheDocument();
    });
  });
  test('robot direction updates on rotate', async () => {
    render(<RobotPage />);
    const leftBtn = screen.getByText('Left');
    const rightBtn = screen.getByText('Right');
    // Initial direction is down (index 2)
    fireEvent.click(leftBtn);
    await waitFor(() => {
      // Should call apiRotate with new direction
      expect(require('./moveLogic').apiRotate).toHaveBeenCalled();
    });
    fireEvent.click(rightBtn);
    await waitFor(() => {
      expect(require('./moveLogic').apiRotate).toHaveBeenCalled();
    });
  });

  test('robot moves correctly on grid', async () => {
    render(<RobotPage />);
    const moveBtn = screen.getByText('Move');
    fireEvent.click(moveBtn);
    await waitFor(() => {
      expect(require('./moveLogic').apiMove).toHaveBeenCalled();
    });
  });

  test('report updates correctly', async () => {
    render(<RobotPage />);
    const reportBtn = screen.getByText('Report');
    fireEvent.click(reportBtn);
    await waitFor(() => {
      expect(screen.getByText(/Position: \(2, 3\) \| Facing: North/)).toBeInTheDocument();
    });
  });

  test('placing robot updates direction and position', async () => {
    render(<RobotPage />);
    // Find a grid cell and click it
    const gridCells = screen.getAllByRole('img');
    // Simulate placing at (0,0)
    fireEvent.click(gridCells[0].parentElement!);
    await waitFor(() => {
      expect(require('./moveLogic').apiMove).toHaveBeenCalled();
      expect(require('./moveLogic').apiRotate).toHaveBeenCalledWith('North');
    });
  });
});
