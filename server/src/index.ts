
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createUserInputSchema,
  createGroupInputSchema,
  createTeamInputSchema,
  createDatabaseTableInputSchema,
  createProjectInputSchema,
  createAccessRequestInputSchema,
  updateAccessRequestInputSchema
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { getUsers } from './handlers/get_users';
import { createGroup } from './handlers/create_group';
import { getGroups } from './handlers/get_groups';
import { createTeam } from './handlers/create_team';
import { getTeams } from './handlers/get_teams';
import { createDatabaseTable } from './handlers/create_database_table';
import { getDatabaseTables } from './handlers/get_database_tables';
import { createProject } from './handlers/create_project';
import { getProjects } from './handlers/get_projects';
import { createAccessRequest } from './handlers/create_access_request';
import { getAccessRequests } from './handlers/get_access_requests';
import { updateAccessRequest } from './handlers/update_access_request';
import { getRequestHistory } from './handlers/get_request_history';
import { addUserToGroup } from './handlers/add_user_to_group';
import { addUserToTeam } from './handlers/add_user_to_team';
import { getUserRequests } from './handlers/get_user_requests';
import { getPendingRequests } from './handlers/get_pending_requests';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
  getUsers: publicProcedure
    .query(() => getUsers()),

  // Group management
  createGroup: publicProcedure
    .input(createGroupInputSchema)
    .mutation(({ input }) => createGroup(input)),
  getGroups: publicProcedure
    .query(() => getGroups()),

  // Team management
  createTeam: publicProcedure
    .input(createTeamInputSchema)
    .mutation(({ input }) => createTeam(input)),
  getTeams: publicProcedure
    .query(() => getTeams()),

  // Database table management
  createDatabaseTable: publicProcedure
    .input(createDatabaseTableInputSchema)
    .mutation(({ input }) => createDatabaseTable(input)),
  getDatabaseTables: publicProcedure
    .query(() => getDatabaseTables()),

  // Project management
  createProject: publicProcedure
    .input(createProjectInputSchema)
    .mutation(({ input }) => createProject(input)),
  getProjects: publicProcedure
    .query(() => getProjects()),

  // Access request management
  createAccessRequest: publicProcedure
    .input(createAccessRequestInputSchema)
    .mutation(({ input }) => createAccessRequest(input)),
  getAccessRequests: publicProcedure
    .query(() => getAccessRequests()),
  updateAccessRequest: publicProcedure
    .input(updateAccessRequestInputSchema)
    .mutation(({ input }) => updateAccessRequest(input)),
  
  // Request history
  getRequestHistory: publicProcedure
    .input(z.object({ requestId: z.number() }))
    .query(({ input }) => getRequestHistory(input.requestId)),

  // User and group/team associations
  addUserToGroup: publicProcedure
    .input(z.object({ userId: z.number(), groupId: z.number() }))
    .mutation(({ input }) => addUserToGroup(input.userId, input.groupId)),
  addUserToTeam: publicProcedure
    .input(z.object({ userId: z.number(), teamId: z.number() }))
    .mutation(({ input }) => addUserToTeam(input.userId, input.teamId)),

  // User-specific requests
  getUserRequests: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getUserRequests(input.userId)),

  // Approver workflows
  getPendingRequests: publicProcedure
    .query(() => getPendingRequests()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
