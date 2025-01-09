/*
 * This file is part of Invenio.
 * Copyright (C) 2023 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */
import { APIRoutes } from "./routes";
import { http } from "react-invenio-forms";

const addUserToGroup = async (group, user_id) => {
  return await http.put(APIRoutes.adduser(group, user_id));
};

const removeUserFromGroup = async (group, user_id) => {
  return await http.delete(APIRoutes.removeuser(group, user_id));
};

const groupUsers = async (group) => {
  return await http.get(APIRoutes.groupusers(group));
};

const groups = async () => {
  return await http.get(APIRoutes.groups());
};

export const GroupModerationApi = {
  addUserToGroup: addUserToGroup,
  removeUserFromGroup: removeUserFromGroup,
  groupUsers: groupUsers,
  groups: groups
};
