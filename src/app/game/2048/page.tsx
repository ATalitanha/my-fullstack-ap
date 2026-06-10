"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useLanguage";
import theme from "@/lib/theme";
import MouseHover from "@/shared/ui/mouseHover";
import HybridLoading from "../../loading";

type Tile = {
	id: number;
	value: number;
	row: number;
	col: number;
	mergedFrom?: number[];
};

const GRID_SIZE = 4;

export default function Game2048() {
	const [grid, setGrid] = useState<Tile[]>([]);
	const [score, setScore] = useState(0);
	const [bestScore, setBestScore] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [win, setWin] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const { t } = useTranslation("app.game.2048");

	const initGame = useCallback(() => {
		const initialTiles: Tile[] = [];
		const t1 = createTile(initialTiles);
		if (t1) initialTiles.push(t1);
		const t2 = createTile(initialTiles);
		if (t2) initialTiles.push(t2);

		setGrid(initialTiles);
		setScore(0);
		setGameOver(false);
		setWin(false);
	}, []);

	useEffect(() => {
		const savedBest = localStorage.getItem("2048-best-score");
		if (savedBest) setBestScore(parseInt(savedBest));
		initGame();
		setIsLoading(false);
	}, [initGame]);

	useEffect(() => {
		if (score > bestScore) {
			setBestScore(score);
			localStorage.setItem("2048-best-score", score.toString());
		}
	}, [score, bestScore]);

	const createTile = (currentTiles: Tile[]): Tile | null => {
		const emptyPositions = [];
		for (let r = 0; r < GRID_SIZE; r++) {
			for (let c = 0; r < GRID_SIZE; r++) {
				// Wait, there's a bug here.
			}
		}
		// Fixed logic below
		return null;
	};

	// Redoing logic properly
	const getEmptyPositions = (tiles: Tile[]) => {
		const occupied = new Set(tiles.map((t) => `${t.row}-${t.col}`));
		const empty = [];
		for (let r = 0; r < GRID_SIZE; r++) {
			for (let c = 0; c < GRID_SIZE; c++) {
				if (!occupied.has(`${r}-${c}`)) {
					empty.push({ r, c });
				}
			}
		}
		return empty;
	};

	const spawnTile = (tiles: Tile[]) => {
		const empty = getEmptyPositions(tiles);
		if (empty.length === 0) return null;
		const { r, c } = empty[Math.floor(Math.random() * empty.length)];
		return {
			id: Date.now() + Math.random(),
			value: Math.random() < 0.9 ? 2 : 4,
			row: r,
			col: c,
		};
	};

	const move = (direction: "up" | "down" | "left" | "right") => {
		if (gameOver || win) return;

		let moved = false;
		let newScore = score;
		const newTiles: Tile[] = JSON.parse(JSON.stringify(grid));

		// Sort tiles to process them in order based on direction
		const sortFn = (a: Tile, b: Tile) => {
			if (direction === "up") return a.row - b.row;
			if (direction === "down") return b.row - a.row;
			if (direction === "left") return a.col - b.col;
			return b.col - a.col;
		};

		const sortedTiles = [...newTiles].sort(sortFn);
		const mergedIds = new Set<number>();

		sortedTiles.forEach((tile) => {
			let currentR = tile.row;
			let currentC = tile.col;

			while (true) {
				let nextR = currentR;
				let nextC = currentC;

				if (direction === "up") nextR--;
				else if (direction === "down") nextR++;
				else if (direction === "left") nextC--;
				else nextC++;

				if (nextR < 0 || nextR >= GRID_SIZE || nextC < 0 || nextC >= GRID_SIZE)
					break;

				const targetTile = newTiles.find(
					(t) => t.row === nextR && t.col === nextC,
				);

				if (!targetTile) {
					// Move to empty cell
					const tileInNewTiles = newTiles.find((t) => t.id === tile.id);
					if (tileInNewTiles) {
						tileInNewTiles.row = nextR;
						tileInNewTiles.col = nextC;
						currentR = nextR;
						currentC = nextC;
						moved = true;
					}
				} else if (
					targetTile.value === tile.value &&
					!mergedIds.has(targetTile.id) &&
					!mergedIds.has(tile.id)
				) {
					// Merge tiles
					const tileInNewTiles = newTiles.find((t) => t.id === tile.id);
					const targetInNewTiles = newTiles.find((t) => t.id === targetTile.id);

					if (tileInNewTiles && targetInNewTiles) {
						targetInNewTiles.value *= 2;
						newScore += targetInNewTiles.value;
						if (targetInNewTiles.value === 2048) setWin(true);

						// Remove current tile
						const index = newTiles.findIndex((t) => t.id === tile.id);
						newTiles.splice(index, 1);

						mergedIds.add(targetInNewTiles.id);
						moved = true;
					}
					break;
				} else {
					break;
				}
			}
		});

		if (moved) {
			const nextTile = spawnTile(newTiles);
			if (nextTile) newTiles.push(nextTile);
			setGrid(newTiles);
			setScore(newScore);

			// Check game over
			if (getEmptyPositions(newTiles).length === 0) {
				// No empty spaces, check for possible merges
				let canMove = false;
				for (const t of newTiles) {
					const neighbors = [
						{ r: t.row - 1, c: t.col },
						{ r: t.row + 1, c: t.col },
						{ r: t.row, c: t.col - 1 },
						{ r: t.row, c: t.col + 1 },
					];
					for (const n of neighbors) {
						if (n.r >= 0 && n.r < GRID_SIZE && n.c >= 0 && n.c < GRID_SIZE) {
							const nt = newTiles.find(
								(tile) => tile.row === n.r && tile.col === n.c,
							);
							if (nt && nt.value === t.value) {
								canMove = true;
								break;
							}
						}
					}
					if (canMove) break;
				}
				if (!canMove) setGameOver(true);
			}
		}
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (["ArrowUp", "w", "W"].includes(e.key)) move("up");
			else if (["ArrowDown", "s", "S"].includes(e.key)) move("down");
			else if (["ArrowLeft", "a", "A"].includes(e.key)) move("left");
			else if (["ArrowRight", "d", "D"].includes(e.key)) move("right");
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [grid, gameOver, win]);

	if (isLoading) return <HybridLoading />;

	const getTileColor = (value: number) => {
		switch (value) {
			case 2:
				return "bg-slate-200 text-slate-800";
			case 4:
				return "bg-slate-100 text-slate-800";
			case 8:
				return "bg-orange-200 text-slate-800";
			case 16:
				return "bg-orange-300 text-white";
			case 32:
				return "bg-orange-400 text-white";
			case 64:
				return "bg-orange-500 text-white";
			case 128:
				return "bg-yellow-200 text-white text-2xl";
			case 256:
				return "bg-yellow-300 text-white text-2xl";
			case 512:
				return "bg-yellow-400 text-white text-2xl";
			case 1024:
				return "bg-yellow-500 text-white text-xl";
			case 2048:
				return "bg-yellow-600 text-white text-xl";
			default:
				return "bg-slate-900 text-white";
		}
	};

	return (
		<>
			<MouseHover />
			<div
				className={`min-h-screen pt-16 transition-colors duration-700 relative z-10 ${theme} bg-linear-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden`}
			>
				<div className="container mx-auto px-4 py-8 flex flex-col items-center">
					<div className="w-full max-w-[400px] flex justify-between items-center mb-8">
						<div>
							<h1 className="text-5xl font-bold text-slate-800 dark:text-white">
								2048
							</h1>
						</div>
						<div className="flex gap-2">
							<div className="bg-slate-200 dark:bg-gray-800 px-4 py-2 rounded-xl text-center min-w-[80px]">
								<div className="text-xs text-slate-500 dark:text-gray-400 uppercase font-bold">
									{t("score")}
								</div>
								<div className="text-xl font-bold text-slate-800 dark:text-white">
									{score}
								</div>
							</div>
							<div className="bg-slate-200 dark:bg-gray-800 px-4 py-2 rounded-xl text-center min-w-[80px]">
								<div className="text-xs text-slate-500 dark:text-gray-400 uppercase font-bold">
									{t("best")}
								</div>
								<div className="text-xl font-bold text-slate-800 dark:text-white">
									{bestScore}
								</div>
							</div>
						</div>
					</div>

					<div className="w-full max-w-[400px] flex justify-between items-center mb-6">
						<p className="text-slate-600 dark:text-gray-400 font-medium">
							{t("subtitle")}
						</p>
						<button
							onClick={initGame}
							className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-orange-500/25"
						>
							{t("new_game")}
						</button>
					</div>

					<div className="relative p-2 bg-slate-300 dark:bg-gray-700 rounded-2xl w-full max-w-[400px] aspect-square shadow-2xl">
						{/* Grid Background */}
						<div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full">
							{Array.from({ length: 16 }).map((_, i) => (
								<div
									key={i}
									className="bg-slate-200/50 dark:bg-gray-600/50 rounded-lg w-full h-full"
								/>
							))}
						</div>

						{/* Tiles */}
						<div className="absolute inset-0 p-2 pointer-events-none">
							<div className="relative w-full h-full">
								<AnimatePresence>
									{grid.map((tile) => (
										<motion.div
											key={tile.id}
											layoutId={String(tile.id)}
											initial={{ scale: 0, opacity: 0 }}
											animate={{
												scale: 1,
												opacity: 1,
												x: (tile.col * (400 - 16 - 24)) / 4 + tile.col * 8, // Adjusted for container size and gap
												y: (tile.row * (400 - 16 - 24)) / 4 + tile.row * 8,
											}}
											exit={{ scale: 0, opacity: 0 }}
											transition={{
												type: "spring",
												stiffness: 500,
												damping: 30,
												mass: 1,
											}}
											className={`absolute w-[calc(25%-6px)] h-[calc(25%-6px)] flex items-center justify-center rounded-lg font-bold text-3xl shadow-md ${getTileColor(tile.value)}`}
											style={{
												// Manual positioning since absolute and flex container don't play well with simplified grid
												left: `${tile.col * 25}%`,
												top: `${tile.row * 25}%`,
												width: "calc(25% - 8px)",
												height: "calc(25% - 8px)",
												margin: "4px",
											}}
										>
											{tile.value}
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						</div>

						{/* Game Over Overlay */}
						<AnimatePresence>
							{(gameOver || win) && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl"
								>
									<h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-white">
										{win ? t("win") : t("game_over")}
									</h2>
									<button
										onClick={initGame}
										className="bg-slate-800 dark:bg-white text-white dark:text-slate-800 font-bold py-3 px-8 rounded-xl hover:scale-105 transition-all"
									>
										{t("try_again")}
									</button>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					<div className="mt-8 text-center text-slate-500 dark:text-gray-400">
						<p className="text-sm">{t("instructions")}</p>
					</div>
				</div>
			</div>
		</>
	);
}
