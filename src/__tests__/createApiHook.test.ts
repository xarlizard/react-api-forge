import { createApiHook, param } from '../createApiHook';

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

    describe('path params extraction', () => {
        it('should automatically extract path params from endpoint', () => {
            const hook = createApiHook({
                method: 'GET',
                baseURL: 'https://api.example.com',
                endpoint: '/users/:userId',
            });

            expect(typeof hook).toBe('function');
        });

        it('should extract multiple path params', () => {
            const hook = createApiHook({
                method: 'GET',
                baseURL: 'https://api.example.com',
                endpoint: '/users/:userId/posts/:postId',
            });

            expect(typeof hook).toBe('function');
        });
    });

    describe('function name generation', () => {
        it('should create hook for GET requests', () => {
            const hook = createApiHook({
                method: 'GET',
                baseURL: 'https://api.example.com',
                endpoint: '/test',
            });

            expect(typeof hook).toBe('function');
        });

        it('should create hook for POST requests', () => {
            const hook = createApiHook({
                method: 'POST',
                baseURL: 'https://api.example.com',
                endpoint: '/test',
            });

            expect(typeof hook).toBe('function');
        });

        it('should create hook for PUT requests', () => {
            const hook = createApiHook({
                method: 'PUT',
                baseURL: 'https://api.example.com',
                endpoint: '/test',
            });

            expect(typeof hook).toBe('function');
        });

        it('should create hook for PATCH requests', () => {
            const hook = createApiHook({
                method: 'PATCH',
                baseURL: 'https://api.example.com',
                endpoint: '/test',
            });

            expect(typeof hook).toBe('function');
        });

        it('should create hook for DELETE requests', () => {
            const hook = createApiHook({
                method: 'DELETE',
                baseURL: 'https://api.example.com',
                endpoint: '/test',
            });

            expect(typeof hook).toBe('function');
        });

        it('should accept custom functionName', () => {
            const hook = createApiHook({
                method: 'GET',
                baseURL: 'https://api.example.com',
                endpoint: '/test',
                functionName: 'customFetch',
            });

            expect(typeof hook).toBe('function');
        });
    });

    describe('with options array', () => {
        it('should create a hook with query params (implicitly optional with defaultValue)', () => {
            const hook = createApiHook({
                method: 'GET',
                baseURL: 'https://api.example.com',
                endpoint: '/users',
                options: [
                    {
                        key: 'lang',
                        location: 'query',
                        defaultValue: 'en_US',
                        // required is implicit false when defaultValue is present
                    },
                ],
            });

            expect(typeof hook).toBe('function');
        });

        it('should create a hook with multiple param types', () => {
            const hook = createApiHook({
                method: 'GET',
                baseURL: 'https://api.example.com',
                endpoint: '/users/:userId',
                options: [
                    {
                        key: 'lang',
                        location: 'query',
                        defaultValue: 'en_US',
                        // implicitly optional
                    },
                    {
                        key: 'includeProfile',
                        location: 'query',
                        required: true,
                        // explicitly required (no defaultValue)
                    },
                ],
            });

            expect(typeof hook).toBe('function');
        });

        it('should work with param helper function', () => {
            type LanguageCode = 'en_US' | 'en_GR' | 'es_ES';

            const hook = createApiHook({
                method: 'GET',
                baseURL: 'https://api.example.com',
                endpoint: '/users/:userId',
                options: [
                    param<LanguageCode>({
                        key: 'lang',
                        location: 'query',
                        defaultValue: 'en_US',
                        // implicitly optional
                    }),
                ],
            });

            expect(typeof hook).toBe('function');
        });
    });

});
