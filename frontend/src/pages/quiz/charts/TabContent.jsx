import ResultsDisplay from "./ResultsDisplay";

function TabContent({ gameData, sessionResults }) {
  return <ResultsDisplay gameData={gameData} sessionResults={sessionResults} />;
}

export default TabContent;
