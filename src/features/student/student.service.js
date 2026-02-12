/**
 * Student Dashboard Service
 * Location: src/features/student/student.service.js
 *
 * TODO: Backend integration
 */

/**
 * Get student dashboard overview
 * @returns {Promise<Object>} - Student dashboard data
 */
export const getStudentOverview = async () => {
  try {
    // TODO: Backend integration
    // const response = await apiClient.get(API_ENDPOINTS.STUDENT.OVERVIEW);

    await new Promise(resolve => setTimeout(resolve, 700));

    return {
      success: true,
      data: {
        learningPath: [
          { id: 'net', title: 'Networking Basics', status: 'done', progress: 100 },
          { id: 'linux', title: 'Linux Essentials', status: 'in-progress', progress: 65 },
          { id: 'web', title: 'Web Security', status: 'next', progress: 0 }
        ],
        challenges: [
          { id: 'sql', title: 'SQL Injection 101', level: 'Easy', time: '35 min', icon: 'target' },
          { id: 'jwt', title: 'JWT Misconfig', level: 'Medium', time: '50 min', icon: 'shield' },
          { id: 'phish', title: 'Phishing Analysis', level: 'Easy', time: '25 min', icon: 'flag' }
        ],
        mentors: [
          { id: 'nia', name: 'Nia T.', focus: 'Blue Team', status: 'Available' },
          { id: 'sam', name: 'Sam K.', focus: 'Web Pentest', status: 'Busy' }
        ],
        snapshot: [
          { id: 'lessons', label: 'Lessons completed', value: '18', icon: 'check' },
          { id: 'time', label: 'Time spent', value: '12h', icon: 'clock' },
          { id: 'labs', label: 'Labs passed', value: '7', icon: 'lock' },
          { id: 'ctfs', label: 'CTFs completed', value: '3', icon: 'code' }
        ]
      }
    };
  } catch (error) {
    console.error('Failed to fetch student overview:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  getStudentOverview
};
