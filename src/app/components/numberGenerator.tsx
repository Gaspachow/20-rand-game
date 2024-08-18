import { defaultGameState, GameState } from "@/hooks/useGameState";
import styled from "@emotion/styled";
import React from "react";

interface NumberGeneratorProps {
  gameState: GameState;
  // eslint-disable-next-line no-unused-vars
  generateNewNumber: (forcedNum?: number) => void;
  // eslint-disable-next-line no-unused-vars
  updateGameState: (gameState: GameState) => void;
}

export function NumberGenerator({
  gameState,
  generateNewNumber,
  updateGameState,
}: NumberGeneratorProps) {
  const isLoss = gameState.endValidIndex - gameState.startValidIndex < 0;

  React.useEffect(() => {}, []);

  function fiftyFiftyLifeline() {
    if (!gameState.currentNumber || !gameState.lifelines.fiftyfifty) return;
    const newGameState = { ...gameState };
    newGameState.lifelines.fiftyfifty = false;
    updateGameState(newGameState);

    generateNewNumber(Math.floor(gameState.currentNumber / 2));
  }

  function x2Lifeline() {
    if (!gameState.currentNumber || !gameState.lifelines.x2) return;
    const newGameState = { ...gameState };
    newGameState.lifelines.x2 = false;
    updateGameState(newGameState);

    generateNewNumber(Math.floor(gameState.currentNumber * 2));
  }

  return (
    <NumberGenDiv>
      <NumberResult>{gameState.currentNumber ?? "-"}</NumberResult>
      <NewNumberButton
        onClick={() => generateNewNumber()}
        className={isLoss ? "isLoss" : undefined}
        disabled={!gameState.rankedLastNumber && !!gameState.currentNumber}
      >
        {!gameState.currentNumber
          ? "START"
          : isLoss
          ? gameState.lifelines.x2 || gameState.lifelines.fiftyfifty
            ? "YOU LOST?"
            : "YOU LOST"
          : !gameState.rankedLastNumber
          ? "RANK NUMBER"
          : "NEXT"}
      </NewNumberButton>
      <Separator />
      <p>Lifelines:</p>
      <LifeLinesDiv>
        <NewRunButton onClick={x2Lifeline} disabled={!gameState.lifelines.x2}>
          X2
        </NewRunButton>
        <NewRunButton
          onClick={fiftyFiftyLifeline}
          disabled={!gameState.lifelines.fiftyfifty}
        >
          50/50
        </NewRunButton>
      </LifeLinesDiv>
      <Separator />
      <Title>20 Random Ranker V0.01</Title>
      <Title style={{ color: "lightgreen" }}>Score: {gameState.score}</Title>
      <NewRunButton onClick={() => updateGameState(defaultGameState)}>
        NEW RUN
      </NewRunButton>
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

const LifeLinesDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  button {
    min-width: 100px;
  }
`;

const NewNumberButton = styled.button`
  cursor: pointer;
  font-size: 30px;
  font-family: "MS Sans Serif";

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

const NewRunButton = styled.button`
  font-family: "MS Sans Serif";
  cursor: pointer;
`;

const Title = styled.h2`
  font-family: "MS Sans Serif";
`;

const Separator = styled.hr`
  margin: 20px 0px;
  width: 100%;
`;
