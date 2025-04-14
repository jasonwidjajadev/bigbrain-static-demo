/**
Player Empty Answer Submission #1298
Zachary Lam
2 days ago in Assignments – A4 – Feature Set 3

Star

Watch

182
11
88
22
Views

The put request call for player answer submission requires the parsed answer array from the player to be non-empty. However, - specifically cases for multi-choice and single answer type questions - when a player only has one selected answer but then unselects it, the put request will throw an error. Similarly, players who instead wait for the timer to run out while not selecting any answers will send an empty answer array, which will also have this error.

Is this behaviour intended? As it makes sense for a player to submit no answers.

Comment

1 Answer
Benjamin Li
2 days ago


Hey Zachary,

This is fine. For single choice question, once player selected one answer, they have to select another answer to change their options so answer will always be sent to backend, same thing for judgement questions.

For multiple choices questions, you can assume we won't test the scenario as user still needs to select at least one answer.

You can restrict their un-select event on frontend or just treat this as an undefined behaviour.
 */

function PlayerGamePlay() {
  //TODO green theme
  return (
    <>
    PlayerGamePlay
    </>
  )
}
export default PlayerGamePlay;

