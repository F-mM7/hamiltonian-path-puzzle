const words = [
  "せいかい",
  "たんご",
  "ほんやく",
  "かんじ",
  "きょうし",
  "がっこう",
];

export function getRandomWord(): string {
  return words[Math.floor(Math.random() * words.length)];
}
