/*
 * This file is part of Invenio.
 * Copyright (C) 2023 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */
import { APIRoutes } from "./routes";
import { http } from "react-invenio-forms";

const restoreUser = async (user) => {
  return await http.post(APIRoutes.restore(user));
};

const blockUser = async (user) => {
  return await http.post(APIRoutes.block(user));
};

const deactivateUser = async (user) => {
  return await http.post(APIRoutes.deactivate(user));
};

const approveUser = async (user) => {
  return await http.post(APIRoutes.approve(user));
};

const activateUser = async (user) => {
  return await http.post(APIRoutes.activate(user));
};

const impersonateUser = async (user) => {
  return await http.post(APIRoutes.impersonate(user));
};

const addGroupToUser = async (user, group) => {
  return await http.put(APIRoutes.addgroup(user, group));
};

const removeGroupFromUser = async (user, group) => {
  return await http.delete(APIRoutes.removegroup(user, group));
};

const userGroups = async (user) => {
  return await http.get(APIRoutes.usergroups(user));
};

const users = async () => {
  return await http.get(APIRoutes.users());
};

export const UserModerationApi = {
  restoreUser: restoreUser,
  approveUser: approveUser,
  activateUser: activateUser,
  impersonateUser: impersonateUser,
  deactivateUser: deactivateUser,
  blockUser: blockUser,
  addGroupToUser: addGroupToUser,
  removeGroupFromUser: removeGroupFromUser,
  userGroups: userGroups,
  users: users
};
