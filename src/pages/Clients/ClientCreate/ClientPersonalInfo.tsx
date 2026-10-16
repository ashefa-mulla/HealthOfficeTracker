import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import { useFormContext } from "react-hook-form";
import {
  RHFInput,
  RHFSelect,
  RHFCheckBox,
  RHFTextArea,
  SelectOption,
} from "@/Components/Common/Forms";
import { RootState } from "@/slices";
import { ClientForm } from "@/types/client/client.schema";
import { fetchClientStates, fetchClientCities } from "@/slices/client/clientThunk";

const toOptions = (items: { id: number; name: string }[]): SelectOption[] =>
  (items || []).map((i) => ({ value: i.id, label: i.name }));

const ClientPersonalInfo: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { watch, setValue } = useFormContext<ClientForm>();
  const { dropdowns } = useSelector((state: RootState) => (state as any).Client);

  const countryId = watch("countryId");
  const stateId = watch("stateId");

  // Cascading Country -> State -> City
  useEffect(() => {
    dispatch(fetchClientStates(Number(countryId || 0)));
  }, [dispatch, countryId]);

  useEffect(() => {
    dispatch(fetchClientCities(Number(stateId || 0)));
  }, [dispatch, stateId]);

  return (
    <>
      <Row>
        <Col md={6} sm={12}>
          <RHFSelect<ClientForm>
            name="companyId"
            label="Company"
            placeholder="-- Select Company --"
            options={toOptions(dropdowns.companies)}
            required
          />
        </Col>
        <Col md={6} sm={12}>
          <RHFInput<ClientForm> name="project" label="Client" required />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <RHFTextArea<ClientForm> name="projectDescription" label="Description" rows={2} />
        </Col>
      </Row>
      <Row>
        <Col md={6} sm={12}>
          <RHFInput<ClientForm> name="vendorCompany" label="Vendor Company" />
        </Col>
        <Col md={6} sm={12}>
          <RHFInput<ClientForm> name="personName" label="Contact Person" />
        </Col>
      </Row>
      <Row>
        <Col md={6} sm={12}>
          <RHFInput<ClientForm> name="addressLine1" label="Address Line 1" />
        </Col>
        <Col md={6} sm={12}>
          <RHFInput<ClientForm> name="addressLine2" label="Address Line 2" />
        </Col>
      </Row>
      <Row>
        <Col md={4} sm={12}>
          <RHFSelect<ClientForm>
            name="countryId"
            label="Country"
            placeholder="-- Select Country --"
            options={toOptions(dropdowns.countries)}
            onChange={() => {
              setValue("stateId", null);
              setValue("cityId", null);
            }}
          />
        </Col>
        <Col md={4} sm={12}>
          <RHFSelect<ClientForm>
            name="stateId"
            label="State"
            placeholder="-- Select State --"
            options={toOptions(dropdowns.states)}
            onChange={() => setValue("cityId", null)}
          />
        </Col>
        <Col md={4} sm={12}>
          <RHFSelect<ClientForm>
            name="cityId"
            label="City"
            placeholder="-- Select City --"
            options={toOptions(dropdowns.cities)}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4} sm={12}>
          <RHFInput<ClientForm> name="zip" label="Zip" />
        </Col>
        <Col md={4} sm={12} className="d-flex align-items-center">
          <RHFCheckBox<ClientForm> name="active" label="Active" />
        </Col>
      </Row>
    </>
  );
};

export default ClientPersonalInfo;
