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
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>Loading...</div>
    ); // 初期ロード中の表示
  }

  const { cellContent, walls, answerWord, step } = gridData;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <p style={{ marginBottom: "16px", lineHeight: "1.5" }}>
        隣り合ったマスに移動できるが、太線は通過できない。
      </p>
      <p style={{ marginBottom: "16px", lineHeight: "1.5" }}>
        SからGへ、全てのマスをちょうど1度ずつ通り辿れ。
      </p>
      <p style={{ marginBottom: "16px", lineHeight: "1.5" }}>
        Sを1マス目としたとき、
        <strong style={{ fontSize: "24px", lineHeight: "1" }}> {step} </strong>
        の倍数マス目の平仮名を順に拾え。
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Grid
          cellSize={80}
          rows={rows}
          cols={cols}
          cellContent={cellContent}
          borderStyles={borderStyles}
          walls={walls}
        />
      </div>
      <AnswerCheck answerWord={answerWord} onCorrect={handleAnswerCorrect} />
    </div>
  );
}

export default App;
