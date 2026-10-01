import React from 'react';
import withRouter from '../Components/Common/withRouter';

interface NonAuthLayoutProps {
  children: React.ReactNode;
}

const NonAuthLayout: React.FC<NonAuthLayoutProps> = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};

export default withRouter(NonAuthLayout as any);
