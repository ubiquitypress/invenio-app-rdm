/*
 * // This file is part of Invenio-App-Rdm
 * // Copyright (C) 2023 CERN.
 * //
 * // Invenio-App-Rdm is free software; you can redistribute it and/or modify it
 * // under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { Formik } from "formik";
import _get from "lodash/get";

import { withCancel, ErrorMessage} from "react-invenio-forms";
import { Form, Button, Modal, Message, Icon } from "semantic-ui-react";
import { NotificationContext } from "@js/invenio_administration";
import * as Yup from "yup";
import { UserModerationApi } from "../users/api";

export class ManageUserGroupsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: undefined,
      dropdownOptions: [],
    };
    this.confirmSchema = Yup.object({
      selectedOption: Yup.string()
        .required('This field is required'),
    });
  }

  componentDidMount() {
    this.fetchDropdownOptions();
  }

  // Fetch dropdown options from API
  fetchDropdownOptions = async () => {
    try {
      const response =  UserModerationApi.groups() // Replace with your API URL
      this.setState({
        dropdownOptions: response.data.hits.hits, // Assume the API response contains an 'options' array
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: 'Failed to fetch options.',
        loading: false,
      });
    }
  };

  componentWillUnmount() {
    this.cancellableAction && this.cancellableAction.cancel();
  }

  static contextType = NotificationContext;

  handleSubmit = async (event) => {
    this.setState({ loading: true });
    const { addNotification } = this.context;
    const { user, actionSuccessCallback } = this.props;
    this.cancellableAction = withCancel(UserModerationApi.addGroupToUser(user, event.selectedOption.value));
    try {
      await this.cancellableAction.promise;
      this.setState({ loading: false, error: undefined });
      addNotification({
        title: i18next.t("Success"),
        content: i18next.t(
          "Added group to user succesfully! You will be redirected in frontpage soon.",
          {
            id: user.id,
          }
        ),
        type: "success",
      });
      actionSuccessCallback();
    } catch (error) {
      if (error === "UNMOUNTED") return;

      this.setState({
        error: error?.response?.data?.message || error?.message,
        loading: false,
      });
      console.error(error);
    }
  };

  handleModalClose = () => {
    const { actionCancelCallback } = this.props;
    actionCancelCallback();
  };

  render() {
    const { dropdownOptions, error, loading } = this.state;
    return (
      <Formik
        onSubmit={this.handleSubmit}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={() => this.confirmSchema}
      >
        {({ values, handleSubmit }) => {
          return (
            <>
              {error && (
                <ErrorMessage
                  header={i18next.t("Unable to impersonate user.")}
                  content={i18next.t(error)}
                  icon="exclamation"
                  className="text-align-left"
                  negative
                />
              )}

              <Modal.Content>
                <Message visible error>
                  <p>
                    <Icon name="warning sign" />
                    {i18next.t(
                      "Please read carefully and confirm the following statements before you proceed."
                    )}
                  </p>
                </Message>
                <Form>
                  <label htmlFor="selectedOption">Choose a group:</label>
                  <Field
                    as="select"
                    id="selectedOption"
                    name="selectedOption"
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {dropdownOptions.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="selectedOption"
                    component="div"
                    style={{ color: 'red' }}
                  />
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={this.handleModalClose} floated="left">
                  Close
                </Button>
                <Button
                  size="small"
                  labelPosition="left"
                  icon="check"
                  color="green"
                  content={i18next.t("Add Group")}
                  onClick={(event) => handleSubmit(event)}
                  loading={loading}
                  disabled={loading}
                />
              </Modal.Actions>
            </>
          );
        }}
      </Formik>
    );
  }
}

ManageUserGroupsForm.propTypes = {
  user: PropTypes.object.isRequired,
  actionSuccessCallback: PropTypes.func.isRequired,
  actionCancelCallback: PropTypes.func.isRequired,
};
