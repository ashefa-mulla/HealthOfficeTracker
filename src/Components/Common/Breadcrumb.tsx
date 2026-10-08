import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, BreadcrumbItem } from 'reactstrap';

interface BreadcrumbProps {
  title?: string;
  breadcrumbItem: string;
  pageTitle?: string;
  items?: Array<{
    label: string;
    path?: string;
    active?: boolean;
  }>;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  title,
  breadcrumbItem,
  pageTitle,
  items,
}) => {
  return (
    <Row className="mb-3">
      <Col className="col-12">
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0 font-size-18">{pageTitle || breadcrumbItem}</h4>
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              {title && (
                <BreadcrumbItem>
                  <Link to="#">{title}</Link>
                </BreadcrumbItem>
              )}
              {items ? (
                items.map((item, index) => (
                  <BreadcrumbItem key={index} active={item.active}>
                    {item.path && !item.active ? (
                      <Link to={item.path}>{item.label}</Link>
                    ) : (
                      item.label
                    )}
                  </BreadcrumbItem>
                ))
              ) : (
                <BreadcrumbItem active>{breadcrumbItem}</BreadcrumbItem>
              )}
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Breadcrumb;
