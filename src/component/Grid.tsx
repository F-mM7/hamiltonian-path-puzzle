import React from "react";
import type { Walls } from "../utils/gridUtils";

interface GridProps {
  rows: number;
  cols: number;
  cellContent: string[][];
  borderStyles: { thin: string; thick: string };
  cellSize: number;
  walls: Walls;
}

const Grid: React.FC<GridProps> = ({
  rows,
  cols,
  cellContent,
  borderStyles,
  cellSize,
  walls: { horizontal, vertical },
}) => {
  return (
    <div
      style={{
        width: `${cols * cellSize}px`,
        height: `${rows * cellSize}px`,
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        border: borderStyles.thick,
      }}
    >
      {cellContent.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: `${cellSize * 0.4}px`,
              borderTop:
                rowIndex === 0
                  ? borderStyles.thick
                  : borderStyles[
                      horizontal[rowIndex - 1][colIndex] ? "thick" : "thin"
                    ],
              borderLeft:
                colIndex === 0
                  ? borderStyles.thick
                  : borderStyles[
                      vertical[rowIndex][colIndex - 1] ? "thick" : "thin"
                    ],
              borderRight:
                colIndex === cols - 1
                  ? borderStyles.thick
                  : borderStyles[
                      vertical[rowIndex][colIndex] ? "thick" : "thin"
                    ],
              borderBottom:
                rowIndex === rows - 1
                  ? borderStyles.thick
                  : borderStyles[
                      horizontal[rowIndex][colIndex] ? "thick" : "thin"
                    ],
            }}
          >
            {cell}
          </div>
        ))
      )}
    </div>
  );
};

export default Grid;
