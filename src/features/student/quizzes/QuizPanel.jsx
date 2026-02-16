import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiX, FiXCircle } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { fetchQuizForScope, submitQuizAnswers } from './quiz.service';

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

  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      try {
        const response = await fetchQuizForScope({
          type: scope.type,
          id: scope.id,
          courseId: scope.courseId
        });

        if (!response.success) {
          throw new Error(response.error || 'Failed to load quiz');
        }

        setQuiz(response.data);
      } catch (err) {
        console.error('QuizPanel error:', err);
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
        throw new Error(response.error || 'Failed to submit quiz');
      }
      setResult(response.data);
      if (onComplete) {
        onComplete(response.data);
      }
    } catch (err) {
      console.error('Quiz submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const headerLabel =
    scope.type === 'room'
      ? 'Room Quiz'
      : scope.type === 'module'
      ? 'Module Quiz'
      : 'Quiz';

  return (
    <div className="quiz-panel-backdrop">
      <div className="quiz-panel">
        <Card padding="large" className="quiz-card">
          <div className="quiz-header">
            <div>
              <p className="quiz-kicker">{headerLabel}</p>
              <h3>{title}</h3>
            </div>
            <button
              type="button"
              aria-label="Close quiz"
              className="quiz-close-btn"
              onClick={onClose}
            >
              <FiX size={18} />
            </button>
          </div>

          {loading && (
            <div className="quiz-body">
              {[1, 2].map((key) => (
                <div key={key} className="quiz-question">
                  <Skeleton className="skeleton-line" style={{ width: '70%' }} />
                  <Skeleton
                    className="skeleton-line"
                    style={{ width: '90%', marginTop: '0.75rem' }}
                  />
                  <Skeleton
                    className="skeleton-line"
                    style={{ width: '80%', marginTop: '0.5rem' }}
                  />
                </div>
              ))}
            </div>
          )}

          {!loading && quiz && (
            <div className="quiz-body">
              {quiz.questions.map((q) => (
                <div key={q.id} className="quiz-question">
                  <p className="quiz-question-text">{q.text}</p>
                  <div className="quiz-options">
                    {q.options.map((opt, index) => {
                      const isSelected = answers[q.id] === index;
                      const isCorrect = result && index === q.correctIndex;
                      const isWrongSelection =
                        result && isSelected && index !== q.correctIndex;

                      return (
                        <button
                          key={index}
                          type="button"
                          className={`quiz-option ${
                            isSelected ? 'selected' : ''
                          } ${isCorrect ? 'correct' : ''} ${
                            isWrongSelection ? 'incorrect' : ''
                          }`}
                          onClick={() => handleSelectOption(q.id, index)}
                        >
                          <span className="quiz-option-index">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{opt}</span>
                          {isCorrect && result && (
                            <FiCheckCircle size={16} className="quiz-option-icon correct" />
                          )}
                          {isWrongSelection && result && (
                            <FiXCircle size={16} className="quiz-option-icon incorrect" />
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
            <div className="quiz-footer">
              {result && (
                <div
                  className={`quiz-result-pill ${
                    result.passed ? 'passed' : 'failed'
                  }`}
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
              <div className="quiz-actions">
                <Button variant="ghost" size="small" onClick={onClose}>
                  Close
                </Button>
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

