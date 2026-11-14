// Daily Habits quiz (Issue #3), shown on /modules/habits-quiz.
// One general-knowledge question at a time: pick an answer, check it, read why, move on.
// The only score is a knowledge score. The quiz never asks about the student's own health
// and never gives a personal risk verdict. Nothing is stored or sent anywhere.
import { useEffect, useId, useRef, useState } from 'react';
import { questions, takeaways, topics } from '../mocks/habitsQuiz';

export default function HabitsQuizView({ questionBank = questions }) {
  const id = useId();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState('');
  const [results, setResults] = useState([]); // true/false per answered question
  const [finished, setFinished] = useState(false);
  const headingRef = useRef(null);
  const nextRef = useRef(null);
  const started = useRef(false);

  // Move focus to the new heading when the question or screen changes (not on first load).
  useEffect(() => {
    if (!started.current) {
      started.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [index, finished]);

  // The Check button disappears once an answer is checked, so keep keyboard focus on Next.
  useEffect(() => {
    if (checked) nextRef.current?.focus();
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
      <p className="eyebrow">
        Question {index + 1} of {questionBank.length} · {topics[question.topic] ?? question.topic}
      </p>
      <h2 id={`${id}-title`} ref={headingRef} tabIndex={-1}>
        Heart habits quiz
      </h2>

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
          <div className="quiz-feedback">
            <p className="quiz-verdict">
              <strong>{isCorrect ? 'Correct!' : 'Not quite.'}</strong>
              {!isCorrect && ` The answer is: ${correctOption.text}.`}
            </p>
            <p>{question.explanation}</p>
            <p className="muted">
              Source:{' '}
              <a href={question.source.href} target="_blank" rel="noreferrer">
                {question.source.label}
                {' '}
                <span className="visually-hidden">(opens in a new tab)</span>
              </a>
            </p>
          </div>
        )}
      </div>

      {checked && (
        <button type="button" className="button" onClick={handleNext} ref={nextRef}>
          {isLast ? 'See results' : 'Next question'}
        </button>
      )}
    </section>
  );
}
