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

  //TODO アルゴリズムを改善し、下記制約を満たしたまま、representativeLinesが最も短くなるようにする
  //制約 : filterdLinesの各linesのうち少なくとも1つがrepresentativeLinesに含まれるようにする
  filteredLines.forEach((lines) => {
    if (lines.length > 0) {
      const randomLine = lines[Math.floor(Math.random() * lines.length)];
      representativeLines.push(randomLine);
    }
  });

  return representativeLines;
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

  if (start && goal) {
    const paths = findHamiltonianPaths(start, goal, rows, cols);

    answerPath = paths[Math.floor(Math.random() * paths.length)];

    const remainingPaths = paths.filter((path) => path !== answerPath);

    walls = generateWalls(answerPath, remainingPaths, rows, cols);

    answerPath.forEach(([r, c], index) => {
      if (!decidedCells.has(`${r}-${c}`)) {
        cellContent[r][c] = (index + 1).toString();
      }
    });

    return { cellContent, answerPath, walls };
  }

  return { cellContent, answerPath, walls };
}
