import assert from 'node:assert/strict';
import { ROUTES } from '../src/app/routes.js';

assert.equal(ROUTES.HOME, '/');
assert.equal(ROUTES.CORPORATE_PENTEST, '/corporate/pentest');
assert.equal(ROUTES.STUDENT_BOOTCAMPS, '/student-bootcamps');
assert.equal(
  ROUTES.STUDENT_LESSON(2, 5),
  '/student-bootcamps/hacker-protocol/module/2/room/5'
);

console.log('Route smoke checks passed.');
