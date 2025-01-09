/*
 * This file is part of Invenio.
 * Copyright (C) 2022 CERN.
 * Copyright (C) 2024 KTH Royal Institute of Technology.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import isEmpty from "lodash/isEmpty";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Icon, Dropdown } from "semantic-ui-react";
import { NotificationContext, Edit } from "@js/invenio_administration";
import { withCancel } from "react-invenio-forms";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { ManageGroupUsers } from "../components/ManageGroupUsers";

export class GroupActions extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  componentWillUnmount() {
    this.cancellableAction && this.cancellableAction.cancel();
  }

  static contextType = NotificationContext;

  render() {
    const {
      group,
      successCallback,
      displayManageGroups,
      displayEdit,
      editUrl,
      resource,
      useDropdown,
    } = this.props;
    const { loading } = this.state;

    const actionItems = [];

    const generateActions = () => {
      return (
        <>
          {displayManageGroups && (
            <ManageGroupUsers
              group={group}
            />
          )}
        </>
      );
    };

    return (
      <div>
        {useDropdown ? (
          <div>
            {displayEdit && <Edit editUrl={editUrl} resource={resource} />}
            <Dropdown
              text={<Icon name="cog" />}
              tooltip={i18next.t("Actions")}
              button
              className="icon"
              direction="left"
            >
            <Dropdown.Menu>{generateActions()}</Dropdown.Menu>
            </Dropdown>
          </div>
        ) : (
          <Button.Group basic widths={5} compact className="margined">
            {generateActions()}
          </Button.Group>
        )}
      </div>
    );
  }
}

GroupActions.propTypes = {
  group: PropTypes.object.isRequired,
  successCallback: PropTypes.func.isRequired,
  displayManageGroups: PropTypes.bool,
  displayEdit: PropTypes.bool,
  editUrl: PropTypes.string,
  resource: PropTypes.object,
  useDropdown: PropTypes.bool,
};

GroupActions.defaultProps = {
  displayManageGroups: false,
  displayEdit: false,
  useDropdown: false,
};
