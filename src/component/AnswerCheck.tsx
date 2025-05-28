import React, { useState } from "react";

interface AnswerCheckProps {
  answerWord: string;
  onCorrect: () => void;
}

const AnswerCheck: React.FC<AnswerCheckProps> = ({ answerWord, onCorrect }) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input === answerWord) {
      onCorrect();
      setInput(""); // 正解時に入力をリセット
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(); // エンターキーでボタンを押したことにする
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress} // キーボードイベントを追加
        placeholder="答えを入力してください"
        style={{ marginRight: "10px" }}
      />
      <button onClick={handleSubmit}>判定</button>
    </div>
  );
};

export default AnswerCheck;
