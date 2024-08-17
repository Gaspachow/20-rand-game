"use client";
import React from "react";
import useLocalStorage from "./useLocalStorage";

export interface GameState {
  rankedNumbers: number[];
  currentNumber: number | undefined;
  score: number;
  rankedLastNumber: boolean;
  startValidIndex: number;
  endValidIndex: number;
}

export const defaultGameState: GameState = {
  rankedNumbers: new Array<number>(20),
  currentNumber: undefined,
  score: 0,
  rankedLastNumber: false,
  startValidIndex: 0,
  endValidIndex: 0,
};

export function useGameState(): [
  state: GameState,
  // eslint-disable-next-line no-unused-vars
  update: (gameState: GameState) => void,
  generateNew: () => void
] {
  const [gameStateString, setGameStateString] = useLocalStorage(
    "game_state",
    JSON.stringify(defaultGameState)
  );
  const [gameStateObject, setGameStateObject] =
    React.useState(defaultGameState);

  React.useEffect(() => {
    setGameStateObject(JSON.parse(gameStateString));
  }, [gameStateString]);

  const updateGameState = React.useCallback(
    (gameState: GameState) => {
      const stringVersion = JSON.stringify(gameState);
      setGameStateString(stringVersion);
      return;
    },
    [setGameStateString]
  );

  const generateNewNumber = React.useCallback(() => {
    // Generate random number between 1 and 1000 included
    const randNum = Math.floor(Math.random() * 1000) + 1;
    const newGameState = {
      ...gameStateObject,
      currentNumber: randNum,
      rankedLastNumber: false,
    };
    const [startValidIndex, endValidIndex] = getValidIndexes(newGameState);
    newGameState.startValidIndex = startValidIndex;
    newGameState.endValidIndex = endValidIndex;
    updateGameState(newGameState);
    return;
  }, [gameStateObject, updateGameState]);

  return [gameStateObject, updateGameState, generateNewNumber];
}

function getValidIndexes(gameState: GameState) {
  const currentNumber = gameState.currentNumber;
  if (!currentNumber) return [0, 0];

  let startIndex = undefined;
  let endIndex = undefined;

  if (gameState.score !== 0) {
    for (let i = 0; i < gameState.rankedNumbers.length; i += 1) {
      const rankedNumber = gameState.rankedNumbers[i];
      if (rankedNumber && rankedNumber < currentNumber) {
        startIndex = i + 1;
      }
      if (
        rankedNumber &&
        rankedNumber > currentNumber &&
        endIndex === undefined
      ) {
        endIndex = i - 1;
      }
    }
    if (startIndex === undefined) startIndex = 0;
    if (endIndex === undefined) endIndex = gameState.rankedNumbers.length - 1;
  } else {
    startIndex = 0;
    endIndex = gameState.rankedNumbers.length - 1;
  }

  return [startIndex, endIndex];
}
