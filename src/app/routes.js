export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CORPORATE_REGISTER: '/register/corporate',
  CORPORATE_PENTEST: '/corporate/pentest',
  CONTACT: '/contact',
  SERVICES: '/services',
  COURSES: '/courses',
  STUDENT_DASHBOARD: '/student-dashboard',
  STUDENT_BOOTCAMPS: '/student-bootcamps',
  STUDENT_LESSON: (moduleId, roomId) =>
    `/student-bootcamps/modules/${moduleId}/rooms/${roomId}`,
};

export default ROUTES;
