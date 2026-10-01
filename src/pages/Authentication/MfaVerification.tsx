import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Alert, Button } from 'reactstrap';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../types/errors';
import defaultLogo from '../../assets/images/ho-logo.svg';
import './login.css';
import './mfa.css';

const MfaVerification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [trustDevice, setTrustDevice] = useState(true);
  const [trustDays] = useState(30);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const userId = searchParams.get('userId');
  const appName = import.meta.env.VITE_APP_NAME || 'HO Tracker';
  const logo = import.meta.env.VITE_COMPANYLOGO || defaultLogo;

  useEffect(() => {
    document.title = `Two-Factor Verification | ${appName}`;
    if (!userId) {
      setError('Invalid verification request. Please log in again.');
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    } else {
      inputRefs.current[0]?.focus();
    }
  }, [userId, navigate, appName]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      setError('Verification code expired. Please log in again to request a new code.');
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (digits.every((d) => d !== '')) {
      handleVerify(digits.join(''));
    }
  }, [digits]);

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError(null);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (codeOverride?: string) => {
    const codeToVerify = codeOverride || digits.join('');

    if (!userId) {
      setError('User ID not found. Please log in again.');
      return;
    }

    if (!codeToVerify || codeToVerify.length !== 6) {
      setError('Please enter the full 6-digit authentication code.');
      return;
    }

    if (attempts >= 3) {
      setError('Too many failed attempts. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await authService.verifyMfa({
        userId,
        token: codeToVerify,
        method: 'totp',
        TrustDevice: trustDevice,
        TrustDays: trustDevice ? trustDays : undefined,
      });

      setSuccess(true);

      const authCode = response.Code || response.code;
      const state = response.State || response.state;

      if (authCode && state) {
        navigate(`/oauth-callback?code=${authCode}&state=${state}&provider=webapi&trustedDevice=${trustDevice}`, {
          replace: true,
        });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      console.error('[MfaVerification] Verification error:', err);
      const msg = getErrorMessage(err);
      setAttempts((prev) => prev + 1);
      setError(msg || 'Invalid authentication code. Please check your Authenticator app.');
      setLoading(false);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="account-pages">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="overflow-hidden">
              <div className="custom-login-header-1 p-4 text-center">
                <h4 className="text-white fw-bold mb-1">
                  <i className="mdi mdi-shield-key-outline me-2"></i>
                  Two-Way Authentication
                </h4>
                <p className="text-white text-opacity-85 small mb-0">
                  Enter the 6-digit verification code from your Authenticator App
                </p>
              </div>

              <CardBody className="p-4 text-center">
                <div className="auth-logo mb-3">
                  <Link to="/login">
                    <img src={logo} alt={appName} style={{ maxHeight: '48px' }} />
                  </Link>
                </div>

                {error && (
                  <Alert color="danger" className="text-start mb-3">
                    <i className="mdi mdi-alert-circle-outline me-2"></i>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert color="success" className="text-start mb-3">
                    <i className="mdi mdi-check-circle-outline me-2"></i>
                    Verification successful! Redirecting to dashboard...
                  </Alert>
                )}

                <div className="mb-2">
                  <span className={`mfa-timer-badge ${timeRemaining < 60 ? 'warning' : 'active'}`}>
                    <i className="mdi mdi-clock-outline"></i>
                    Code expires in {formatTime(timeRemaining)}
                  </span>
                </div>

                {/* 6-Digit Input Boxes */}
                <div className="mfa-digit-inputs">
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      disabled={loading || success}
                      className={`mfa-digit-input ${digit ? 'has-value' : ''}`}
                    />
                  ))}
                </div>

                <div className="form-check d-flex justify-content-center align-items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    className="form-check-input mt-0"
                    id="trustDeviceCheck"
                    checked={trustDevice}
                    onChange={(e) => setTrustDevice(e.target.checked)}
                    disabled={loading}
                  />
                  <label className="form-check-label text-muted small cursor-pointer" htmlFor="trustDeviceCheck">
                    Trust this device for 30 days
                  </label>
                </div>

                <div className="d-grid mb-3">
                  <Button
                    color="primary"
                    className="btn-vc1"
                    onClick={() => handleVerify()}
                    disabled={loading || digits.some((d) => !d) || success}
                  >
                    {loading ? (
                      <>
                        <i className="mdi mdi-loading mdi-spin me-2"></i>
                        Verifying Code...
                      </>
                    ) : (
                      'Verify & Continue'
                    )}
                  </Button>
                </div>

                <div className="text-center pt-2">
                  <Link to="/login" className="text-muted small">
                    <i className="mdi mdi-arrow-left me-1"></i>
                    Back to Standard Login
                  </Link>
                </div>
              </CardBody>
            </Card>

            <div className="text-center auth-footer-text">
              <p className="mb-0">
                © {new Date().getFullYear()} <span>{appName}</span>. Two-Way Security Enabled.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MfaVerification;
