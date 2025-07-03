import { RedmineClient } from '../lib/redmine-client.js';
import { loadConfig } from '../lib/config.js';
import { CreateProjectInput, UpdateProjectInput } from '../lib/types.js';

const config = loadConfig();
const client = new RedmineClient(config);

export const projectTools = {
  'redmine_project_list': {
    description: 'List all Redmine projects',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of projects to return (default: 100)'
        }
      }
    },
    handler: async (args: { limit?: number }) => {
      try {
        const projects = await client.getProjects(args.limit);
        
        if (projects.length === 0) {
          return {
            content: [{
              type: 'text',
              text: 'No projects found.'
            }]
          };
        }

        const projectList = projects.map(p => 
          `• ${p.name} (${p.identifier}) - ID: ${p.id}${p.description ? `\n  ${p.description}` : ''}`
        ).join('\n\n');

        return {
          content: [{
            type: 'text',
            text: `Found ${projects.length} projects:\n\n${projectList}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error listing projects: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  },

  'redmine_project_get': {
    description: 'Get details of a specific Redmine project',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Project ID or identifier'
        }
      },
      required: ['id']
    },
    handler: async (args: { id: string }) => {
      try {
        const project = await client.getProject(args.id);
        
        return {
          content: [{
            type: 'text',
            text: `Project Details:
• Name: ${project.name}
• Identifier: ${project.identifier}
• ID: ${project.id}
• Description: ${project.description || 'None'}
• Public: ${project.is_public ? 'Yes' : 'No'}
• Status: ${project.status === 1 ? 'Active' : 'Closed'}
• Created: ${new Date(project.created_on).toLocaleString()}
• Updated: ${new Date(project.updated_on).toLocaleString()}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error getting project: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  },

  'redmine_project_create': {
    description: 'Create a new Redmine project',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Project name'
        },
        identifier: {
          type: 'string',
          description: 'Project identifier (unique, lowercase letters, numbers and dashes only)'
        },
        description: {
          type: 'string',
          description: 'Project description (optional)'
        },
        is_public: {
          type: 'boolean',
          description: 'Whether the project is public (default: true)'
        }
      },
      required: ['name', 'identifier']
    },
    handler: async (args: CreateProjectInput) => {
      try {
        const project = await client.createProject({
          ...args,
          is_public: args.is_public !== false
        });
        
        return {
          content: [{
            type: 'text',
            text: `Project created successfully:
• Name: ${project.name}
• Identifier: ${project.identifier}
• ID: ${project.id}
• URL: ${config.url}/projects/${project.identifier}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error creating project: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  },

  'redmine_project_update': {
    description: 'Update an existing Redmine project',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Project ID or identifier'
        },
        name: {
          type: 'string',
          description: 'New project name (optional)'
        },
        description: {
          type: 'string',
          description: 'New project description (optional)'
        },
        is_public: {
          type: 'boolean',
          description: 'Whether the project is public (optional)'
        }
      },
      required: ['id']
    },
    handler: async (args: { id: string } & UpdateProjectInput) => {
      try {
        const { id, ...updateData } = args;
        await client.updateProject(id, updateData);
        
        return {
          content: [{
            type: 'text',
            text: `Project ${id} updated successfully.`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error updating project: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  },

  'redmine_project_delete': {
    description: 'Delete a Redmine project',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Project ID or identifier'
        }
      },
      required: ['id']
    },
    handler: async (args: { id: string }) => {
      try {
        await client.deleteProject(args.id);
        
        return {
          content: [{
            type: 'text',
            text: `Project ${args.id} deleted successfully.`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error deleting project: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  }
};