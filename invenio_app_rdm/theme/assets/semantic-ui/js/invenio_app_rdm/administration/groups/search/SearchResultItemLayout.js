/*
 * This file is part of Invenio.
 * Copyright (C) 2022-2024 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { BoolFormatter, DateFormatter, AdminUIRoutes} from "@js/invenio_administration";
import { GroupActions } from "../GroupActions";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Table, Dropdown, Icon } from "semantic-ui-react";
import { withState } from "react-searchkit";
import { i18next } from "@translations/invenio_app_rdm/i18next";

class SearchResultItemComponent extends Component {
  refreshAfterAction = () => {
    const { updateQueryState, currentQueryState } = this.props;
    updateQueryState(currentQueryState);
  };

  render() {
    const { result, idKeyPath, listUIEndpoint } = this.props;

    return (
      <Table.Row>
        {/*<Table.Cell>*/}
        {/*We pass user ID to bulk actions - user moderation API takes user IDs*/}
        {/*<SearchResultsRowCheckbox rowId={userId} data={result} />*/}
        {/*</Table.Cell>*/}
        <Table.Cell
          collapsing
          key={`group-id-${result.id}`}
          data-label={i18next.t("Group")}
          className="word-break-all"
        >
          {result.name}
        </Table.Cell>
        <Table.Cell
          collapsing
          key={`group-description-${result.id}`}
          data-label={i18next.t("Description")}
          className="word-break-all"
        >
          {result.description}
        </Table.Cell>
        <Table.Cell
          collapsing
          key={`group-is-managed-${result.id}`}
          data-label={i18next.t("Is Managed")}
          className="word-break-all"
        >
          <BoolFormatter
            tooltip={i18next.t("Is Managed")}
            icon="check"
            color="green"
            value={result.is_managed}
          />
        </Table.Cell>
        <Table.Cell
          collapsing
          key={`group-created-${result.id}`}
          data-label={i18next.t("Created")}
          className="word-break-all"
        >
          <DateFormatter value={result.created} />
        </Table.Cell>
        <Table.Cell
          collapsing
          key={`group-updated-${result.id}`}
          data-label={i18next.t("Updated")}
          className="word-break-all"
        >
          <DateFormatter value={result.updated} />
        </Table.Cell>
        <Table.Cell collapsing>
          <GroupActions
            useDropdown
            group={result}
            successCallback={this.refreshAfterAction}
            displayManageGroups
            displayDelete
            displayEdit
            editUrl={AdminUIRoutes.editView(listUIEndpoint, result, idKeyPath)}
            resource={result}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

SearchResultItemComponent.propTypes = {
  title: PropTypes.string.isRequired,
  resourceName: PropTypes.string.isRequired,
  displayDelete: PropTypes.bool,
  displayEdit: PropTypes.bool,
  result: PropTypes.object.isRequired,
  idKeyPath: PropTypes.string.isRequired,
  updateQueryState: PropTypes.func.isRequired,
  currentQueryState: PropTypes.object.isRequired,
  listUIEndpoint: PropTypes.string.isRequired,
};

SearchResultItemComponent.defaultProps = {};

export const SearchResultItemLayout = withState(SearchResultItemComponent);
