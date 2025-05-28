import React, { useState } from "react";

interface AnswerCheckProps {
  answerWord: string;
  onCorrect: () => void;
}

const AnswerCheck: React.FC<AnswerCheckProps> = ({ answerWord, onCorrect }) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input === answerWord) onCorrect();
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="答えを入力してください"
        style={{ marginRight: "10px" }}
      />
      <button onClick={handleSubmit}>判定</button>
    </div>
  );
};

export default AnswerCheck;
