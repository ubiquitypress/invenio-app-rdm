
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
import { ManageGroupUsersForm } from "./ManageGroupUsersForm";
import { i18next } from "@translations/invenio_app_rdm/i18next";

export class ManageGroupUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      modalHeader: undefined,
      modalBody: undefined,
    };
  }

  onModalTriggerClick = (e) => {
    const { group } = this.props;

    this.setState({
      modalOpen: true,
      modalHeader: i18next.t("Manage user groups"),
      modalBody: (
        <ManageGroupUsersForm
          actionCloseCallback={this.closeModal}
          group={group}
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
    const { group } = this.props;
    const { modalOpen, modalHeader, modalBody } = this.state;
    return (
      <>
        <Dropdown.Item
          key="add-user-to-group"
          onClick={this.onModalTriggerClick}
          icon
          fluid
          basic
          labelPosition="left"
        >
          <Icon name="spy" />
          Manage Users
        </Dropdown.Item>
        <ActionModal modalOpen={modalOpen} group={group}>
          {modalHeader && <Modal.Header>{modalHeader}</Modal.Header>}
          {!_isEmpty(modalBody) && modalBody}
        </ActionModal>
      </>
    );
  }
}

ManageGroupUsers.propTypes = {
  group: PropTypes.object.isRequired,
};

ManageGroupUsers.defaultProps = {};
