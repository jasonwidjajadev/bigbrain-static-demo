/**
POST    /admin/auth/login                         /login
POST    /admin/auth/register                      /register
POST    /admin/auth/logout

================================================================================
GET     /admin/games                              /quiz/create
        Required: Token
        Response:
        {
          "games": [
            {
              "id": 56513315,
              "owner": "hayden@unsw.edu.au",
              "active": null,
              "questions": [
                {
                  "duration": 10,
                  "correctAnswers": [
                    "Answer 3",
                    "Answer 4"
                  ],
                  "Answers": [
                    {
                      "Answer": "THIS IS JUST AN EXAMPLE"
                    },
                    {
                      "Answer": "YOU CAN HAVE WHATEVER MAKES SENSE FOR YOUR QUESTION AS YOU PUT THEM BACK"
                    },
                    {
                      "Answer": "Answer 3"
                    },
                    {
                      "Answer": "Answer 4"
                    }
                  ]
                }
              ],
              "AAAA": "WHATEVER YOU PUT IN A GAME",
              "BBBB": "STORE AS MANY AS YOU WANT"
            }
          ]
        }

PUT     /admin/games - update multiple games owned by the admin
        Required: Token
        Request Body:
        {
          "games": [
            {
              "id": 56513315,
              "owner": "hayden@unsw.edu.au",
              "questions": [
                {
                  "duration": 10,
                  "correctAnswers": [
                    "Answer 3",
                    "Answer 4"
                  ],
                  "NOTE": "correctAnswers is MANDATORY AND MUST BE IN THE QUESTION SCHEMA",
                  "REST": "WHATEVER YOU NEED IN A QUESTION"
                }
              ],
              "AAAA": "WHATEVER YOU PUT IN A GAME",
              "BBBB": "STORE AS MANY AS YOU WANT"
            }
          ]
        }

//*2.3.2. Stopping a game session
//* You can advance either in the middle of a question's duration counting down or once the question has time up.
POST    /admin/game/:gameid/mutate - mutate a game's state (start/advance/end)
        Required: Token
        Required: quiz SessionId
        {
          "mutationType": "START | "ADVANCE" | "END"
        }

================================================================================
//* 2.3.3. Advancing & getting the results of a game
//* A unique route must exist for this screen that is parameterised on the session ID. E.G. /session/{session_id}
// /session/{session_id}/

//* duration counting down or once the question has time up.
//* Once the game session has finished, it should display the following:

//* A table of up to top 5 users and their score

//* A bar/line chart showing a breakdown of what percentage of people (Y axis) got certain questions (X axis) correct
//* A chart showing the average response/answer time for each question
//* Any other interesting information you see fit (Bonus mark can be granted for this based on your implementation)

GET     /admin/session/:sessionid/status - get the current status for a game session
        Required: Token
        Required: quiz SessionId
        Response:
        {
          "results": {
            "active": false,
            "answerAvailable": false,
            "isoTimeLastQuestionStarted": "2020-10-31T14:45:21.077Z",
            "position": 2,
            "questions": [
              {}
            ],
            "numQuestions": 1,
            "players": [
              "Hayden"
            ]
          }
        }

GET     /admin/session/:sessionid/results - gets the results for game session and what people's scores were
        Required: Token
        Required: quiz SessionId
        Response:
        [
          {
            "name": "Hayden Smith",
            "answers": [
              {
                "answerIds": [
                  56513315
                ],
                "correct": false,
                "answeredAt": "2020-10-31T14:45:21.077Z",
                "questionStartedAt": "2020-10-31T14:45:21.077Z"
              }
            ]
          }
        ]

//* PLAYER =====================================================================
POST    /play/join/:sessionid - join an active session as a new player
        Required session Id
        Name: {
          "name": "Hayden Smith"
        }
        Response:
        {
          "playerId": 2389498
        }


GET     /play/:playerid/status
        for the current session, the player can determine if its started or not
        Required: playerId
        Response:
        {
          "started": true
        }

GET     /play/:playerid/question
        for the current question that session is up to, this gets the details of the question
        Required: playerId
        {
          "isoTimeLastQuestionStarted": "2020-10-31T14:45:21.077Z"
        }

GET     /play/:playerid/answer
        once the question timer is finished, returns the correct answer
        Required: playerId
        Response:
        {
          "answerIds": [
            0
          ]
        }

PUT     /play/:playerid/answer
        for the current session is up to, allows the player to submit their answer
        Required: playerId
        body: {
          "answerIds": [
            0
          ]
        }
        Response: {}

//* 2.5.1. Game Session Results
//* After the final question is answered, a screen is displayed to players showing the key results:
//* The player's performance in each question, including how many points they scored, and how many seconds they took to answer each of them.
GET     /play/:playerid/results
        Once a session has ended this allows players to collect the results of their performance nenchmarked against others
        Required: playerId
        Response:
        [
          {
            "answerIds": [
              56513315
            ],
            "correct": false,
            "answeredAt": "2020-10-31T14:45:21.077Z",
            "questionStartedAt": "2020-10-31T14:45:21.077Z"
          }
        ]
*/
