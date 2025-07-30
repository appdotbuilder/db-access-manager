
import {
  serial,
  text,
  pgTable,
  timestamp,
  boolean,
  integer,
  pgEnum,
  primaryKey
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const accessLevelEnum = pgEnum('access_level', ['read', 'write', 'apply', 'manage', 'elect']);
export const requestStatusEnum = pgEnum('request_status', ['pending', 'approved', 'denied', 'modified', 'expired']);
export const actionTypeEnum = pgEnum('action_type', ['submitted', 'approved', 'denied', 'modified', 'expired', 'reviewed']);
export const userRoleEnum = pgEnum('user_role', ['user', 'approver', 'admin']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: userRoleEnum('role').notNull().default('user'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Groups table
export const groupsTable = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Teams table
export const teamsTable = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Database tables
export const databaseTablesTable = pgTable('database_tables', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  schema_name: text('schema_name').notNull(),
  description: text('description'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Projects table
export const projectsTable = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Access requests table
export const accessRequestsTable = pgTable('access_requests', {
  id: serial('id').primaryKey(),
  requester_id: integer('requester_id').notNull(),
  table_id: integer('table_id').notNull(),
  project_id: integer('project_id').notNull(),
  access_level: accessLevelEnum('access_level').notNull(),
  reason: text('reason').notNull(),
  duration_days: integer('duration_days').notNull(),
  status: requestStatusEnum('status').notNull().default('pending'),
  approved_by: integer('approved_by'),
  approved_at: timestamp('approved_at'),
  expires_at: timestamp('expires_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Request history table
export const requestHistoryTable = pgTable('request_history', {
  id: serial('id').primaryKey(),
  request_id: integer('request_id').notNull(),
  user_id: integer('user_id').notNull(),
  action_type: actionTypeEnum('action_type').notNull(),
  previous_status: requestStatusEnum('previous_status'),
  new_status: requestStatusEnum('new_status').notNull(),
  comment: text('comment'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// User group memberships table
export const userGroupMembershipsTable = pgTable('user_group_memberships', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  group_id: integer('group_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// User team memberships table
export const userTeamMembershipsTable = pgTable('user_team_memberships', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  team_id: integer('team_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  accessRequests: many(accessRequestsTable, { relationName: 'requester' }),
  approvedRequests: many(accessRequestsTable, { relationName: 'approver' }),
  requestHistory: many(requestHistoryTable),
  groupMemberships: many(userGroupMembershipsTable),
  teamMemberships: many(userTeamMembershipsTable)
}));

export const accessRequestsRelations = relations(accessRequestsTable, ({ one, many }) => ({
  requester: one(usersTable, {
    fields: [accessRequestsTable.requester_id],
    references: [usersTable.id],
    relationName: 'requester'
  }),
  approver: one(usersTable, {
    fields: [accessRequestsTable.approved_by],
    references: [usersTable.id],
    relationName: 'approver'
  }),
  table: one(databaseTablesTable, {
    fields: [accessRequestsTable.table_id],
    references: [databaseTablesTable.id]
  }),
  project: one(projectsTable, {
    fields: [accessRequestsTable.project_id],
    references: [projectsTable.id]
  }),
  history: many(requestHistoryTable)
}));

export const requestHistoryRelations = relations(requestHistoryTable, ({ one }) => ({
  request: one(accessRequestsTable, {
    fields: [requestHistoryTable.request_id],
    references: [accessRequestsTable.id]
  }),
  user: one(usersTable, {
    fields: [requestHistoryTable.user_id],
    references: [usersTable.id]
  })
}));

export const groupsRelations = relations(groupsTable, ({ many }) => ({
  memberships: many(userGroupMembershipsTable)
}));

export const teamsRelations = relations(teamsTable, ({ many }) => ({
  memberships: many(userTeamMembershipsTable)
}));

export const userGroupMembershipsRelations = relations(userGroupMembershipsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userGroupMembershipsTable.user_id],
    references: [usersTable.id]
  }),
  group: one(groupsTable, {
    fields: [userGroupMembershipsTable.group_id],
    references: [groupsTable.id]
  })
}));

export const userTeamMembershipsRelations = relations(userTeamMembershipsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userTeamMembershipsTable.user_id],
    references: [usersTable.id]
  }),
  team: one(teamsTable, {
    fields: [userTeamMembershipsTable.team_id],
    references: [teamsTable.id]
  })
}));

// Export all tables for relation queries
export const tables = {
  users: usersTable,
  groups: groupsTable,
  teams: teamsTable,
  databaseTables: databaseTablesTable,
  projects: projectsTable,
  accessRequests: accessRequestsTable,
  requestHistory: requestHistoryTable,
  userGroupMemberships: userGroupMembershipsTable,
  userTeamMemberships: userTeamMembershipsTable
};
