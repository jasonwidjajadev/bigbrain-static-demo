import ResultsDisplay from "./ResultsDisplay";

function TabContent({ index, gameData, sessionId, sessionResults }) {
  return (
    <ResultsDisplay
      index={index}
      gameData={gameData}
      sessionId={sessionId}
      sessionResults={sessionResults}
    />
  );
}

export default TabContent;
