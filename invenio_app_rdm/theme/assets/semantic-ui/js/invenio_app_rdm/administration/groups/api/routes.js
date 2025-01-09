/*
 * This file is part of Invenio.
 * Copyright (C) 2023 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _get from "lodash/get";

const APIRoutesGenerators = {

  adduser: (group, user_id, idKeyPath = "id") => {
    return `/api/groups/${_get(group, idKeyPath)}/users/${user_id}`;
  },
  
  removeuser: (group, user_id, idKeyPath = "id") => {
    return `/api/groups/${_get(group, idKeyPath)}/users/${user_id}`;
  },

  groupusers: (group, idKeyPath = "id") => {
    return `/api/groups/${_get(group, idKeyPath)}/users`;
  },

  groups: () => {
    return `/api/groups`;
  },

};
export const APIRoutes = {
  ...APIRoutesGenerators,
};
