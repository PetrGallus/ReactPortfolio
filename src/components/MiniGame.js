import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const BOARD_SIZE = 15;
const INITIAL_SNAKE = [
    { x: 7, y: 7 },
    { x: 6, y: 7 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };

function getRandomFood(snake) {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE),
        };
    } while (snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
    return newFood;
}

export default function MiniGame() {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE));
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [highscores, setHighscores] = useState(() => {
        const saved = localStorage.getItem("snake_highscores");
        return saved ? JSON.parse(saved) : [];
    });
    const [playerName, setPlayerName] = useState("");
    const [showNameInput, setShowNameInput] = useState(false);
    const moveRef = useRef(direction);
    const runningRef = useRef(true);

    useEffect(() => {
        moveRef.current = direction;
    }, [direction]);

    useEffect(() => {
        function handleKey(e) {
            if (!runningRef.current) return;
            if (e.key === "ArrowUp" && moveRef.current.y !== 1) setDirection({ x: 0, y: -1 });
            else if (e.key === "ArrowDown" && moveRef.current.y !== -1) setDirection({ x: 0, y: 1 });
            else if (e.key === "ArrowLeft" && moveRef.current.x !== 1) setDirection({ x: -1, y: 0 });
            else if (e.key === "ArrowRight" && moveRef.current.x !== -1) setDirection({ x: 1, y: 0 });
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    useEffect(() => {
        if (gameOver) return;
        const interval = setInterval(() => {
            setSnake(prevSnake => {
                const newHead = {
                    x: (prevSnake[0].x + moveRef.current.x + BOARD_SIZE) % BOARD_SIZE,
                    y: (prevSnake[0].y + moveRef.current.y + BOARD_SIZE) % BOARD_SIZE,
                };
                // Collision with self
                if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
                    setGameOver(true);
                    runningRef.current = false;
                    return prevSnake;
                }
                let newSnake;
                if (newHead.x === food.x && newHead.y === food.y) {
                    newSnake = [newHead, ...prevSnake];
                    setFood(getRandomFood(newSnake));
                    setScore(s => s + 1);
                } else {
                    newSnake = [newHead, ...prevSnake.slice(0, -1)];
                }
                return newSnake;
            });
        }, 120);
        return () => clearInterval(interval);
    }, [food, gameOver]);

    useEffect(() => {
        if (gameOver && score > 0) {
            setShowNameInput(true);
        }
    }, [gameOver, score]);

    function saveHighscore(name, score) {
        const newScores = [...highscores, { name: name || "Anonymous", score }];
        newScores.sort((a, b) => b.score - a.score);
        const topScores = newScores.slice(0, 5);
        setHighscores(topScores);
        localStorage.setItem("snake_highscores", JSON.stringify(topScores));
    }

    function handleNameSubmit(e) {
        e.preventDefault();
        saveHighscore(playerName, score);
        setPlayerName("");
        setShowNameInput(false);
    }

    function handleRestart() {
        setSnake(INITIAL_SNAKE);
        setDirection(INITIAL_DIRECTION);
        setFood(getRandomFood(INITIAL_SNAKE));
        setScore(0);
        setGameOver(false);
        runningRef.current = true;
        setShowNameInput(false);
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Typography variant="h4" mb={2}>Snake Game</Typography>
            <Typography variant="h6" mb={2}>Body: {score}</Typography>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateRows: `repeat(${BOARD_SIZE}, 20px)`,
                    gridTemplateColumns: `repeat(${BOARD_SIZE}, 20px)`,
                    border: "3px solid #222",
                    background: "#111",
                    marginBottom: 2,
                }}
            >
                {[...Array(BOARD_SIZE * BOARD_SIZE)].map((_, i) => {
                    const x = i % BOARD_SIZE;
                    const y = Math.floor(i / BOARD_SIZE);
                    const isSnake = snake.some(seg => seg.x === x && seg.y === y);
                    const isHead = snake[0].x === x && snake[0].y === y;
                    const isFood = food.x === x && food.y === y;
                    return (
                        <Box
                            key={i}
                            sx={{
                                width: 20,
                                height: 20,
                                boxSizing: "border-box",
                                background: isHead
                                    ? "#0f0"
                                    : isSnake
                                    ? "#6f6"
                                    : isFood
                                    ? "#f00"
                                    : "#222",
                                border: "1px solid #222",
                            }}
                        />
                    );
                })}
            </Box>
            {gameOver && (
                <Box textAlign="center" mb={2}>
                    <Typography variant="h5" color="error" mb={1}>Game Over!</Typography>
                    {showNameInput ? (
                        <form onSubmit={handleNameSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                            <TextField
                                label="Tvé jméno"
                                value={playerName}
                                onChange={e => setPlayerName(e.target.value)}
                                size="small"
                                autoFocus
                                inputProps={{ maxLength: 16 }}
                            />
                            <Button type="submit" variant="contained" color="primary" size="small">
                                Uložit skóre
                            </Button>
                        </form>
                    ) : (
                        <Button variant="contained" onClick={handleRestart}>Restart</Button>
                    )}
                </Box>
            )}
            <Box mb={2} width="100%" maxWidth={350}>
                <Typography variant="h6" mb={1}>Žebříček</Typography>
                <TableContainer component={Paper} sx={{ background: "#222", color: "#fff" }}>
                    <Table size="small" aria-label="highscore table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>#</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Jméno</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Body</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {highscores.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ color: "#aaa" }}>
                                        Žádné skóre
                                    </TableCell>
                                </TableRow>
                            )}
                            {highscores.map((entry, idx) => (
                                <TableRow key={idx}>
                                    <TableCell sx={{ color: "#fff" }}>{idx + 1}</TableCell>
                                    <TableCell sx={{ color: "#fff" }}>{entry.name}</TableCell>
                                    <TableCell sx={{ color: "#fff" }}>{entry.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Typography variant="body2" mt={2} color="#888">
                Ovládání: šipky na klávesnici
            </Typography>
        </Box>
    );
}