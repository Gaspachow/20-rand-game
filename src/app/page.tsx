"use client";
import { useGameState } from "@/hooks/useGameState";
import { NumberGenerator } from "./components/numberGenerator";
import styled from "@emotion/styled";
import { NumberRanker } from "./components/numberRanker";

export default function Home() {
  const [gameState, updateGameState, generateNewNumber] = useGameState();
  return (
    <Main>
      <GameDiv>
        <NumberRanker gameState={gameState} updateGameState={updateGameState} />
        <NumberGenerator
          gameState={gameState}
          updateGameState={updateGameState}
          generateNewNumber={generateNewNumber}
        />
      </GameDiv>
    </Main>
  );
}

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 10px;
  flex-wrap: wrap-reverse;
  align-items: center;
  min-height: 100vh;
  font-family: 'MS Sans Serif';
`;

const GameDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap-reverse;
  align-items: flex-end;
  padding-top: 50px;
`;
