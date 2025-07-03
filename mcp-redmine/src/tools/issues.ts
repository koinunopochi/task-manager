import { RedmineClient } from '../lib/redmine-client.js';
import { loadConfig } from '../lib/config.js';
import { CreateIssueInput, UpdateIssueInput } from '../lib/types.js';

const config = loadConfig();
const client = new RedmineClient(config);

export const issueTools = {
  'redmine_issue_list': {
    description: 'List Redmine issues',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'number',
          description: 'Filter by project ID (optional)'
        },
        status_id: {
          type: 'string',
          description: 'Filter by status ID (optional, use "open" for open issues or "*" for all)'
        },
        assigned_to_id: {
          type: 'number',
          description: 'Filter by assigned user ID (optional)'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of issues to return (default: 25)'
        },
        offset: {
          type: 'number',
          description: 'Offset for pagination (default: 0)'
        }
      }
    },
    handler: async (args: {
      project_id?: number;
      status_id?: string;
      assigned_to_id?: number;
      limit?: number;
      offset?: number;
    }) => {
      try {
        const { issues, total_count } = await client.getIssues({
          ...args,
          limit: args.limit || 25
        });
        
        if (issues.length === 0) {
          return {
            content: [{
              type: 'text',
              text: 'No issues found.'
            }]
          };
        }

        const issueList = issues.map(issue => 
          `#${issue.id} - ${issue.subject}
  Project: ${issue.project.name}
  Status: ${issue.status.name} | Priority: ${issue.priority.name}
  Assigned to: ${issue.assigned_to?.name || 'Unassigned'}
  Progress: ${issue.done_ratio}%`
        ).join('\n\n');

        return {
          content: [{
            type: 'text',
            text: `Found ${total_count} issues (showing ${issues.length}):\n\n${issueList}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error listing issues: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  },

  'redmine_issue_get': {
    description: 'Get details of a specific Redmine issue',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Issue ID'
        }
      },
      required: ['id']
    },
    handler: async (args: { id: number }) => {
      try {
        const issue = await client.getIssue(args.id);
        
        return {
          content: [{
            type: 'text',
            text: `Issue #${issue.id} Details:
• Subject: ${issue.subject}
• Project: ${issue.project.name}
• Tracker: ${issue.tracker.name}
• Status: ${issue.status.name}
• Priority: ${issue.priority.name}
• Author: ${issue.author.name}
• Assigned to: ${issue.assigned_to?.name || 'Unassigned'}
• Progress: ${issue.done_ratio}%
• Created: ${new Date(issue.created_on).toLocaleString()}
• Updated: ${new Date(issue.updated_on).toLocaleString()}
${issue.start_date ? `• Start date: ${issue.start_date}` : ''}
${issue.due_date ? `• Due date: ${issue.due_date}` : ''}
${issue.estimated_hours ? `• Estimated hours: ${issue.estimated_hours}` : ''}
${issue.description ? `\nDescription:\n${issue.description}` : ''}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error getting issue: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  },

  'redmine_issue_create': {
    description: 'Create a new Redmine issue',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'number',
          description: 'Project ID'
        },
        subject: {
          type: 'string',
          description: 'Issue subject/title'
        },
        description: {
          type: 'string',
          description: 'Issue description (optional)'
        },
        tracker_id: {
          type: 'number',
          description: 'Tracker ID (optional, default will be used if not specified)'
        },
        priority_id: {
          type: 'number',
          description: 'Priority ID (optional, default will be used if not specified)'
        },
        status_id: {
          type: 'number',
          description: 'Status ID (optional, default will be used if not specified)'
        },
        assigned_to_id: {
          type: 'number',
          description: 'Assigned user ID (optional)'
        },
        start_date: {
          type: 'string',
          description: 'Start date (YYYY-MM-DD format, optional)'
        },
        due_date: {
          type: 'string',
          description: 'Due date (YYYY-MM-DD format, optional)'
        },
        estimated_hours: {
          type: 'number',
          description: 'Estimated hours (optional)'
        }
      },
      required: ['project_id', 'subject']
    },
    handler: async (args: CreateIssueInput) => {
      try {
        const issue = await client.createIssue(args);
        
        return {
          content: [{
            type: 'text',
            text: `Issue created successfully:
• ID: #${issue.id}
• Subject: ${issue.subject}
• Project: ${issue.project.name}
• Status: ${issue.status.name}
• URL: ${config.url}/issues/${issue.id}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error creating issue: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  },

  'redmine_issue_update': {
    description: 'Update an existing Redmine issue',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Issue ID'
        },
        subject: {
          type: 'string',
          description: 'New subject (optional)'
        },
        description: {
          type: 'string',
          description: 'New description (optional)'
        },
        priority_id: {
          type: 'number',
          description: 'New priority ID (optional)'
        },
        status_id: {
          type: 'number',
          description: 'New status ID (optional)'
        },
        assigned_to_id: {
          type: 'number',
          description: 'New assigned user ID (optional)'
        },
        done_ratio: {
          type: 'number',
          description: 'Progress percentage 0-100 (optional)'
        },
        notes: {
          type: 'string',
          description: 'Notes to add to the issue (optional)'
        }
      },
      required: ['id']
    },
    handler: async (args: { id: number } & UpdateIssueInput) => {
      try {
        const { id, ...updateData } = args;
        await client.updateIssue(id, updateData);
        
        return {
          content: [{
            type: 'text',
            text: `Issue #${id} updated successfully.`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error updating issue: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  },

  'redmine_issue_delete': {
    description: 'Delete a Redmine issue',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Issue ID'
        }
      },
      required: ['id']
    },
    handler: async (args: { id: number }) => {
      try {
        await client.deleteIssue(args.id);
        
        return {
          content: [{
            type: 'text',
            text: `Issue #${args.id} deleted successfully.`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error deleting issue: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  }
};