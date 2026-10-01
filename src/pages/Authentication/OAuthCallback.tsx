import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Progress, Alert } from 'reactstrap';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../types/errors';
import defaultLogo from '../../assets/images/ho-logo.svg';
import './login.css';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(20);
  const [statusMessage, setStatusMessage] = useState('Validating authentication credentials...');

  const appName = import.meta.env.VITE_APP_NAME || 'HO Tracker';
  const logo = import.meta.env.VITE_COMPANYLOGO || defaultLogo;

  useEffect(() => {
    document.title = `Authenticating | ${appName}`;

    const exchange = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const provider = searchParams.get('provider') || 'webapi';
      const isTrusted = searchParams.get('trustedDevice');
      const trustedDevice = isTrusted === 'true' || isTrusted === '1';

      if (!code || !state) {
        setError('Invalid callback URL. Missing authorization code or state.');
        return;
      }

      try {
        setProgress(40);
        setStatusMessage('Exchanging authorization code...');

        const response = await authService.exchangeCodeForToken({
          code,
          state,
          provider,
          trustedDevice,
        });

        const status = response.status || response.Status;
        if (status === 'RequiresMfa' || status === 1) {
          const userId = response.userId || response.UserId;
          navigate(`/mfa-verification?userId=${userId}`, { replace: true });
          return;
        }

        setProgress(90);
        setStatusMessage('Establishing secure workspace session...');

        setTimeout(() => {
          setProgress(100);
          navigate('/dashboard', { replace: true });
        }, 500);
      } catch (err: any) {
        console.error('[OAuthCallback] Token exchange error:', err);
        setError(getErrorMessage(err) || 'Failed to complete authentication exchange.');
      }
    };

    exchange();
  }, [searchParams, navigate, appName]);

  return (
    <div className="account-pages">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="overflow-hidden">
              <div className="custom-login-header-1 p-4 text-center">
                <h4 className="text-white fw-bold mb-1">
                  <i className="mdi mdi-shield-check-outline me-2"></i>
                  Authenticating Session
                </h4>
                <p className="text-white text-opacity-85 small mb-0">
                  Please wait while we establish your secure session
                </p>
              </div>

              <CardBody className="p-4 text-center">
                <div className="auth-logo mb-4">
                  <img src={logo} alt={appName} style={{ maxHeight: '50px' }} />
                </div>

                {error ? (
                  <div>
                    <Alert color="danger" className="text-start mb-3">
                      <i className="mdi mdi-alert-circle-outline me-2"></i>
                      {error}
                    </Alert>
                    <Link to="/login" className="btn btn-primary btn-vc1">
                      Return to Login
                    </Link>
                  </div>
                ) : (
                  <div className="py-3">
                    <div className="mb-3 text-muted fw-semibold small">{statusMessage}</div>
                    <Progress value={progress} color="primary" className="rounded-pill mb-2" style={{ height: '8px' }} />
                    <div className="text-muted small">
                      <i className="mdi mdi-loading mdi-spin me-1"></i>
                      Finalizing credentials...
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

export default OAuthCallback;
