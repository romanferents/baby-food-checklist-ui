import { act } from '@testing-library/react-native';
import { useAuthStore } from '../../src/features/auth/auth.store';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const mockUser = {
  userId: '550e8400-e29b-41d4-a716-446655440000',
  username: 'testuser',
  email: 'test@example.com',
};

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  });

  it('starts with unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it('setAuth stores token and user and sets isAuthenticated', () => {
    act(() => {
      useAuthStore.getState().setAuth('jwt-token-123', mockUser);
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('jwt-token-123');
    expect(state.user).toEqual(mockUser);
  });

  it('logout clears auth state', () => {
    act(() => {
      useAuthStore.getState().setAuth('jwt-token-123', mockUser);
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    act(() => {
      useAuthStore.getState().logout();
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it('setAuth overwrites previous auth state', () => {
    act(() => {
      useAuthStore.getState().setAuth('token-1', mockUser);
    });

    const newUser = { ...mockUser, username: 'newuser' };
    act(() => {
      useAuthStore.getState().setAuth('token-2', newUser);
    });

    const state = useAuthStore.getState();
    expect(state.token).toBe('token-2');
    expect(state.user?.username).toBe('newuser');
    expect(state.isAuthenticated).toBe(true);
  });
});
