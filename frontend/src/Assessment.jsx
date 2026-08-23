import { useEffect, useState } from "react";

function Assessment({ userId, skill, onComplete }) {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");
        setQuestions([]);
        setAnswers({});
        setResult(null);

        fetch(
            `http://localhost:8080/api/questions/${encodeURIComponent(skill)}`
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load questions");
                }

                return response.json();
            })
            .then((data) => {
                setQuestions(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading questions:", error);
                setError(`Unable to load ${skill} assessment.`);
                setLoading(false);
            });
    }, [skill]);

    const handleAnswer = (questionId, answer) => {
        setAnswers({
            ...answers,
            [questionId]: answer
        });
    };

    const submitAssessment = async () => {
        if (Object.keys(answers).length !== questions.length) {
            setError("Please answer all questions before submitting.");
            return;
        }

        setError("");
        setSubmitting(true);

        const requestBody = {
            userId: userId,
            skill: skill,
            answers: answers
        };

        try {
            const response = await fetch(
                "http://localhost:8080/api/assessment/submit",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            if (!response.ok) {
                throw new Error("Assessment submission failed");
            }

            const data = await response.json();

            setResult(data);
        } catch (error) {
            console.error("Error submitting assessment:", error);

            setError(
                "Unable to submit assessment. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="assessment-loading">
                <div className="loading-orb">
                    <span>⚡</span>
                </div>

                <h2>Preparing your assessment</h2>

                <p>
                    Loading your {skill} questions...
                </p>

                <div className="loading-bar">
                    <div className="loading-bar-fill"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="assessment-page">

            {/* HEADER */}
            <div className="assessment-header">

                <div>
                    <div className="assessment-label">
                        DEVFUSION • SKILL ASSESSMENT
                    </div>

                    <h1>
                        {skill}
                        <span> Assessment</span>
                    </h1>

                    <p>
                        Test your current {skill} knowledge and
                        discover where you can improve.
                    </p>
                </div>

                <div className="assessment-badge">
                    <span>✦</span>
                    AI Powered
                </div>

            </div>

            {/* PROGRESS */}
            <div className="assessment-progress-card">

                <div className="assessment-progress-top">

                    <div>
                        <span className="progress-label">
                            Assessment Progress
                        </span>

                        <strong>
                            {Object.keys(answers).length} /{" "}
                            {questions.length}
                        </strong>
                    </div>

                    <span className="progress-percent">
                        {questions.length > 0
                            ? Math.round(
                                (Object.keys(answers).length /
                                    questions.length) *
                                100
                            )
                            : 0}
                        %
                    </span>

                </div>

                <div className="assessment-progress-track">
                    <div
                        className="assessment-progress-fill"
                        style={{
                            width: `${
                                questions.length > 0
                                    ? (Object.keys(answers).length /
                                        questions.length) *
                                      100
                                    : 0
                            }%`
                        }}
                    ></div>
                </div>

                <div className="assessment-progress-bottom">
                    <span>
                        {questions.length} questions
                    </span>

                    <span>
                        Choose the best answer for each question
                    </span>
                </div>

            </div>

            {/* QUESTIONS */}
            <div className="assessment-questions">

                {questions.map((question, index) => {

                    const selectedAnswer =
                        answers[question.id];

                    const difficulty =
                        question.difficulty?.toLowerCase();

                    return (
                        <div
                            className={`assessment-question-card ${
                                selectedAnswer
                                    ? "question-answered"
                                    : ""
                            }`}
                            key={question.id}
                        >

                            {/* QUESTION HEADER */}
                            <div className="question-top">

                                <div className="question-number">
                                    {String(index + 1).padStart(2, "0")}
                                </div>

                                <div className="question-meta">

                                    <span
                                        className={`difficulty-badge ${difficulty}`}
                                    >
                                        {question.difficulty}
                                    </span>

                                    {selectedAnswer && (
                                        <span className="answered-badge">
                                            ✓ Answered
                                        </span>
                                    )}

                                </div>

                            </div>

                            {/* QUESTION */}
                            <h2 className="question-text">
                                {question.question}
                            </h2>

                            {/* OPTIONS */}
                            <div className="answer-options">

                                <label
                                    className={`answer-option ${
                                        selectedAnswer === "A"
                                            ? "selected"
                                            : ""
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        checked={
                                            selectedAnswer === "A"
                                        }
                                        onChange={() =>
                                            handleAnswer(
                                                question.id,
                                                "A"
                                            )
                                        }
                                    />

                                    <span className="option-letter">
                                        A
                                    </span>

                                    <span className="option-text">
                                        {question.optionA}
                                    </span>

                                    <span className="option-check">
                                        ✓
                                    </span>
                                </label>

                                <label
                                    className={`answer-option ${
                                        selectedAnswer === "B"
                                            ? "selected"
                                            : ""
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        checked={
                                            selectedAnswer === "B"
                                        }
                                        onChange={() =>
                                            handleAnswer(
                                                question.id,
                                                "B"
                                            )
                                        }
                                    />

                                    <span className="option-letter">
                                        B
                                    </span>

                                    <span className="option-text">
                                        {question.optionB}
                                    </span>

                                    <span className="option-check">
                                        ✓
                                    </span>
                                </label>

                                <label
                                    className={`answer-option ${
                                        selectedAnswer === "C"
                                            ? "selected"
                                            : ""
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        checked={
                                            selectedAnswer === "C"
                                        }
                                        onChange={() =>
                                            handleAnswer(
                                                question.id,
                                                "C"
                                            )
                                        }
                                    />

                                    <span className="option-letter">
                                        C
                                    </span>

                                    <span className="option-text">
                                        {question.optionC}
                                    </span>

                                    <span className="option-check">
                                        ✓
                                    </span>
                                </label>

                                <label
                                    className={`answer-option ${
                                        selectedAnswer === "D"
                                            ? "selected"
                                            : ""
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        checked={
                                            selectedAnswer === "D"
                                        }
                                        onChange={() =>
                                            handleAnswer(
                                                question.id,
                                                "D"
                                            )
                                        }
                                    />

                                    <span className="option-letter">
                                        D
                                    </span>

                                    <span className="option-text">
                                        {question.optionD}
                                    </span>

                                    <span className="option-check">
                                        ✓
                                    </span>
                                </label>

                            </div>

                        </div>
                    );
                })}

            </div>

            {/* ERROR */}
            {error && (
                <div className="assessment-error">
                    <span>!</span>
                    {error}
                </div>
            )}

            {/* SUBMIT */}
            {!result && (
                <div className="assessment-submit-section">

                    <div>
                        <strong>
                            Ready to see your results?
                        </strong>

                        <p>
                            Answer all {questions.length} questions
                            before submitting.
                        </p>
                    </div>

                    <button
                        className="assessment-submit-button"
                        onClick={submitAssessment}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <span className="button-spinner"></span>
                                Checking Answers...
                            </>
                        ) : (
                            <>
                                Submit Assessment
                                <span>→</span>
                            </>
                        )}
                    </button>

                </div>
            )}

            {/* RESULT */}
            {result && (
                <div className="assessment-result">

                    <div className="result-icon">
                        ✓
                    </div>

                    <div className="result-label">
                        ASSESSMENT COMPLETE
                    </div>

                    <h2>
                        Great work! 🎉
                    </h2>

                    <p className="result-subtitle">
                        Your {skill} assessment has been
                        successfully evaluated.
                    </p>

                    <div className="result-score">

                        <span>
                            Your Score
                        </span>

                        <strong>
                            {result.score}%
                        </strong>

                    </div>

                    <div className="result-stats">

                        <div className="result-stat">
                            <span>Skill</span>
                            <strong>
                                {result.skill}
                            </strong>
                        </div>

                        <div className="result-stat">
                            <span>Correct Answers</span>
                            <strong>
                                {result.correctAnswers}
                                {" / "}
                                {result.totalQuestions}
                            </strong>
                        </div>

                        <div className="result-stat">
                            <span>Performance</span>
                            <strong>
                                {result.score >= 80
                                    ? "Excellent"
                                    : result.score >= 60
                                    ? "Good"
                                    : "Needs Improvement"}
                            </strong>
                        </div>

                    </div>

                    <button
                        className="result-dashboard-button"
                        onClick={onComplete}
                    >
                        Return to Dashboard
                        <span>→</span>
                    </button>

                </div>
            )}

        </div>
    );
}

export default Assessment;