import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Alert, Button, Input, Spinner, Form } from 'reactstrap';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../types/errors';
import defaultLogo from '../../assets/images/ho-logo.svg';
import './login.css';
import './mfa.css';

/**
 * Normalizes QR code string into a valid img src (Data URI or URL)
 */
const normalizeQrCode = (rawQr: string): string => {
  if (!rawQr) return '';
  const trimmed = rawQr.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  // Raw base64 string
  return `data:image/png;base64,${trimmed}`;
};

const MfaSetup: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);

  const userId = searchParams.get('userId');
  const appName = import.meta.env.VITE_APP_NAME || 'HO Tracker';
  const logo = import.meta.env.VITE_COMPANYLOGO || defaultLogo;

  const initSetup = useCallback(async () => {
    if (!userId) {
      setError('Unauthorized or invalid request. User ID not found. Please log in again.');
      setLoading(false);
      setQrCodeUrl('');
      setSecretKey('');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response: any = await authService.setupMfa(userId);

      // Extract secret key from multiple possible response structures
      const secret =
        response?.secretKey ||
        response?.SecretKey ||
        response?.manualEntryKey ||
        response?.ManualEntryKey ||
        response?.secret ||
        response?.Secret ||
        response?.data?.secretKey ||
        response?.data?.secret ||
        response?.data?.manualEntryKey ||
        '';

      // Extract QR code from multiple possible response structures
      const rawQr =
        response?.qrCodeUrl ||
        response?.QrCodeUrl ||
        response?.qrCode ||
        response?.QrCode ||
        response?.qrCodeImage ||
        response?.QrCodeImage ||
        response?.data?.qrCodeUrl ||
        response?.data?.qrCode ||
        '';

      const normalizedQr = normalizeQrCode(rawQr);

      if (!normalizedQr && !secret) {
        throw new Error('No MFA setup data received from server. Please try again.');
      }

      setSecretKey(secret);
      setQrCodeUrl(normalizedQr);
      setLoading(false);
    } catch (err: any) {
      console.error('[MfaSetup] Setup error:', err);
      setError(getErrorMessage(err) || 'Failed to initialize Two-Factor setup. Please ensure you are authorized.');
      setQrCodeUrl('');
      setSecretKey('');
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    document.title = `Setup Two-Factor Authentication | ${appName}`;
    initSetup();
  }, [initSetup, appName]);

  const handleCopySecret = () => {
    if (secretKey) {
      navigator.clipboard.writeText(secretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleEnableMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter the 6-digit code from your authenticator app.');
      return;
    }

    try {
      setVerifying(true);
      setError(null);

      const response: any = await authService.enableMfa(userId, verificationCode);
      setSuccess(true);

      const authCode = response?.Code || response?.code || response?.data?.code || response?.data?.Code;
      const state = response?.State || response?.state || response?.data?.state || response?.data?.State || 'mfa';

      setTimeout(() => {
        if (authCode) {
          navigate(`/oauth-callback?code=${authCode}&state=${state}&provider=webapi&trustedDevice=true`, { replace: true });
        } else {
          navigate(`/mfa-verification?userId=${userId}&source=setup`, { replace: true });
        }
      }, 1500);
    } catch (err: any) {
      console.error('[MfaSetup] Verification error:', err);
      setError(getErrorMessage(err) || 'Incorrect code. Please try again.');
      setVerifying(false);
    }
  };

  return (
    <div className="account-pages py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={6}>
            <Card className="overflow-hidden">
              <div className="custom-login-header-1 p-4 text-center">
                <h4 className="text-white fw-bold mb-1">
                  <i className="mdi mdi-shield-plus-outline me-2"></i>
                  Set Up Two-Factor Authentication
                </h4>
                <p className="text-white text-opacity-85 small mb-0">
                  Protect your {appName} account with an extra layer of security
                </p>
              </div>

              <CardBody className="p-4">
                <div className="auth-logo mb-3 text-center">
                  <Link to="/login">
                    <img src={logo} alt={appName} style={{ maxHeight: '45px' }} />
                  </Link>
                </div>

                {error && (
                  <Alert color="danger">
                    <i className="mdi mdi-alert-circle-outline me-2"></i>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert color="success">
                    <i className="mdi mdi-check-circle-outline me-2"></i>
                    Two-Factor Authentication enabled successfully! Redirecting...
                  </Alert>
                )}

                {loading ? (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                    <div className="text-muted mt-3">Generating secure authenticator QR code...</div>
                  </div>
                ) : !qrCodeUrl && !secretKey ? (
                  /* Unauthorized / Setup Failed State - Do NOT display QR code or setup steps */
                  <div className="text-center py-4">
                    <div className="mb-3">
                      <i className="mdi mdi-shield-alert-outline text-danger" style={{ fontSize: '48px' }}></i>
                    </div>
                    <h5 className="text-dark">Unable to Load 2FA Setup</h5>
                    <p className="text-muted small mb-4">
                      {error || 'You must be authenticated with a valid session to generate a 2FA QR code.'}
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                      <Button color="primary" className="btn-vc1" onClick={() => initSetup()}>
                        <i className="mdi mdi-refresh me-1"></i> Try Again
                      </Button>
                      <Link to="/login" className="btn btn-outline-secondary">
                        <i className="mdi mdi-arrow-left me-1"></i> Back to Login
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Authorized State - Display Setup Steps */
                  <div>
                    {/* Step 1 */}
                    <div className="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
                      <div className="badge bg-primary rounded-circle p-2 fs-6">1</div>
                      <div>
                        <div className="fw-bold text-dark">Get an Authenticator App</div>
                        <div className="text-muted small">
                          Install <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong>, or <strong>Authy</strong> on your phone.
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
                      <div className="badge bg-primary rounded-circle p-2 fs-6">2</div>
                      <div className="flex-grow-1">
                        <div className="fw-bold text-dark mb-2">Scan the QR Code</div>
                        {qrCodeUrl ? (
                          <div className="text-center my-2">
                            <div className="qr-code-box">
                              <img src={qrCodeUrl} alt="Authenticator QR Code" />
                            </div>
                          </div>
                        ) : null}

                        {secretKey && (
                          <div className="mt-2">
                            <div className="text-muted small mb-1">Or enter this setup key manually:</div>
                            <div className="secret-key-display">
                              <span>{secretKey}</span>
                              <Button size="sm" color="light" onClick={handleCopySecret} title="Copy Key">
                                <i className={`mdi ${copied ? 'mdi-check text-success' : 'mdi-content-copy'}`}></i>
                                {copied ? ' Copied' : ' Copy'}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="d-flex align-items-start gap-3 mb-3">
                      <div className="badge bg-primary rounded-circle p-2 fs-6">3</div>
                      <div className="flex-grow-1">
                        <div className="fw-bold text-dark mb-2">Verify & Activate</div>
                        <Form onSubmit={handleEnableMfa}>
                          <div className="mb-3">
                            <Input
                              type="text"
                              maxLength={6}
                              placeholder="Enter 6-digit code"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                              className="form-control text-center font-monospace fs-4 fw-bold"
                              disabled={verifying || success}
                            />
                          </div>

                          <div className="d-grid">
                            <Button
                              color="primary"
                              className="btn-vc1"
                              type="submit"
                              disabled={verifying || verificationCode.length !== 6 || success}
                            >
                              {verifying ? (
                                <>
                                  <i className="mdi mdi-loading mdi-spin me-2"></i>
                                  Activating 2FA...
                                </>
                              ) : (
                                'Verify & Activate Two-Way Auth'
                              )}
                            </Button>
                          </div>
                        </Form>
                      </div>
                    </div>

                    <div className="text-center pt-3 border-top">
                      <Link to="/login" className="text-muted small">
                        <i className="mdi mdi-arrow-left me-1"></i> Back to Login
                      </Link>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MfaSetup;
