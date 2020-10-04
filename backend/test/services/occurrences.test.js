const app = require('../../src/app');

describe('\'occurrences\' service', () => {
  it('registered the service', () => {
    const service = app.service('occurrences');
    expect(service).toBeTruthy();
  });
});
