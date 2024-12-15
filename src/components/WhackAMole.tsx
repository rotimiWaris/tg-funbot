import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import useFetchUser from "../config/useFetchUser";
import supabase from "../config/supabaseClient";
import "../index.css";

interface Props {
  userId: string | null;
}

export default function WhackAMole({ userId }: Props) {
  const { data: userData, loading } = useFetchUser(userId);
  const navigate = useNavigate();

  const [startGame, setStartGame] = useState(false);
  const [squares, setSquares] = useState(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [currentTime, setCurrentTime] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [hitPosition, setHitPosition] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // To store the interval ID

  const randomSquare = () => {
    // Reset all squares
    const newSquares = Array(9).fill(false);

    // Choose a random position
    const randomIndex = Math.floor(Math.random() * 9);
    newSquares[randomIndex] = true;

    // Update state
    setSquares(newSquares);
    setHitPosition(randomIndex);
  };

  const handleSquareClick = (index: number | null) => {
    if (index === hitPosition) {
      setScore((prevScore) => prevScore + 1); // Increment the score
    }
  };

  const start = () => {
    if (startGame) return; // Prevent starting multiple intervals
    setStartGame(true);
    setGameOver(false);
    setCurrentTime(60); // Reset timer
    setScore(0);

    const interval = setInterval(() => {
      randomSquare();
    }, 1000); // Change square every second

    timerRef.current = setInterval(() => {
      setCurrentTime((prevCurrentTime) => {
        if (prevCurrentTime === 0) {
          clearInterval(timerRef.current as NodeJS.Timeout); // Stop timer
          setStartGame(false);
          setGameOver(true);
          updateHighScore();
          return 0;
        }
        return prevCurrentTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Clean up on component unmount
  };

  const restart = () => {
    if (startGame) return; // Prevent starting multiple intervals
    setStartGame(true);
    setGameOver(false);
    setCurrentTime(60); // Reset timer
    setScore(0);

    timerRef.current = setInterval(() => {
      setCurrentTime((prevCurrentTime) => {
        if (prevCurrentTime === 0) {
          clearInterval(timerRef.current as NodeJS.Timeout); // Stop timer
          setStartGame(false);
          setGameOver(true);
          updateHighScore();
          return 0;
        }
        return prevCurrentTime - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  };
  // useEffect(() => {
  //   if (gameOver) {
  //     alert(`GAME OVER! Your score is ${score}`);
  //     // Optionally reset the game
  //     // setScore(0);
  //     // setCurrentTime(30);
  //     // setGameOver(false);
  //   }
  // }, [gameOver]);
  const updateHighScore = async () => {
    if (userData && score > userData.high_score) {
      const { error } = await supabase
        .from("users")
        .update({ high_score: score })
        .eq("id", userId);

      if (error) {
        console.error("Error updating high score:", error);
      } else {
        console.error("High score updated!");
      }
    }
  };

  if (loading) return <div>Loading user data...</div>;

  return (
    <>
      {!startGame && !gameOver && (
        <div className="container">
          <div className="small-card start">
            <button
              onClick={start}
              style={{
                padding: "0.5rem 1rem",
                background: "#3bb7c7",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.75rem",
              }}
            >
              Start
            </button>
          </div>
        </div>
      )}
      {startGame && (
        <div
          style={{
            padding: "2rem",
            margin: "0 0.5rem",
            maxWidth: "98%",
            height: "90vh",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            position: "relative",
          }}
        >
          <h2>Whack A Mole</h2>
          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <h4>
              Your Score: <span id="score">{score}</span>
            </h4>

            <h4>
              Time Left: <span id="time-left">{currentTime}</span>
            </h4>
          </div>
          <div className="grid">
            {squares.map((isMole, index) => (
              <div
                key={index}
                className={`square ${isMole ? "mole" : ""}`}
                onMouseUp={() => handleSquareClick(index)}
              ></div>
            ))}
          </div>
        </div>
      )}
      {gameOver && (
        <div className="game-over-container">
          <div className="game-over">
            <h5>
              Game Over! Well done {userData?.username}. You scored {score}
            </h5>
            {userData?.high_score && (
              <h5>High Score: {userData?.high_score}</h5>
            )}
            <div>
              <br />
              <button
                onClick={() => navigate("/tg-funbot/")}
                style={{
                  marginRight: "5px",
                  padding: "0.5rem 1rem",
                  background: "#111",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                Home
              </button>
              <button
                onClick={restart}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#65d4e2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
