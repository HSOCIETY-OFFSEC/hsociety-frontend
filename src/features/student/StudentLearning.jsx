import React from 'react';
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
  return (
    <div className="student-page">
      <CourseLearning />
    </div>
  );
};

export default StudentLearning;
