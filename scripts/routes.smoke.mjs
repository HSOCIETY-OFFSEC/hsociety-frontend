import assert from 'node:assert/strict';
import { ROUTES } from '../src/app/router/routes.js';

assert.equal(ROUTES.HOME, '/');
assert.equal(ROUTES.CORPORATE_PENTEST, '/corporate/pentest');
assert.equal(ROUTES.STUDENT_BOOTCAMPS, '/student-bootcamps');
assert.equal(
  ROUTES.STUDENT_LESSON(2, 5),
  '/student-bootcamps/modules/2/rooms/5'
);

console.log('Route smoke checks passed.');
