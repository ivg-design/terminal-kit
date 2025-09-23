// Test setup file for Vitest
// Add any global test setup here

// Only mock localStorage for unit tests, not integration tests
const isIntegrationTest = globalThis.process?.env?.VITEST_POOL_ID?.includes('integration') ||
	globalThis.location?.href?.includes('integration');

if (!isIntegrationTest) {
	// Mock localStorage for unit testing
	const localStorageMock = {
		getItem: vi.fn(),
		setItem: vi.fn(),
		removeItem: vi.fn(),
		clear: vi.fn(),
		length: 0,
		key: vi.fn()
	};

	global.localStorage = localStorageMock;

	// Reset mocks before each test
	beforeEach(() => {
		vi.clearAllMocks();
		if (localStorageMock.clear) {
			localStorageMock.clear();
		}
	});
}