import { useState, useEffect } from 'react';
import GetImage from './components/GetImage';

function App() {
  const [cards, setCards] = useState([]);
  const [clickCount, setClickCount] = useState({});
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const pokemon = [
    "togepi", "cleffa", "munchlax", "pichu", "magby",
    "mantyke", "smoochum", "elekid", "azurill", "wynaut",
    "chingling", "bonsly"
  ];

  useEffect(() => {
    const fetchCards = async () => {
      const cardData = await Promise.all(
        pokemon.map(async (name) => {
          const imageUrl = await GetImage(name);
          return { name, imageUrl };
        })
      );
      setCards(cardData);
    };

    fetchCards();
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const resetGame = () => {
    setClickCount({});
    setGameOver(false);
    setScore(0);
  };

  const handleCardClick = async (index) => {
    if (gameOver) {
      resetGame();
      return;
    }

    const clickedPokemon = cards[index].name;
    const newClickCount = { ...clickCount };
    newClickCount[clickedPokemon] = (newClickCount[clickedPokemon] || 0) + 1;

    if (newClickCount[clickedPokemon] > 1) {
      setGameOver(true);

      if (score > bestScore) {
        setBestScore(score);
      }

      setTimeout(() => {
        resetGame();
      }, 1000);
    } else {
      setClickCount(newClickCount);
      const newScore = score + 1;
      setScore(newScore);

      if (newScore > bestScore) {
        setBestScore(newScore);
      }

      const randomPokemon = pokemon[Math.floor(Math.random() * pokemon.length)];
      const newImage = await GetImage(randomPokemon);

      const newCards = [...cards];
      newCards[index] = { name: randomPokemon, imageUrl: newImage };

      setCards(shuffleArray(newCards));
    }
  };

  return (
    <div className="content">
      <div className="headerLine">
        <h2>Pokemon Memory Game</h2>
        <div className = "score-box">
          <div className="score">Score: {score}</div>
          <div className="best-score">Best Score: {bestScore}</div>
        </div>
      </div>
      <div className="container">
        {cards.map((card, i) => (
          <div
            key={i}
            className="card"
            onClick={() => handleCardClick(i)}
          >
            <img src={card.imageUrl} alt={card.name} />
            <p className="pokemon-name">{card.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;