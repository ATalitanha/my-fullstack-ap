import { describe, it, expect } from 'vitest';
import { errorResponse } from '../error';

describe('errorResponse', () => {
  it('should return a 500 response with the correct error message', () => {
    const error = new Error('Test error');
    const response = errorResponse(error, 'Test context');

    expect(response.status).toBe(500);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    return response.json().then(data => {
      expect(data.error).toBe('Test context');
    });
  });

  it('should use the default error message if no context is provided', () => {
    const error = new Error('Test error');
    const response = errorResponse(error);

    return response.json().then(data => {
      expect(data.error).toBe('خطای سرور');
    });
  });
});
