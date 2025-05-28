import "./App.css";
import Grid from "./component/Grid";
import { generateGridData } from "./utils/gridUtils"; // 新しいファイルからインポート

function App() {
  const rows = 5;
  const cols = 5;

  const { cellContent, horizontalLine, verticalLine } = generateGridData(
    rows,
    cols
  );

  const borderStyles = {
    thin: "1px solid gray",
    thick: "3px solid white",
  };

  return (
    <>
      <Grid
        cellSize={50}
        rows={rows}
        cols={cols}
        cellContent={cellContent}
        borderStyles={borderStyles}
        horizontalLine={horizontalLine}
        verticalLine={verticalLine}
      />
    </>
  );
}

export default App;
