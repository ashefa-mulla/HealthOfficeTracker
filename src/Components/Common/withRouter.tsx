import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function withRouter<P extends object>(Component: React.ComponentType<P>) {
  function ComponentWithRouterProp(props: P) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }
  return ComponentWithRouterProp;
}

export default withRouter;
