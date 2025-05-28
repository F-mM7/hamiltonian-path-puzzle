export function generateGridData(rows: number, cols: number) {
  // 空のグリッドを作成
  const cellContent: string[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => "")
  );

  // row + col が偶数のセルを収集
  const evenCells: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r + c) % 2 === 0) {
        evenCells.push([r, c]);
      }
    }
  }

  // 偶数セルから異なる2つをランダムに選択
  const shuffled = evenCells.sort(() => Math.random() - 0.5);
  const [start, goal] = [shuffled[0], shuffled[1]];

  // S と G を配置
  const decidedCells = new Set<string>();
  if (start) {
    cellContent[start[0]][start[1]] = "S";
    decidedCells.add(`${start[0]}-${start[1]}`);
  }
  if (goal) {
    cellContent[goal[0]][goal[1]] = "G";
    decidedCells.add(`${goal[0]}-${goal[1]}`);
  }

  const horizontalLine = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() > 0.5)
  );

  const verticalLine = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() > 0.5)
  );

  function generateAllHamiltonianPaths(
    start: [number, number],
    goal: [number, number]
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

  function generateLineList(path: [number, number][]): {
    type: "horizontal" | "vertical";
    coord: [number, number];
  }[] {
    const lineList: {
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
      lineList.push({ type, coord });
    }
    return lineList;
  }

  let answerPath: [number, number][] | null = null;
  if (start && goal) {
    const paths = generateAllHamiltonianPaths(start, goal);

    answerPath = paths[Math.floor(Math.random() * paths.length)];
    console.log("Selected Hamiltonian Path (Answer):", answerPath);

    const remainingPaths = paths.filter((path) => path !== answerPath);
    console.log("Remaining Hamiltonian Paths:", remainingPaths);

    const lineList = generateLineList(answerPath);
    console.log("Lines traversed by answerPath:", lineList);

    const horizontalLine = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => true)
    );
    const verticalLine = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => true)
    );

    for (const { type, coord } of lineList) {
      const [r, c] = coord;

      if (type === "horizontal") {
        horizontalLine[r][c] = false;
      } else if (type === "vertical") {
        verticalLine[r][c] = false;
      }
    }

    answerPath.forEach(([r, c], index) => {
      if (!decidedCells.has(`${r}-${c}`)) {
        cellContent[r][c] = (index + 1).toString();
      }
    });

    return { cellContent, horizontalLine, verticalLine, answerPath };
  }

  return { cellContent, horizontalLine, verticalLine, answerPath };
}
