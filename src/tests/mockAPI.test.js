const testMockAPI = require('../server/mockAPI');

describe('Mock API Test', () => {
  it('should return true', () => {
    const title = 'test json response';
    const message = 'this is a message';
    const time = 'now';
    expect(testMockAPI.message).toBe(message);
    expect(testMockAPI.title).toBe(title);
    expect(testMockAPI.time).toBe(time);
  });
})

