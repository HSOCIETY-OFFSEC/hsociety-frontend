import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiX, FiXCircle } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { fetchQuizForScope, submitQuizAnswers } from '../services/quiz.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import { logger } from '../../../core/logging/logger';

/**
 * QuizPanel
 * Slide-over quiz UI that appears on top of the learning view.
 */

export const QuizPanel = ({ scope, title, onClose, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetchQuizForScope({
          type: scope.type,
          id: scope.id,
          courseId: scope.courseId
        });

        if (!response.success) {
          throw new Error(getPublicErrorMessage({ action: 'load', response }));
        }

        setQuiz(response.data);
      } catch (err) {
        logger.error('QuizPanel error:', err);
        setError('Unable to load quiz right now. Please try again in a moment.');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [scope]);

  const handleSelectOption = (questionId, optionIndex) => {
    if (result) return; // lock answers after submit
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const response = await submitQuizAnswers(quiz, answers);
      if (!response.success) {
        throw new Error(getPublicErrorMessage({ action: 'submit', response }));
      }
      setResult(response.data);
      if (onComplete) {
        onComplete(response.data);
      }
    } catch (err) {
      logger.error('Quiz submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setAnswers({});
  };

  const headerLabel =
    scope.type === 'room'
      ? 'Room Quiz'
      : scope.type === 'module'
      ? 'Module Quiz'
      : 'Quiz';

  const backdropClassName = 'fixed inset-0 z-[60] flex items-end justify-center bg-black/55 p-4 sm:items-center';
  const panelClassName = 'w-full max-w-[640px] pb-6';
  const cardClassName = 'max-h-[90vh] overflow-y-auto rounded-lg';
  const headerClassName = 'mb-5 flex items-start justify-between gap-4';
  const kickerClassName = 'text-xs font-semibold uppercase tracking-widest text-text-tertiary';
  const closeButtonClassName =
    'rounded-full p-1 text-text-secondary transition hover:bg-bg-tertiary hover:text-text-primary';
  const bodyClassName = 'flex flex-col gap-4';
  const errorClassName = 'text-sm text-text-tertiary';
  const questionTextClassName = 'text-sm font-medium text-text-primary';
  const optionsClassName = 'flex flex-col gap-2';
  const optionBaseClassName =
    'flex w-full items-center gap-3 rounded-md border border-border bg-bg-secondary px-3 py-2 text-left text-sm text-text-secondary transition hover:-translate-y-0.5 hover:border-text-secondary/40';
  const optionSelectedClassName = 'border-text-secondary/40 bg-card text-text-primary';
  const optionCorrectClassName = 'border-text-primary/40';
  const optionIncorrectClassName = 'border-text-tertiary/40';
  const optionIndexClassName =
    'flex h-7 w-7 items-center justify-center rounded-full bg-[var(--input-bg)] text-xs font-semibold text-text-secondary';
  const footerClassName = 'mt-5 flex flex-wrap items-center gap-3';
  const resultPillBaseClassName =
    'inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-secondary';
  const resultPillPassedClassName = 'text-text-primary';

  return (
    <div className={backdropClassName}>
      <div className={panelClassName}>
        <Card padding="large" className={cardClassName}>
          <div className={headerClassName}>
            <div>
              <p className={kickerClassName}>{headerLabel}</p>
              <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            </div>
            <button
              type="button"
              aria-label="Close quiz"
              className={closeButtonClassName}
              onClick={onClose}
            >
              <FiX size={18} />
            </button>
          </div>

          {loading && (
            <div className={bodyClassName}>
              {[1, 2].map((key) => (
                <div key={key} className="flex flex-col gap-2">
                  <Skeleton className="h-3 rounded-full" style={{ width: '70%' }} />
                  <Skeleton className="h-3 rounded-full" style={{ width: '90%' }} />
                  <Skeleton className="h-3 rounded-full" style={{ width: '80%' }} />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className={bodyClassName}>
              <p className={errorClassName}>{error}</p>
              <Button variant="secondary" size="small" onClick={onClose}>
                Close
              </Button>
            </div>
          )}

          {!loading && !error && quiz && (
            <div className={bodyClassName}>
              {quiz.questions.map((q) => (
                <div key={q.id} className="flex flex-col gap-2">
                  <p className={questionTextClassName}>{q.text}</p>
                  <div className={optionsClassName}>
                    {q.options.map((opt, index) => {
                      const isSelected = answers[q.id] === index;
                      const isCorrect = result && index === q.correctIndex;
                      const isWrongSelection =
                        result && isSelected && index !== q.correctIndex;
                      const optionClassName = [
                        optionBaseClassName,
                        isSelected ? optionSelectedClassName : '',
                        isCorrect ? optionCorrectClassName : '',
                        isWrongSelection ? optionIncorrectClassName : '',
                      ].filter(Boolean).join(' ');

                      return (
                        <button
                          key={index}
                          type="button"
                          className={optionClassName}
                          onClick={() => handleSelectOption(q.id, index)}
                        >
                          <span className={optionIndexClassName}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{opt}</span>
                          {isCorrect && result && (
                            <FiCheckCircle size={16} className="ml-auto text-text-primary" />
                          )}
                          {isWrongSelection && result && (
                            <FiXCircle size={16} className="ml-auto text-text-tertiary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && quiz && (
            <div className={footerClassName}>
              {result && (
                <div
                  className={`${resultPillBaseClassName}${result.passed ? ` ${resultPillPassedClassName}` : ''}`}
                >
                  {result.passed ? (
                    <>
                      <FiCheckCircle size={16} />
                      Passed · {result.score}% ({result.correct}/{result.total}{' '}
                      correct)
                    </>
                  ) : (
                    <>
                      <FiXCircle size={16} />
                      Try again · {result.score}% ({result.correct}/
                      {result.total} correct)
                    </>
                  )}
                </div>
              )}
              <div className="ml-auto flex flex-wrap gap-2">
                <Button variant="ghost" size="small" onClick={onClose}>
                  Close
                </Button>
                {result && !result.passed && (
                  <Button variant="secondary" size="small" onClick={handleRetry}>
                    Retry Quiz
                  </Button>
                )}
                {!result && (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={handleSubmit}
                    disabled={submitting || Object.keys(answers).length === 0}
                  >
                    {submitting ? 'Submitting…' : 'Submit Quiz'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default QuizPanel;
