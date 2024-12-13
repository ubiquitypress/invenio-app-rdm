
/*
 * // This file is part of Invenio-App-Rdm
 * // Copyright (C) 2023 CERN.
 * //
 * // Invenio-App-Rdm is free software; you can redistribute it and/or modify it
 * // under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Icon, Dropdown } from "semantic-ui-react";
import { ActionModal } from "@js/invenio_administration";
import _isEmpty from "lodash/isEmpty";
import { ManageUserGroupsForm } from "./ManageUserGroupsForm";
import { i18next } from "@translations/invenio_app_rdm/i18next";

export class ManageUserGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      modalHeader: undefined,
      modalBody: undefined,
    };
  }

  onModalTriggerClick = (e) => {
    const { user } = this.props;

    this.setState({
      modalOpen: true,
      modalHeader: i18next.t("Manage user groups"),
      modalBody: (
        <ManageUserGroupsForm
          actionCloseCallback={this.closeModal}
          user={user}
        />
      ),
    });
  };

  closeModal = () => {
    this.setState({
      modalOpen: false,
      modalHeader: undefined,
      modalBody: undefined,
    });
  };

  handleSuccess = () => {
    const { successCallback } = this.props;
    this.setState({
      modalOpen: false,
      modalHeader: undefined,
      modalBody: undefined,
    });
    successCallback();
  };

  render() {
    const { user } = this.props;
    const { modalOpen, modalHeader, modalBody } = this.state;
    return (
      <>
        <Dropdown.Item
          key="add-group-to-user"
          onClick={this.onModalTriggerClick}
          icon
          fluid
          basic
          labelPosition="left"
        >
          <Icon name="spy" />
          Manage Groups
        </Dropdown.Item>
        <ActionModal modalOpen={modalOpen} user={user}>
          {modalHeader && <Modal.Header>{modalHeader}</Modal.Header>}
          {!_isEmpty(modalBody) && modalBody}
        </ActionModal>
      </>
    );
  }
}

ManageUserGroups.propTypes = {
  user: PropTypes.object.isRequired,
};

ManageUserGroups.defaultProps = {};
