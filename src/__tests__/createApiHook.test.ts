import { createApiHook } from '../createApiHook';

describe('createApiHook', () => {
    it('should be defined', () => {
        expect(createApiHook).toBeDefined();
    });

    it('should create a hook function', () => {
        const hook = createApiHook({
            method: 'GET',
            baseURL: 'https://api.example.com',
            endpoint: '/test',
        });

        expect(typeof hook).toBe('function');
    });
});
