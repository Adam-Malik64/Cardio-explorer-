// Daily Habits quiz (Issue #3), shown on /modules/habits-quiz.
// One general-knowledge question at a time: pick an answer, check it, read why, move on.
// The only score is a knowledge score. The quiz never asks about the student's own health
// and never gives a personal risk verdict. Nothing is stored or sent anywhere.
import { useEffect, useId, useRef, useState } from 'react';
import ExternalLink from '../components/ExternalLink';
import { questions, takeaways, topics } from '../mocks/habitsQuiz';

/** Shown before starting and on the results screen (Issue #3, AC 5.1 and 5.2). */
function QuizNotice() {
  return (
    <p className="edu-notice" role="note">
      This quiz teaches general facts about habits and the heart. It does not check your own
      health. If you have questions about your health, talk to a parent, school nurse or doctor.
    </p>
  );
}

export default function HabitsQuizView({ questionBank = questions }) {
  const id = useId();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState('');
  const [results, setResults] = useState([]); // true/false per answered question
  const [finished, setFinished] = useState(false);
  const headingRef = useRef(null);
  const feedbackRef = useRef(null);
  const started = useRef(false);

  // Move focus to the new heading when the question or screen changes (not on first load).
  useEffect(() => {
    if (!started.current) {
      started.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [index, finished]);

  // The Check button disappears once an answer is checked, so move focus to the feedback:
  // it is read out first, and Next is the very next Tab stop.
  useEffect(() => {
    if (checked) feedbackRef.current?.focus();
  }, [checked]);

  if (questionBank.length === 0) {
    return (
      <section className="card quiz" aria-labelledby={`${id}-title`}>
        <h2 id={`${id}-title`}>Heart habits quiz</h2>
        <p>No questions are available right now. Please try again later.</p>
      </section>
    );
  }

  const question = questionBank[index];
  const isLast = index === questionBank.length - 1;
  const correctOption = question.options.find((o) => o.id === question.answer);
  const isCorrect = selected === question.answer;

  function handleCheck(event) {
    event.preventDefault();
    if (!selected) {
      setHint('Choose an answer first.');
      return;
    }
    setHint('');
    setChecked(true);
    setResults((r) => [...r, selected === question.answer]);
  }

  function handleNext() {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected('');
    setChecked(false);
  }

  function restart() {
    setIndex(0);
    setSelected('');
    setChecked(false);
    setHint('');
    setResults([]);
    setFinished(false);
  }

  if (finished) {
    const score = results.filter(Boolean).length;
    const topicIds = [...new Set(questionBank.map((q) => q.topic))];
    return (
      <section className="card quiz" aria-labelledby={`${id}-results`}>
        <h2 id={`${id}-results`} ref={headingRef} tabIndex={-1}>
          Quiz complete
        </h2>
        <p className="quiz-score" data-testid="quiz-score">
          You got {score} of {questionBank.length} right.
        </p>
        <p className="muted">
          This score shows what you know about heart-healthy habits. It says nothing about your
          own health.
        </p>
        <QuizNotice />
        <h3>Key ideas to remember</h3>
        <ul className="quiz-takeaways">
          {topicIds.map((t) => (
            <li key={t}>
              <strong>{topics[t] ?? t}:</strong> {takeaways[t]}
            </li>
          ))}
        </ul>
        <button type="button" className="button" onClick={restart}>
          Try again
        </button>
      </section>
    );
  }

  return (
    <section className="card quiz" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>Heart habits quiz</h2>
      {index === 0 && !checked && <QuizNotice />}
      {/* Focus lands here on each new question, so it says where you are */}
      <h3 className="quiz-progress" ref={headingRef} tabIndex={-1}>
        Question {index + 1} of {questionBank.length}: {topics[question.topic] ?? question.topic}
      </h3>

      <form onSubmit={handleCheck} noValidate>
        <fieldset className="quiz-options" disabled={checked}>
          <legend className="quiz-question">{question.question}</legend>
          {question.options.map((option) => {
            const optionId = `${id}-${question.id}-${option.id}`;
            let mark = '';
            if (checked && option.id === question.answer) mark = 'Correct answer';
            else if (checked && option.id === selected) mark = 'Your answer';
            return (
              <div
                key={option.id}
                className={`quiz-option${mark ? ` quiz-option-${option.id === question.answer ? 'right' : 'wrong'}` : ''}`}
              >
                <input
                  type="radio"
                  id={optionId}
                  name={`${id}-${question.id}`}
                  value={option.id}
                  checked={selected === option.id}
                  onChange={() => {
                    setSelected(option.id);
                    setHint('');
                  }}
                />
                <label htmlFor={optionId}>
                  {option.text}
                  {mark && <span className="quiz-mark"> ({mark})</span>}
                </label>
              </div>
            );
          })}
        </fieldset>

        {hint && (
          <p className="quiz-hint" role="alert">
            {hint}
          </p>
        )}

        {!checked && (
          <button type="submit" className="button">
            Check answer
          </button>
        )}
      </form>

      <div aria-live="polite" data-testid="quiz-feedback">
        {checked && (
          <div className="quiz-feedback" ref={feedbackRef} tabIndex={-1}>
            <p className="quiz-verdict">
              <strong>{isCorrect ? 'Correct!' : 'Not quite.'}</strong>
              {!isCorrect && ` The answer is: ${correctOption.text}.`}
            </p>
            <p>{question.explanation}</p>
            <p className="muted">
              Source:{' '}
              <ExternalLink href={question.source.href}>{question.source.label}</ExternalLink>
            </p>
          </div>
        )}
      </div>

      {checked && (
        <button type="button" className="button" onClick={handleNext}>
          {isLast ? 'See results' : 'Next question'}
        </button>
      )}
    </section>
  );
}
