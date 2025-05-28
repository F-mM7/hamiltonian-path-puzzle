import "./App.css";
import Grid from "./component/Grid";
import { generateGridData, type Walls } from "./utils/gridUtils";
import AnswerCheck from "./component/AnswerCheck";
import { useState, useEffect } from "react";

function App() {
  const rows = 5;
  const cols = 5;

  const [gridData, setGridData] = useState<{
    cellContent: string[][];
    walls: Walls;
    answerWord: string;
    step: number;
    answerPath: [number, number][] | null;
  } | null>(null);

  useEffect(() => {
    const fetchGridData = async () => {
      const data = await generateGridData(rows, cols);
      setGridData(data);
    };
    fetchGridData();
  }, [rows, cols]);

  const handleAnswerCorrect = async () => {
    const newGridData = await generateGridData(rows, cols);
    setGridData(newGridData); // 新しいGridを生成
  };

  const borderStyles = {
    thin: "1px solid gray",
    thick: "3px solid white",
  };

  if (!gridData) {
    return <div>Loading...</div>; // 初期ロード中の表示
  }

  const { cellContent, walls, answerWord, step } = gridData;

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
