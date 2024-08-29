import { defaultGameState, GameState } from "@/hooks/useGameState";
import styled from "@emotion/styled";
import React from "react";

interface NumberGeneratorProps {
  gameState: GameState;
  // eslint-disable-next-line no-unused-vars
  generateNewNumber: (forcedNum?: number) => GameState;
  // eslint-disable-next-line no-unused-vars
  updateGameState: (gameState: GameState) => void;
}

export function NumberGenerator({
  gameState,
  generateNewNumber,
  updateGameState,
}: NumberGeneratorProps) {
  const isLoss = gameState.endValidIndex - gameState.startValidIndex < 0;
  const isWin =
    gameState.maxRounds == gameState.score && gameState.maxRounds != 0;
  const [gameSettings, setGameSettings] = React.useState({
    maxRounds: 0,
    maxNumber: 0,
  });

  React.useEffect(() => {
    setGameSettings({
      maxRounds: gameState.maxRounds ?? 0,
      maxNumber: gameState.maxNumber ?? 0,
    });
  }, [gameState]);

  function fiftyFiftyLifeline() {
    if (!gameState.currentNumber || !gameState.lifelines) return;
    const newGameState = generateNewNumber(
      Math.floor(gameState.currentNumber / 2)
    );

    newGameState.lifelines = false;
    updateGameState(newGameState);
  }

  function x2Lifeline() {
    if (!gameState.currentNumber || !gameState.lifelines) return;
    const newGameState = generateNewNumber(
      Math.floor(gameState.currentNumber * 2)
    );
    newGameState.lifelines = false;
    updateGameState(newGameState);
  }

  function rerollLifeline() {
    if (!gameState.currentNumber || !gameState.lifelines) return;
    const newGameState = generateNewNumber();
    newGameState.lifelines = false;
    updateGameState(newGameState);
  }

  function updateRules(e: any) {
    const name: "maxRounds" | "maxNumber" = e.target.name;
    const value = Number(e.target.value);

    const newSettings = { ...gameSettings };
    newSettings[name] = value;

    if (gameState.currentNumber) return;
    const newGameState = { ...gameState };
    newGameState.maxNumber = newSettings.maxNumber;
    newGameState.maxRounds = newSettings.maxRounds;
    newGameState.rankedNumbers = new Array<number>(
      Number(newSettings.maxRounds)
    );
    updateGameState(newGameState);
  }

  function newRun() {
    const newGameState = { ...defaultGameState };
    newGameState.maxRounds = gameSettings.maxRounds;
    newGameState.maxNumber = gameSettings.maxNumber;
    newGameState.rankedNumbers = new Array<number>(gameSettings.maxRounds);
    updateGameState(newGameState);
  }

  return (
    <NumberGenDiv>
      <NumberResult>{gameState.currentNumber ?? "-"}</NumberResult>
      <NewNumberButton
        onClick={() => generateNewNumber()}
        className={isLoss ? "isLoss" : isWin ? "isWin" : undefined}
        disabled={
          (!gameState.rankedLastNumber && !!gameState.currentNumber) || isWin
        }
      >
        {!gameState.currentNumber
          ? "START"
          : isLoss
          ? gameState.lifelines || gameState.lifelines
            ? "YOU LOST?"
            : "YOU LOST"
          : isWin
          ? "YOU WON!"
          : !gameState.rankedLastNumber
          ? "RANK NUMBER"
          : "NEXT"}
      </NewNumberButton>
      {gameState.currentNumber === undefined && (
        <LifeLinesDiv>
          <div>
            <label>Max Rounds</label>
            <InputStyled
              name="maxRounds"
              onChange={updateRules}
              type="number"
              min="1"
              value={gameSettings.maxRounds || ""}
            />
          </div>
          <div>
            <label>Max Number</label>
            <InputStyled
              name="maxNumber"
              onChange={updateRules}
              type="number"
              min="1"
              value={gameSettings.maxNumber || ""}
            />
          </div>
        </LifeLinesDiv>
      )}
      <Separator />
      <p>Lifeline (1 per run):</p>
      <LifeLinesDiv>
        <NewRunButton
          onClick={gameState.rankedLastNumber ? undefined : x2Lifeline}
          disabled={!gameState.lifelines}
        >
          X2
        </NewRunButton>
        <NewRunButton
          onClick={gameState.rankedLastNumber ? undefined : fiftyFiftyLifeline}
          disabled={!gameState.lifelines}
        >
          50/50
        </NewRunButton>
        <NewRunButton
          onClick={gameState.rankedLastNumber ? undefined : rerollLifeline}
          disabled={!gameState.lifelines}
        >
          reroll
        </NewRunButton>
      </LifeLinesDiv>
      <Separator />
      <Title>20 Random Ranker V0.01</Title>
      <Title style={{ color: "lightgreen" }}>Score: {gameState.score}</Title>
      <NewRunButton onClick={newRun}>NEW RUN</NewRunButton>
    </NumberGenDiv>
  );
}

const InputStyled = styled.input`
  width: 80px;
  margin: 10px;
`;

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
    min-width: 80px;
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

  &.isWin {
    background: green;
    color: white;
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
