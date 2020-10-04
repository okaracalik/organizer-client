const app = require('../../src/app');

describe('\'list-items\' service', () => {
  it('registered the service', () => {
    const service = app.service('list-items');
    expect(service).toBeTruthy();
  });
});
