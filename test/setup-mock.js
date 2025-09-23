// Setup file for unit tests with mocked localStorage

// Mock localStorage for testing
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
	localStorageMock.clear();
});