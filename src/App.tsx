import "./App.css";
import Grid from "./component/Grid";
import { generateGridData } from "./utils/gridUtils";
import AnswerCheck from "./component/AnswerCheck"; // 新しいコンポーネントをインポート
import { useState } from "react";

function App() {
  const rows = 5;
  const cols = 5;

  const [gridData, setGridData] = useState(() => generateGridData(rows, cols));
  const { cellContent, walls, answerWord, step } = gridData;

  const borderStyles = {
    thin: "1px solid gray",
    thick: "3px solid white",
  };

  const handleAnswerCorrect = () => {
    setGridData(generateGridData(rows, cols)); // 新しいGridを生成
  };

  console.log(answerWord);

  return (
    <>
      <>{step}</>
      <Grid
        cellSize={50}
        rows={rows}
        cols={cols}
        cellContent={cellContent}
        borderStyles={borderStyles}
        walls={walls}
      />
      <AnswerCheck answerWord={answerWord} onCorrect={handleAnswerCorrect} />
    </>
  );
}

export default App;
