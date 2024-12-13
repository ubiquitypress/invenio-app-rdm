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

import { withCancel, ErrorMessage, SelectField, ErrorLabel } from "react-invenio-forms";
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
      userRoles: [],
    };
    this.confirmSchema = Yup.object({
      selectedOption: Yup.string()
        .required('This field is required'),
    });
  }

  componentDidMount() {
    console.log("Fetching dropdown options...");
    this.fetchDropdownOptions();
  }


  getOptions = async (user_response, group_response) => {
    const userGroupIds = user_response.hits.hits.map((item) => item.id);
    return group_response.hits.hits.map((item, index) => ({
      key: index,
      text: userGroupIds.includes(item.id) 
      ? `Remove '${item.name}'` 
      : `Add '${item.name}'`,
      value: userGroupIds.includes(item.id) 
      ? `remove:${item.name}` 
      : `add:${item.name}`,
    }));
  };

  // Fetch dropdown options from API
  fetchDropdownOptions = async () => {
    const { user } = this.props;
    try {
      const userResponse =  await UserModerationApi.userGroups(user) // Replace with your API URL
      const response =  await UserModerationApi.groups() // Replace with your API URL
      this.setState({
        dropdownOptions: await this.getOptions(userResponse.data, response.data),
        userRoles: userResponse.data.hits.hits.map(item => ({
          name: item.name,
          description: item.description
        })),
        loading: false,
      });
        } catch (error) {
      this.setState({
        error: 'Failed to fetch group options.',
        loading: false,
      });
        }
      };

      componentWillUnmount() {
        this.cancellableAction && this.cancellableAction.cancel();
      }

      static contextType = NotificationContext;

      handleSubmit = async (values) => {
    this.setState({ loading: true });
    const { addNotification } = this.context;
    const { user, actionCloseCallback } = this.props;
    console.log(values.selectedOption)
    const [action, group] = values.selectedOption.split(':');
    const apiMethod = action === 'add' ? UserModerationApi.addGroupToUser : UserModerationApi.removeGroupFromUser;
    this.cancellableAction = withCancel(apiMethod(user, group));
    try {
      await this.cancellableAction.promise;
      this.setState({ loading: false, error: undefined });
      const successMessage = action === 'add' 
        ? i18next.t("Added group to user successfully!") 
        : i18next.t("Removed group from user successfully!");
      addNotification({
        title: i18next.t("Success"),
        content: i18next.t(
          successMessage,
          {
            id: user.id,
          }
        ),
        type: "success",
      });
      actionCloseCallback();
    } catch (error) {
      if (error === "UNMOUNTED") return;

      this.setState({
        error: error?.response?.data?.message || error?.message,
        loading: false,
      });
      console.error(error);
    }
  };


  handleOnChange = ({ data, formikProps }) => {
    formikProps.form.setFieldValue("selectedOption", data.value);
  };

  handleModalClose = () => {
    const { actionCloseCallback } = this.props;
    actionCloseCallback();
  };


  initFormValues = () => {
    return {
      selectedOption: ''
    };
  };

  render() {
    const { userRoles, dropdownOptions, error, loading } = this.state;
    return (
      <Formik
        onSubmit={this.handleSubmit}
        initialValues={this.initFormValues()}
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
                header={i18next.t("Unable to manage group")}
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
                "Please be aware that you can give user access to administration groups."
                )}
                </p>
              </Message>
              <Form>
                <Form.Field id="selectedOption">
                  <SelectField
                  label="Choose a group:"
                  fieldPath="selectedOption"
                  options={dropdownOptions}
                  onChange={this.handleOnChange}
                  />
                  <ErrorLabel
                  role="alert"
                  fieldPath="selectedOption"
                  className="mt-0 mb-5"
                  />
                </Form.Field>
              </Form>
              <Message visible>
                <h4>{i18next.t("Current User Roles")}</h4>
                <ul>
                {userRoles.length > 0 ? (
                  userRoles.map((role, index) => (
                  <li key={index}>
                    <strong>{role.name}</strong>: {role.description}
                  </li>
                  ))
                ) : (
                  <li>{i18next.t("Not assigned to any groups yet.")}</li>
                )}
                </ul>
              </Message>
              <Modal.Actions>
                <Button onClick={this.handleModalClose} floated="left">
                Close
                </Button>
                <Button size="small"
                type="submit"
                labelPosition="left"
                icon="check"
                color="green"
                content={i18next.t("Update Group")}
                onClick={(event) => handleSubmit(event)}
                loading={loading}
                disabled={loading}>
                </Button>
              </Modal.Actions>
              </Modal.Content>
              </>
              );
        }}
      </Formik>
    );
  }
}

ManageUserGroupsForm.propTypes = {
  user: PropTypes.object.isRequired,
  actionCloseCallback: PropTypes.func.isRequired,
};
