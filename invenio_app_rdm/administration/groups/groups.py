# -*- coding: utf-8 -*-
#
# Copyright (C) 2023-2024 CERN.
# Copyright (C) 2024 Ubiquity Press.
#
# Invenio App RDM is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio administration users view module."""

from functools import partial

from flask import current_app
from invenio_administration.views.base import (
    AdminResourceCreateView,
    AdminResourceDetailView,
    AdminResourceListView,
    AdminResourceEditView,
)
from invenio_i18n import lazy_gettext as _
from invenio_search_ui.searchconfig import search_app_config

GROUPS_ITEM_LIST = {
    "name": {"text": _("Name"), "order": 1, "width": 2},
    "description": {"text": _("Description"), "order": 2, "width": 5},
    "is_managed": {"text": _("Is managed"), "order": 3, "width": 1},
    "created": {"text": _("Created"), "order": 4, "width": 2},
    "updated": {"text": _("Updated"), "order": 5, "width": 2},
}

GROUPS_ITEM_DETAIL = {
    "id": {"text": _("ID"), "order": 1, "width": 1},
    "name": {"text": _("Name"), "order": 2, "width": 2},
    "description": {"text": _("Description"), "order": 3, "width": 5},
    "is_managed": {"text": _("Is managed"), "order": 3, "width": 1},
    "created": {"text": _("Created"), "order": 4, "width": 2},
    "updated": {"text": _("Updated"), "order": 5, "width": 2},
}

GROUPS_DEFAULT_FORM_ITEMS = {
    "name": {"text": _("Name"), "order": 1, "width": 2},
    "description": {"text": _("Description"), "order": 2, "width": 5},
}


# List of the columns displayed on the user list, user details, and user creaste form


class GroupsListView(AdminResourceListView):
    """Configuration for users sets list view."""

    api_endpoint = "/groups"
    extension_name = "invenio-users-resources"
    name = "groups"
    resource_config = "groups_resource"
    title = "Group management"
    menu_label = "Groups"
    category = "User management"
    pid_path = "id"
    icon = "users" 

    display_search = True
    display_delete = False
    display_edit = True
    display_create = True
    # self.name from create class
    create_view_name = "invenio-groups-resources-create"

    item_field_list = GROUPS_ITEM_LIST

    search_config_name = "USERS_RESOURCES_GROUPS_SEARCH"
    search_sort_config_name = "USERS_RESOURCES_GROUPS_SORT_OPTIONS"
    search_facets_config_name = "USERS_RESOURCES_GROUPS_SEARCH_FACETS"
    search_request_headers = {"Accept": "application/json"}
    template = "invenio_app_rdm/administration/groups_search.html"

    # These actions are not connected on the frontend -
    # TODO: missing permission based links in resource
    actions = {}

    @staticmethod
    def disabled():
        """Disable the view on demand."""
        return not current_app.config["USERS_RESOURCES_GROUPS_ENABLED"]

    def init_search_config(self):
        """Build search view config."""
        return partial(
            search_app_config,
            config_name=self.get_search_app_name(),
            available_facets=current_app.config.get(self.search_facets_config_name),
            sort_options=current_app.config[self.search_sort_config_name],
            endpoint=self.get_api_endpoint(),
            headers=self.get_search_request_headers(),
            initial_filters=[],
            hidden_params=[],
            pagination_options=(20, 50),
            default_size=20,
        )


class GroupsDetailView(AdminResourceDetailView):
    """Configuration for users sets detail view."""

    url = "/groups/<pid_value>"
    api_endpoint = "/groups/"
    search_request_headers = {"Accept": "application/json"}
    extension_name = "invenio-users-resources"
    name = "Group details"
    resource_config = "groups_resource"
    title = _("Group details")
    display_delete = False
    display_edit = False

    pid_path = "id"
    item_field_list = GROUPS_ITEM_DETAIL


class FormMixin:
    """Mixin class for form fields."""

    form_fields = {
        "name": {
            "order": 1,
            "text": _("Name"),
            "description": _("Name of group"),
        },
        "description": {
            "order": 2,
            "required": False,
            "text": _("Description"),
            "description": _(
                "Description of group."
            ),
        },
    }


class GroupsCreateView(FormMixin, AdminResourceCreateView):
    """Configuration for user create view."""

    url = "/group/create"
    api_endpoint = "/groups"
    extension_name = "invenio-users-resources"
    name = "invenio-groups-resources-create"
    resource_config = "groups_resource"
    title = _("Create group details")
    pid_path = "id"
    list_view_name = "groups"


class GroupsEditView(FormMixin, AdminResourceEditView):
    """Configuration for user create view."""

    url = "/groups/<pid_value>/edit"
    api_endpoint = "/groups"
    extension_name = "invenio-users-resources"
    name = "invenio-groups-resources-edit"
    resource_config = "groups_resource"
    title = _("Edit group details")
    pid_path = "id"
    list_view_name = "groups"
