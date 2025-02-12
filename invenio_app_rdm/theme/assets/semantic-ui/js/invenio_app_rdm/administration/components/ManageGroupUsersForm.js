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
import { GroupModerationApi } from "../groups/api";

export class ManageGroupUsersForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: undefined,
      dropdownOptions: [],
      groupUsersRoles: [],
    };
    this.confirmSchema = Yup.object({
      selectedOption: Yup.array()
        .of(Yup.string())
        .required('This field is required'),
    });
  }

  componentDidMount() {
    console.log("Fetching dropdown options...");
    this.fetchDropdownOptions();
  }


  getOptions = async (group_users_response, user_response) => {
    const groupUserIds = group_users_response.hits.hits.map((item) => String(item.id));
    return user_response.hits.hits.map((item, index) => ({
      key: index,
      text: groupUserIds.includes(item.id) 
      ? `Remove '${item.email}'` 
      : `Add '${item.email}'`,
      value: groupUserIds.includes(item.id) 
      ? `remove:${item.id}` 
      : `add:${item.id}`,
    }));
  };

  // Fetch dropdown options from API
  fetchDropdownOptions = async () => {
    const { group } = this.props;
    try {
      const groupUsersResponse =  await GroupModerationApi.groupUsers(group) // Replace with your API URL
      const response =  await UserModerationApi.users() // Replace with your API URL
      this.setState({
        dropdownOptions: await this.getOptions(groupUsersResponse.data, response.data),
        groupUsersRoles: groupUsersResponse.data.hits.hits.map(item => ({
          email: item.email
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
    const { group, actionCloseCallback } = this.props;
    for (const option of values.selectedOption) {
      const [action, user_id] = option.split(':');
      const apiMethod = action === 'add' ? GroupModerationApi.addUserToGroup : GroupModerationApi.removeUserFromGroup;
      this.cancellableAction = withCancel(apiMethod(group, user_id));
      try {
        await this.cancellableAction.promise;
        const successMessage = action === 'add' 
          ? i18next.t("Added user {{user_id}} to group successfully!", { user_id }) 
          : i18next.t("Removed user {{user_id}} from group successfully!", { user_id });
        addNotification({
          title: i18next.t("Success"),
          content: i18next.t(
            successMessage,
            {
              id: group.id,
            }
          ),
          type: "success",
        });
      } catch (error) {
        if (error === "UNMOUNTED") return;

        this.setState({
          error: error?.response?.data?.message || error?.message,
          loading: false,
        });
        console.error(error);
        break;
      }
    };
    this.setState({ loading: false, error: undefined });
    actionCloseCallback();
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
    const {groupUsersRoles, dropdownOptions, error, loading } = this.state;
    return (
      <Formik
        onSubmit={this.handleSubmit}
        initialValues={this.initFormValues()}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={() => this.confirmSchema}
      >
      {({ handleSubmit }) => {
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
                  multiple={true}
                  fieldPath="selectedOption"
                  options={dropdownOptions}
                  />
                </Form.Field>
              </Form>
              <Message visible>
                <h4>{i18next.t("Current Group Users")}</h4>
                <ul>
                {groupUsersRoles.length > 0 ? (
                  groupUsersRoles.map((role, index) => (
                  <li key={index}>
                    <strong>{role.username}</strong>
                  </li>
                  ))
                ) : (
                  <li>{i18next.t("Not assigned to any users yet.")}</li>
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
};

ManageGroupUsersForm.propTypes = {
  group: PropTypes.object.isRequired,
  actionCloseCallback: PropTypes.func.isRequired,
};
