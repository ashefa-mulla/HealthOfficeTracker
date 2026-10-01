import { setLoading, loginSuccess, apiError, resetLoginFlag, logoutUserSuccess } from './reducer';
import { authService } from '../../../services/authService';
import { getErrorMessage } from '../../../types/errors';
import { useAuthStore } from '../../../store/useAuthStore';

export const loginuser = (user: { email: string; password: string }, navigate?: any) => async (dispatch: any) => {
  try {
    console.log('[Thunk] loginuser called for:', user.email);
    dispatch(setLoading());

    const response = await authService.login({
      email: user.email,
      password: user.password,
    });

    const status = response.status || response.Status;
    const statusString = String(status).toLowerCase();
    const code = response.code || response.Code;
    const state = response.state || response.State;
    const userId = response.userId || response.UserId || response.user?.id;
    const message = response.message || response.Message || '';
    const trustedDevice = response.trustedDevice || false;

    console.log('[Thunk] Login response normalized:', {
      status,
      statusString,
      hasCode: !!code,
      userId,
      message,
    });

    // Case 1: Authorization code & state received (OAuth 2 flow)
    if (code && state) {
      console.log('[Thunk] Authorization code received, redirecting to OAuth callback');
      if (navigate) {
        navigate(`/oauth-callback?code=${code}&state=${state}&provider=webapi&trustedDevice=${trustedDevice}`);
      }
      return;
    }

    // Case 2: MFA is required (status: 1 = RequiresMfa)
    const isMfaRequired = statusString === 'requiresmfa' || status === 1;
    if (isMfaRequired) {
      console.log('[Thunk] 2-Way MFA verification required for user:', userId);
      const authStore = useAuthStore.getState();
      authStore.setMfaRequired(String(userId));
      if (navigate) {
        navigate(`/mfa-verification?userId=${userId}&source=login`);
      }
      return;
    }

    // Case 3: 2FA setup required (status: 3 = TwoFARequired)
    const isTwoFARequired = statusString === 'twofarequired' || status === 3;
    if (isTwoFARequired) {
      console.log('[Thunk] 2FA initial setup required for user:', userId);
      if (navigate) {
        navigate(`/mfa-setup?userId=${userId}&fromLogin=true`);
      }
      return;
    }

    // Case 4: Login failed (status: 0 = Failed)
    const isFailed = statusString === 'failed' || status === 0;
    if (isFailed) {
      throw new Error(message || 'Login failed. Please check your credentials.');
    }

    // Case 5: Direct Authentication (status: 2 = Authenticated)
    dispatch(loginSuccess(response));
    if (navigate) {
      navigate('/dashboard');
    }
  } catch (error: any) {
    console.error('[Thunk] Login error:', error);
    const errorMessage = getErrorMessage(error);
    dispatch(apiError(errorMessage));
  }
};

export const logoutUser = () => async (dispatch: any) => {
  try {
    await authService.logout();
    dispatch(logoutUserSuccess());
  } catch (error) {
    console.error('[Thunk] Logout error:', error);
    dispatch(logoutUserSuccess());
  }
};

export const resetLoginMsgFlag = () => {
  try {
    return resetLoginFlag();
  } catch (error) {
    return error;
  }
};
