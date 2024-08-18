import { GameState } from "@/hooks/useGameState";
import styled from "@emotion/styled";
import React from "react";

interface NumberRankerProps {
  gameState: GameState;
  // eslint-disable-next-line no-unused-vars
  updateGameState: (gameState: GameState) => void;
}

export function NumberRanker({
  gameState,
  updateGameState,
}: NumberRankerProps) {
  const rankNumber = React.useCallback(
    (index: number) => {
      if (!gameState.currentNumber) return;
      const newState = { ...gameState };
      newState.rankedNumbers[index] = gameState.currentNumber;
      newState.rankedLastNumber = true;
      newState.score += 1;
      updateGameState(newState);
    },
    [gameState, updateGameState]
  );

  return (
    <NumberRankDiv>
      {gameState.rankedNumbers.map((number, i) => {
        const isValid =
          !number &&
          i >= gameState.startValidIndex &&
          i <= gameState.endValidIndex &&
          !gameState.rankedLastNumber &&
          gameState.currentNumber;
        return (
          <NumberLine
            // eslint-disable-next-line react/no-array-index-key
            key={i}
          >
            <p>{i + 1}</p>
            <NumberDiv
              onClick={isValid ? () => rankNumber(i) : undefined}
              className={isValid ? "valid" : "invalid"}
            >
              <p>{number ?? ""}</p>
            </NumberDiv>
          </NumberLine>
        );
      })}
    </NumberRankDiv>
  );
}

const NumberRankDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  padding: 20px;
  width: 350px;
`;

const NumberLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 130px;
`;

const NumberDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10px;
  border: 2px solid #c3c3c3;

  background: black;

  width: 100px;
  height: 30px;

  font-weight: bold;

  &.valid {
    border-color: #0c8b45;
    background-color: #0e3a02;
    cursor: pointer;

    :hover {
      transform: scale(1.05);
    }
  }

  &.invalid {
    color: white;
    border-color: grey;
  }
`;
