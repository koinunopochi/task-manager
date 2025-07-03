import { RedmineClient } from '../lib/redmine-client.js';
import { loadConfig } from '../lib/config.js';

const config = loadConfig();
const client = new RedmineClient(config);

export const metadataTools = {
  'redmine_tracker_list': {
    description: 'List all available trackers in Redmine',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    handler: async () => {
      try {
        const trackers = await client.getTrackers();
        
        const trackerList = trackers.map(t => 
          `• ${t.name} (ID: ${t.id})`
        ).join('\n');

        return {
          content: [{
            type: 'text',
            text: `Available Trackers:\n${trackerList}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error listing trackers: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  },

  'redmine_status_list': {
    description: 'List all available issue statuses in Redmine',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    handler: async () => {
      try {
        const statuses = await client.getStatuses();
        
        const statusList = statuses.map(s => 
          `• ${s.name} (ID: ${s.id})`
        ).join('\n');

        return {
          content: [{
            type: 'text',
            text: `Available Issue Statuses:\n${statusList}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error listing statuses: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  },

  'redmine_priority_list': {
    description: 'List all available issue priorities in Redmine',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    handler: async () => {
      try {
        const priorities = await client.getPriorities();
        
        const priorityList = priorities.map(p => 
          `• ${p.name} (ID: ${p.id})`
        ).join('\n');

        return {
          content: [{
            type: 'text',
            text: `Available Issue Priorities:\n${priorityList}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error listing priorities: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  },

  'redmine_user_list': {
    description: 'List users in Redmine',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of users to return (default: 100)'
        }
      }
    },
    handler: async (args: { limit?: number }) => {
      try {
        const users = await client.getUsers(args.limit);
        
        const userList = users.map(u => 
          `• ${u.firstname} ${u.lastname} (${u.login}) - ID: ${u.id}`
        ).join('\n');

        return {
          content: [{
            type: 'text',
            text: `Found ${users.length} users:\n${userList}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error listing users: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  },

  'redmine_current_user': {
    description: 'Get information about the current Redmine user',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    handler: async () => {
      try {
        const user = await client.getCurrentUser();
        
        return {
          content: [{
            type: 'text',
            text: `Current User:
• Name: ${user.firstname} ${user.lastname}
• Login: ${user.login}
• Email: ${user.mail}
• ID: ${user.id}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error getting current user: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  }
};