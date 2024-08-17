import { defaultGameState, GameState } from "@/hooks/useGameState";
import styled from "@emotion/styled";
import React from "react";

interface NumberGeneratorProps {
  gameState: GameState;
  generateNewNumber: () => void;
  // eslint-disable-next-line no-unused-vars
  updateGameState: (gameState: GameState) => void;
}

export function NumberGenerator({
  gameState,
  generateNewNumber,
  updateGameState,
}: NumberGeneratorProps) {
  const isLoss = gameState.endValidIndex - gameState.startValidIndex < 0;
  return (
    <NumberGenDiv>
      <NumberResult>{gameState.currentNumber ?? "-"}</NumberResult>
      <NewNumberButton
        onClick={generateNewNumber}
        className={isLoss ? "isLoss" : undefined}
        disabled={!gameState.rankedLastNumber && !!gameState.currentNumber}
      >
        {!gameState.currentNumber
          ? "START"
          : isLoss
          ? "YOU LOST"
          : !gameState.rankedLastNumber
          ? "RANK NUMBER"
          : "NEXT"}
      </NewNumberButton>
      <Separator />
      <p>Score: {gameState.score}</p>
      <button onClick={() => updateGameState(defaultGameState)}>NEW RUN</button>
    </NumberGenDiv>
  );
}

const NumberResult = styled.p`
  font-weight: bold;
  font-size: 40px;
`;

const NumberGenDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  padding: 20px;
  width: 350px;
  border: 5px outset #c3c3c3;
`;

const NewNumberButton = styled.button`
  cursor: pointer;
  font-size: 30px;

  padding: 5px;
  border-radius: 0px;

  border: 2px outset #c3c3c3;

  :disabled {
    cursor: default;
  }

  &.isLoss {
    background: darkred;
  }
`;

const Separator = styled.hr`
  margin: 20px 0px;
  width: 100%;
`;
