import ResultsDisplay from "./ResultsDisplay";

/**
 * Wrapper component to render quiz results display
 *
 * @param {Object} props - Component props
 * @param {Object} props.gameData - Quiz game configuration data
 * @param {Array} props.sessionResults - Results from all players in the quiz session
 * @returns {React.ReactElement} Results display tab content
 */
function TabContent({ gameData, sessionResults }) {
  return <ResultsDisplay gameData={gameData} sessionResults={sessionResults} />;
}

export default TabContent;
