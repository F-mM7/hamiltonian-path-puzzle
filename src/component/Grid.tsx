import React from "react";

interface GridProps {
  rows: number;
  cols: number;
  cellContent: string[][];
  borderStyles: { thin: string; thick: string };
  cellSize: number;
  horizontalLine: boolean[][]; // 新しいプロパティ
  verticalLine: boolean[][]; // 新しいプロパティ
}

const Grid: React.FC<GridProps> = ({
  rows,
  cols,
  cellContent,
  borderStyles,
  cellSize,
  horizontalLine,
  verticalLine,
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
              borderTop:
                rowIndex === 0
                  ? borderStyles.thick
                  : borderStyles[
                      horizontalLine[rowIndex - 1][colIndex] ? "thick" : "thin"
                    ],
              borderLeft:
                colIndex === 0
                  ? borderStyles.thick
                  : borderStyles[
                      verticalLine[rowIndex][colIndex - 1] ? "thick" : "thin"
                    ],
              borderRight:
                colIndex === cols - 1
                  ? borderStyles.thick
                  : borderStyles[
                      verticalLine[rowIndex][colIndex] ? "thick" : "thin"
                    ],
              borderBottom:
                rowIndex === rows - 1
                  ? borderStyles.thick
                  : borderStyles[
                      horizontalLine[rowIndex][colIndex] ? "thick" : "thin"
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
