export async function getRandomWord(n: number): Promise<string> {
  const response = await fetch(
    "https://raw.githubusercontent.com/F-mM7/hamiltonian-path-puzzle/refs/heads/gh-pages/wordList.txt"
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch word list: ${response.statusText}`);
  }
  const fileContent = await response.text();
  const words = fileContent
    .split("\n")
    .map((word) => word.trim())
    .filter((word) => word.length === n); // n文字の単語をフィルタリング
  if (words.length === 0) {
    throw new Error(`No words found with ${n} characters.`);
  }
  return words[Math.floor(Math.random() * words.length)];
}
