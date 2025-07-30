
import { z } from 'zod';

// Enums
export const accessLevelEnum = z.enum(['read', 'write', 'apply', 'manage', 'elect']);
export const requestStatusEnum = z.enum(['pending', 'approved', 'denied', 'modified', 'expired']);
export const actionTypeEnum = z.enum(['submitted', 'approved', 'denied', 'modified', 'expired', 'reviewed']);
export const userRoleEnum = z.enum(['user', 'approver', 'admin']);

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  role: userRoleEnum,
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Group schema
export const groupSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Group = z.infer<typeof groupSchema>;

// Team schema
export const teamSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Team = z.infer<typeof teamSchema>;

// Database table schema
export const databaseTableSchema = z.object({
  id: z.number(),
  name: z.string(),
  schema_name: z.string(),
  description: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type DatabaseTable = z.infer<typeof databaseTableSchema>;

// Project schema
export const projectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Project = z.infer<typeof projectSchema>;

// Access request schema
export const accessRequestSchema = z.object({
  id: z.number(),
  requester_id: z.number(),
  table_id: z.number(),
  project_id: z.number(),
  access_level: accessLevelEnum,
  reason: z.string(),
  duration_days: z.number().int().positive(),
  status: requestStatusEnum,
  approved_by: z.number().nullable(),
  approved_at: z.coerce.date().nullable(),
  expires_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type AccessRequest = z.infer<typeof accessRequestSchema>;

// Request history schema
export const requestHistorySchema = z.object({
  id: z.number(),
  request_id: z.number(),
  user_id: z.number(),
  action_type: actionTypeEnum,
  previous_status: requestStatusEnum.nullable(),
  new_status: requestStatusEnum,
  comment: z.string().nullable(),
  created_at: z.coerce.date()
});

export type RequestHistory = z.infer<typeof requestHistorySchema>;

// Input schemas for creating entities
export const createUserInputSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  role: userRoleEnum.default('user'),
  is_active: z.boolean().default(true)
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createGroupInputSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional()
});

export type CreateGroupInput = z.infer<typeof createGroupInputSchema>;

export const createTeamInputSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional()
});

export type CreateTeamInput = z.infer<typeof createTeamInputSchema>;

export const createDatabaseTableInputSchema = z.object({
  name: z.string(),
  schema_name: z.string(),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true)
});

export type CreateDatabaseTableInput = z.infer<typeof createDatabaseTableInputSchema>;

export const createProjectInputSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true)
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export const createAccessRequestInputSchema = z.object({
  requester_id: z.number(),
  table_id: z.number(),
  project_id: z.number(),
  access_level: accessLevelEnum,
  reason: z.string(),
  duration_days: z.number().int().positive()
});

export type CreateAccessRequestInput = z.infer<typeof createAccessRequestInputSchema>;

export const updateAccessRequestInputSchema = z.object({
  id: z.number(),
  status: requestStatusEnum,
  approved_by: z.number().optional(),
  comment: z.string().nullable().optional()
});

export type UpdateAccessRequestInput = z.infer<typeof updateAccessRequestInputSchema>;

// User group membership schema
export const userGroupMembershipSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  group_id: z.number(),
  created_at: z.coerce.date()
});

export type UserGroupMembership = z.infer<typeof userGroupMembershipSchema>;

// User team membership schema
export const userTeamMembershipSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  team_id: z.number(),
  created_at: z.coerce.date()
});

export type UserTeamMembership = z.infer<typeof userTeamMembershipSchema>;
