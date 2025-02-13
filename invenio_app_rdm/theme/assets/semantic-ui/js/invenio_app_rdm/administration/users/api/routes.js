/*
 * This file is part of Invenio.
 * Copyright (C) 2023 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _get from "lodash/get";

const APIRoutesGenerators = {
  restore: (user, idKeyPath = "id") => {
    return `/api/users/${_get(user, idKeyPath)}/restore`;
  },

  block: (user, idKeyPath = "id") => {
    return `/api/users/${_get(user, idKeyPath)}/block`;
  },

  approve: (user, idKeyPath = "id") => {
    return `/api/users/${_get(user, idKeyPath)}/approve`;
  },

  activate: (user, idKeyPath = "id") => {
    return `/api/users/${_get(user, idKeyPath)}/activate`;
  },

  deactivate: (user, idKeyPath = "id") => {
    return `/api/users/${_get(user, idKeyPath)}/deactivate`;
  },

  impersonate: (user, idKeyPath = "id") => {
    return `/api/users/${_get(user, idKeyPath)}/impersonate`;
  },

  addgroup: (user, group, idKeyPath = "id") => {
    return `/api/users/${_get(user, idKeyPath)}/groups/${group}`;
  },
  
  removegroup: (user, group, idKeyPath = "id") => {
    return `/api/users/${_get(user, idKeyPath)}/groups/${group}`;
  },

  usergroups: (user, idKeyPath = "id") => {
    return `/api/users/${_get(user, idKeyPath)}/groups`;
  },

  users: () => {
    return `/api/users/all`;
  },

};
export const APIRoutes = {
  ...APIRoutesGenerators,
};
