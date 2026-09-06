// ==========================================
// PRETEXT-X JAVASCRIPT
// ==========================================

const scenarioGrid = document.getElementById("scenario-grid");
const simulationPanel = document.getElementById("simulation-panel");
const simulationContent = document.getElementById("simulation-content");
const closeSimulation = document.getElementById("close-simulation");


// ==========================================
// LOAD SCENARIOS
// ==========================================

async function loadScenarios() {

    try {

        const response = await fetch("/api/scenarios");

        if (!response.ok) {
            throw new Error("Unable to load scenarios");
        }

        const scenarios = await response.json();

        scenarioGrid.innerHTML = "";

        scenarios.forEach((scenario) => {

            const card = document.createElement("div");

            card.className = "scenario-card";

            card.innerHTML = `
                <div class="scenario-icon">${scenario.icon}</div>

                <h3>${scenario.title}</h3>

                <p>${scenario.description}</p>

                <span class="difficulty">
                    ${scenario.difficulty}
                </span>
            `;

            card.addEventListener("click", () => {
                openScenario(scenario);
            });

            scenarioGrid.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        scenarioGrid.innerHTML = `
            <div class="loading">
                Unable to load scenarios.
                Please make sure the server is running.
            </div>
        `;
    }
}


// ==========================================
// OPEN SCENARIO
// ==========================================

function openScenario(scenario) {

    simulationPanel.classList.remove("hidden");

    simulationContent.innerHTML = `

        <div class="simulation-story">

            <span class="section-tag">
                SIMULATION ACTIVE
            </span>

            <h2>
                ${scenario.icon}
                ${scenario.title}
            </h2>

            <div class="story-box">
                ${scenario.story}
            </div>

            <h3>
                What would you do?
            </h3>

            <br>

            <div class="choice-list">

                ${scenario.choices.map((choice, index) => `
                    <button
                        class="choice-btn"
                        data-index="${index}"
                    >
                        ${index + 1}.
                        ${choice.text}
                    </button>
                `).join("")}

            </div>

            <div id="feedback-area"></div>

        </div>
    `;

    const choiceButtons =
        document.querySelectorAll(".choice-btn");

    choiceButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const index = Number(button.dataset.index);

            showFeedback(
                scenario.choices[index]
            );

        });

    });

    simulationPanel.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// ==========================================
// FEEDBACK
// ==========================================

function showFeedback(choice) {

    const feedbackArea =
        document.getElementById("feedback-area");

    feedbackArea.innerHTML = `

        <div class="feedback ${choice.safe ? "safe" : "risky"}">

            <strong>
                ${choice.safe ? "✓ Good Decision" : "⚠ Risky Decision"}
            </strong>

            <p>
                ${choice.feedback}
            </p>

        </div>
    `;
}


// ==========================================
// CLOSE SIMULATION
// ==========================================

closeSimulation.addEventListener("click", () => {

    simulationPanel.classList.add("hidden");

});


// ==========================================
// QUIZ VARIABLES
// ==========================================

let quizQuestions = [];
let currentQuestion = 0;
let selectedAnswer = null;
let userAnswers = [];

const quizApp = document.getElementById("quiz-app");
const startQuizButton = document.getElementById("start-quiz");


// ==========================================
// LOAD QUIZ
// ==========================================

async function loadQuiz() {

    try {

        const response = await fetch("/api/quiz");

        if (!response.ok) {
            throw new Error("Unable to load quiz");
        }

        quizQuestions = await response.json();

    } catch (error) {

        console.error(error);

    }
}


// ==========================================
// START QUIZ
// ==========================================

startQuizButton.addEventListener("click", async () => {

    if (quizQuestions.length === 0) {
        await loadQuiz();
    }

    currentQuestion = 0;
    userAnswers = [];

    showQuestion();

});


// ==========================================
// SHOW QUESTION
// ==========================================

function showQuestion() {

    selectedAnswer = null;

    const question =
        quizQuestions[currentQuestion];

    quizApp.innerHTML = `

        <div class="quiz-progress">

            <span>
                Question ${currentQuestion + 1}
                / ${quizQuestions.length}
            </span>

            <span>
                PRETEXT-X
            </span>

        </div>


        <div class="quiz-question">

            <h3>
                ${question.question}
            </h3>

            <div class="quiz-options">

                ${question.options.map((option, index) => `

                    <div
                        class="quiz-option"
                        data-index="${index}"
                    >
                        ${String.fromCharCode(65 + index)}.
                        ${option}
                    </div>

                `).join("")}

            </div>


            <button
                class="primary-btn quiz-next"
                id="next-question"
                disabled
            >
                ${currentQuestion === quizQuestions.length - 1
                    ? "Submit Quiz"
                    : "Next Question →"}
            </button>

        </div>
    `;


    const options =
        document.querySelectorAll(".quiz-option");

    const nextButton =
        document.getElementById("next-question");


    options.forEach((option) => {

        option.addEventListener("click", () => {

            options.forEach((item) => {
                item.classList.remove("selected");
            });

            option.classList.add("selected");

            selectedAnswer =
                Number(option.dataset.index);

            nextButton.disabled = false;

        });

    });


    nextButton.addEventListener("click", () => {

        userAnswers.push({
            questionId: question.id,
            answer: selectedAnswer
        });

        if (
            currentQuestion ===
            quizQuestions.length - 1
        ) {

            submitQuiz();

        } else {

            currentQuestion++;

            showQuestion();

        }

    });
}


// ==========================================
// SUBMIT QUIZ
// ==========================================

async function submitQuiz() {

    try {

        const response = await fetch(
            "/api/quiz/score",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    answers: userAnswers
                })
            }
        );

        if (!response.ok) {
            throw new Error("Quiz submission failed");
        }

        const result = await response.json();

        showResult(result);

    } catch (error) {

        console.error(error);

        quizApp.innerHTML = `
            <div class="result">
                <h3>Something went wrong</h3>
                <p>
                    Please make sure the server is running.
                </p>
            </div>
        `;
    }
}


// ==========================================
// SHOW RESULT
// ==========================================

function showResult(result) {

    quizApp.innerHTML = `

        <div class="result">

            <div class="result-score">
                ${result.percentage}%
            </div>

            <h3>
                ${result.level}
            </h3>

            <p>
                ${result.message}
            </p>

            <p>
                Score:
                <strong>
                    ${result.score} / ${result.total}
                </strong>
            </p>

            <br>

            <button
                class="primary-btn"
                id="restart-quiz"
            >
                Retake Quiz
            </button>

        </div>
    `;


    document
        .getElementById("restart-quiz")
        .addEventListener("click", () => {

            currentQuestion = 0;
            userAnswers = [];

            showQuestion();

        });
}


// ==========================================
// SCROLL REVEAL
// ==========================================

const revealElements =
    document.querySelectorAll(
        ".info-card, .scenario-card, .prevention-card, .chain-item"
    );

const observer =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";

                }

            });

        },
        {
            threshold: 0.1
        }
    );


revealElements.forEach((element) => {

    element.style.opacity = "0";
    element.style.transform = "translateY(25px)";
    element.style.transition = "opacity .7s ease, transform .7s ease";

    observer.observe(element);

});


// ==========================================
// INITIALIZE
// ==========================================

loadScenarios();
loadQuiz();

console.log("PRETEXT-X initialized successfully.");