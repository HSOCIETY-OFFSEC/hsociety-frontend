import React from 'react';
import { FiCompass } from 'react-icons/fi';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import Button from '../../shared/components/ui/Button';
import { CourseLearning } from './courses/CourseLearning';
import '../../styles/features/student.css';

/**
 * Dedicated student learning page
 * Route: /student-learning
 *
 * Keeps the student dashboard overview clean while giving the
 * gamified course experience its own full-width page.
 */
const StudentLearning = () => {
  useScrollReveal();

  return (
    <div className="student-page">
      <header className="student-hero reveal-on-scroll">
        <div>
          <p className="student-kicker">Learning Path</p>
          <h1>Become a Hacker.</h1>
          <p>Follow the structured HSOCIETY path with modules, rooms, CTFs, and badges.</p>
        </div>
        <Button variant="primary" size="large">
          <FiCompass size={18} />
          Continue Learning
        </Button>
      </header>

      <CourseLearning />
    </div>
  );
};

export default StudentLearning;

