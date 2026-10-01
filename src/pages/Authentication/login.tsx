import React, { useEffect, useState } from 'react';
import { Row, Col, CardBody, Card, Container, Form, Input, Label, FormFeedback, Alert } from 'reactstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { loginuser, resetLoginMsgFlag } from '../../slices/auth/login/thunk';
import withRouter from '../../Components/Common/withRouter';
import { RootState } from '../../slices';
import defaultLogo from '../../assets/images/ho-logo.svg';
import defaultProfile from '../../assets/images/profile-img.svg';
import './login.css';

interface LoginProps {
  router?: {
    location: any;
    navigate: any;
    params: any;
  };
}

const Login: React.FC<LoginProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch: any = useDispatch();

  const logo = import.meta.env.VITE_COMPANYLOGO || defaultLogo;
  const profile = import.meta.env.VITE_PROFILEIMAGE || defaultProfile;
  const appName = import.meta.env.VITE_APP_NAME || 'HO Tracker';

  useEffect(() => {
    document.title = `Login | ${appName}`;
    dispatch(resetLoginMsgFlag());
    if (localStorage.getItem('authUser')) {
      props.router?.navigate('/dashboard');
    }
  }, [dispatch, appName, props.router]);

  const { error, loading } = useSelector((state: RootState) => ({
    error: state.Login.error,
    loading: state.Login.loading,
  }));

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Please enter a valid email').required('Please enter your email'),
      password: Yup.string().required('Please enter your password'),
    }),
    onSubmit: (values) => {
      dispatch(loginuser(values, props.router?.navigate));
    },
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(resetLoginMsgFlag());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, error]);

  return (
    <React.Fragment>
      <div className="account-pages">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="custom-login-header-1">
                  <Row>
                    <Col xs={7}>
                      <div className="text-header p-4">
                        <h5>Welcome Back !</h5>
                        <p>Sign in to {appName}.</p>
                      </div>
                    </Col>
                    <Col xs={5} className="align-self-end text-end pe-4 pb-2">
                      <img
                        src={profile}
                        alt="Auth header banner"
                        className="img-fluid"
                        style={{ maxHeight: '90px' }}
                      />
                    </Col>
                  </Row>
                </div>

                <CardBody className="pt-0">
                  <div className="auth-logo">
                    <a href="/" className="auth-logo-dark">
                      <img src={logo} alt={appName} style={{ height: '50px' }} />
                    </a>
                  </div>

                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!loading) {
                          validation.handleSubmit();
                        }
                      }}
                    >
                      {error ? (
                        <Alert color="danger" className="mb-3">
                          <i className="mdi mdi-alert-circle-outline me-2"></i>
                          {error}
                        </Alert>
                      ) : null}

                      <div className="mb-3">
                        <Label className="form-label" htmlFor="useremail">
                          Email Address
                        </Label>
                        <Input
                          id="useremail"
                          name="email"
                          className="form-control"
                          placeholder="Enter your email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email}
                          disabled={loading}
                          invalid={validation.touched.email && !!validation.errors.email}
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <Label className="form-label mb-0" htmlFor="userpassword">
                            Password
                          </Label>
                          <a href="/forgot-password" className="text-muted small">
                            Forgot password?
                          </a>
                        </div>
                        <div className="input-group auth-pass-inputgroup">
                          <Input
                            id="userpassword"
                            name="password"
                            value={validation.values.password}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            disabled={loading}
                            invalid={validation.touched.password && !!validation.errors.password}
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="btn btn-light"
                            type="button"
                            id="password-addon"
                            disabled={loading}
                            title={showPassword ? 'Hide password' : 'Show password'}
                          >
                            <i className={showPassword ? 'mdi mdi-eye-off-outline' : 'mdi mdi-eye-outline'}></i>
                          </button>
                        </div>
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="form-check mb-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          disabled={loading}
                        />
                        <label className="form-check-label text-muted small" htmlFor="customControlInline">
                          Remember me on this device
                        </label>
                      </div>

                      <div className="mt-4 d-grid">
                        <button className="btn btn-vc1" type="submit" disabled={loading}>
                          {loading ? (
                            <>
                              <i className="mdi mdi-loading mdi-spin me-2"></i>
                              Signing in...
                            </>
                          ) : (
                            'Sign In'
                          )}
                        </button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="text-center auth-footer-text">
                <p className="mb-0">
                  © {new Date().getFullYear()} <span>{appName}</span>. All rights reserved.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Login);
