import { getRandomWord } from "./wordUtils";

// 型定義
export interface Walls {
  horizontal: boolean[][];
  vertical: boolean[][];
}

function findHamiltonianPaths(
  start: [number, number],
  goal: [number, number],
  rows: number,
  cols: number
): [number, number][][] {
  const paths: [number, number][][] = [];
  const path: [number, number][] = [];
  const visited = new Set<string>();

  function dfs(current: [number, number]) {
    const [r, c] = current;
    if (
      visited.size === rows * cols - 1 &&
      current[0] === goal[0] &&
      current[1] === goal[1]
    ) {
      path.push(current);
      paths.push([...path]);
      path.pop();
      return;
    }

    visited.add(`${r}-${c}`);
    path.push(current);

    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !visited.has(`${nr}-${nc}`)
      ) {
        dfs([nr, nc]);
      }
    }

    path.pop();
    visited.delete(`${r}-${c}`);
  }

  dfs(start);
  return paths;
}

function extractLinesFromPath(path: [number, number][]): {
  type: "horizontal" | "vertical";
  coord: [number, number];
}[] {
  const lines: {
    type: "horizontal" | "vertical";
    coord: [number, number];
  }[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];
    const type = from[0] === to[0] ? "vertical" : "horizontal";
    const coord: [number, number] = [
      Math.min(from[0], to[0]),
      Math.min(from[1], to[1]),
    ];
    lines.push({ type, coord });
  }
  return lines;
}

function selectRepresentativeLines(
  filteredLines: {
    type: "horizontal" | "vertical";
    coord: [number, number];
  }[][]
): {
  type: "horizontal" | "vertical";
  coord: [number, number];
}[] {
  const representativeLines: {
    type: "horizontal" | "vertical";
    coord: [number, number];
  }[] = [];

  const uncoveredSets = new Set<number>();
  filteredLines.forEach((_, index) => uncoveredSets.add(index));

  while (uncoveredSets.size > 0) {
    const lineCoverage = new Map<string, Set<number>>();

    filteredLines.forEach((lines, index) => {
      if (uncoveredSets.has(index)) {
        lines.forEach((line) => {
          const lineKey = `${line.type}-${line.coord[0]}-${line.coord[1]}`;
          if (!lineCoverage.has(lineKey)) {
            lineCoverage.set(lineKey, new Set());
          }
          lineCoverage.get(lineKey)?.add(index);
        });
      }
    });

    let bestLine: string | null = null;
    let maxCoverage = 0;

    lineCoverage.forEach((coveredSets, lineKey) => {
      if (coveredSets.size > maxCoverage) {
        bestLine = lineKey;
        maxCoverage = coveredSets.size;
      }
    });

    if (bestLine) {
      const [type, r, c] = bestLine.split("-");
      representativeLines.push({
        type: type as "horizontal" | "vertical",
        coord: [parseInt(r, 10), parseInt(c, 10)],
      });

      const coveredSets = lineCoverage.get(bestLine)!;
      coveredSets.forEach((setIndex) => uncoveredSets.delete(setIndex));
    }
  }

  return representativeLines;
}

// DEBUG
function validateRepresentativeLines(
  filteredLines: {
    type: "horizontal" | "vertical";
    coord: [number, number];
  }[][],
  representativeLines: {
    type: "horizontal" | "vertical";
    coord: [number, number];
  }[]
): void {
  filteredLines.forEach((lines) => {
    if (lines.length > 0) {
      const hasRepresentative = lines.some((line) =>
        representativeLines.some(
          (repLine) =>
            repLine.type === line.type &&
            repLine.coord[0] === line.coord[0] &&
            repLine.coord[1] === line.coord[1]
        )
      );
      if (!hasRepresentative) {
        console.warn("Filtered lines do not have a representative line.");
      }
    }
  });
}

function generateWalls(
  answerPath: [number, number][],
  remainingPaths: [number, number][][],
  rows: number,
  cols: number
): Walls {
  const answerLines = new Set(
    extractLinesFromPath(answerPath).map(
      (line) => `${line.type}-${line.coord[0]}-${line.coord[1]}`
    )
  );

  const filteredLines = remainingPaths.map((path) =>
    extractLinesFromPath(path).filter(
      (line) =>
        !answerLines.has(`${line.type}-${line.coord[0]}-${line.coord[1]}`)
    )
  );

  const representativeLines = selectRepresentativeLines(filteredLines);

  // DEBUG
  validateRepresentativeLines(filteredLines, representativeLines);

  const horizontal = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false)
  );
  const vertical = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false)
  );

  for (const { type, coord } of representativeLines) {
    const [r, c] = coord;

    if (type === "horizontal") {
      horizontal[r][c] = true;
    } else if (type === "vertical") {
      vertical[r][c] = true;
    }
  }

  return { horizontal, vertical };
}

export function generateGridData(rows: number, cols: number) {
  const cellContent: string[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => "")
  );

  const evenCells: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r + c) % 2 === 0) {
        evenCells.push([r, c]);
      }
    }
  }

  const shuffled = evenCells.sort(() => Math.random() - 0.5);
  const [start, goal] = [shuffled[0], shuffled[1]];

  const decidedCells = new Set<string>();
  if (start) {
    cellContent[start[0]][start[1]] = "S";
    decidedCells.add(`${start[0]}-${start[1]}`);
  }
  if (goal) {
    cellContent[goal[0]][goal[1]] = "G";
    decidedCells.add(`${goal[0]}-${goal[1]}`);
  }

  let answerPath: [number, number][] | null = null;
  let walls: Walls = { horizontal: [], vertical: [] };
  let answerWord = "";
  let step = 0;

  if (start && goal) {
    const paths = findHamiltonianPaths(start, goal, rows, cols);

    answerPath = paths[Math.floor(Math.random() * paths.length)];

    const remainingPaths = paths.filter((path) => path !== answerPath);

    walls = generateWalls(answerPath, remainingPaths, rows, cols);

    answerWord = getRandomWord(); // 外部ファイルからランダムに選択
    step = Math.floor(answerPath.length - 1) / answerWord.length;

    answerPath.forEach(([r, c], index) => {
      if (index === 0) cellContent[r][c] = "Ｓ";
      else if (index === answerPath?.length - 1) cellContent[r][c] = "Ｇ";
      else if ((index + 1) % step === 0) {
        cellContent[r][c] = answerWord[(index + 1) / step - 1];
      } else {
        cellContent[r][c] = String.fromCharCode(
          0x3041 + Math.floor(Math.random() * 86)
        );
      }
    });

    return { cellContent, answerPath, walls, answerWord, step };
  }

  return { cellContent, answerPath, walls, answerWord, step };
}
