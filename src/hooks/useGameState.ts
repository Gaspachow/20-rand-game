"use client";
import React from "react";
import useLocalStorage from "./useLocalStorage";

const version = 0.04;

export interface GameState {
  rankedNumbers: number[];
  currentNumber: number | undefined;
  score: number;
  rankedLastNumber: boolean;
  startValidIndex: number;
  endValidIndex: number;
  lifelines: boolean;
  maxRounds: number;
  maxNumber: number;
  version: number;
}

export const defaultGameState: GameState = {
  rankedNumbers: new Array<number>(20),
  currentNumber: undefined,
  score: 0,
  rankedLastNumber: false,
  startValidIndex: 0,
  endValidIndex: 0,
  lifelines: true,
  maxRounds: 20,
  maxNumber: 1000,
  version,
};

export function useGameState(): [
  state: GameState,
  // eslint-disable-next-line no-unused-vars
  update: (gameState: GameState) => void,
  generateNew: () => GameState
] {
  const [gameStateString, setGameStateString] = useLocalStorage(
    "game_state",
    JSON.stringify(defaultGameState)
  );
  const [gameStateObject, setGameStateObject] =
    React.useState(defaultGameState);

  const updateGameState = React.useCallback(
    (gameState: GameState) => {
      const stringVersion = JSON.stringify(gameState);
      setGameStateString(stringVersion);
      return;
    },
    [setGameStateString]
  );

  React.useEffect(() => {
    try {
      const gameState = JSON.parse(gameStateString);
      if (gameState?.version === version) setGameStateObject(gameState);
      else updateGameState(defaultGameState);
    } catch (e: any) {
      updateGameState(defaultGameState);
    }
  }, [gameStateString, updateGameState]);

  const generateNewNumber = React.useCallback(
    (forcedNum?: number) => {
      if (gameStateObject.score === gameStateObject.maxRounds) {
        window.alert("you won!!!");
        return gameStateObject;
      }
      // Generate random number between 1 and 1000 included
      let newGameState;
      if (typeof forcedNum === "number") {
        newGameState = {
          ...gameStateObject,
          currentNumber: forcedNum,
          rankedLastNumber: false,
        };
      } else {
        let randNum = -1;
        while (
          randNum === -1 ||
          gameStateObject.rankedNumbers.includes(randNum)
        ) {
          randNum = Math.floor(Math.random() * gameStateObject.maxNumber) + 1;
        }
        newGameState = {
          ...gameStateObject,
          currentNumber: randNum,
          rankedLastNumber: false,
        };
      }
      const [startValidIndex, endValidIndex] = getValidIndexes(newGameState);
      newGameState.startValidIndex = startValidIndex;
      newGameState.endValidIndex = endValidIndex;
      updateGameState(newGameState);
      return newGameState;
    },
    [gameStateObject, updateGameState]
  );

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
