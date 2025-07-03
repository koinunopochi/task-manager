import { RedmineClient } from '../lib/redmine-client.js';
import { loadConfig } from '../lib/config.js';

const config = loadConfig();
const client = new RedmineClient(config);

export const wikiTools = {
  'redmine_wiki_list': {
    description: 'List wiki pages in a project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'Project ID or identifier'
        }
      },
      required: ['project_id']
    },
    handler: async (args: { project_id: string }) => {
      try {
        const pages = await client.getWikiPages(args.project_id);
        
        if (!pages || pages.length === 0) {
          return {
            content: [{
              type: 'text',
              text: 'No wiki pages found in this project.'
            }]
          };
        }

        const pageList = pages.map(p => 
          `• ${p.title}${p.version ? ` (v${p.version})` : ''}${p.created_on ? `\n  Created: ${new Date(p.created_on).toLocaleDateString()}` : ''}`
        ).join('\n\n');

        return {
          content: [{
            type: 'text',
            text: `Found ${pages.length} wiki pages:\n\n${pageList}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error listing wiki pages: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  },

  'redmine_wiki_get': {
    description: 'Get a specific wiki page content',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'Project ID or identifier'
        },
        page_title: {
          type: 'string',
          description: 'Wiki page title'
        },
        version: {
          type: 'number',
          description: 'Specific version number (optional)'
        }
      },
      required: ['project_id', 'page_title']
    },
    handler: async (args: { project_id: string; page_title: string; version?: number }) => {
      try {
        const page = await client.getWikiPage(args.project_id, args.page_title, args.version);
        
        return {
          content: [{
            type: 'text',
            text: `Wiki Page: ${page.title}
Version: ${page.version}
Author: ${page.author?.name || 'Unknown'}
Created: ${new Date(page.created_on).toLocaleString()}
Updated: ${new Date(page.updated_on).toLocaleString()}

Content:
${page.text || '(Empty page)'}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error getting wiki page: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  },

  'redmine_wiki_create': {
    description: 'Create or update a wiki page',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'Project ID or identifier'
        },
        page_title: {
          type: 'string',
          description: 'Wiki page title'
        },
        text: {
          type: 'string',
          description: 'Wiki page content (Markdown or Textile)'
        },
        comments: {
          type: 'string',
          description: 'Comments about this update (optional)'
        }
      },
      required: ['project_id', 'page_title', 'text']
    },
    handler: async (args: { project_id: string; page_title: string; text: string; comments?: string }) => {
      try {
        await client.createOrUpdateWikiPage(
          args.project_id,
          args.page_title,
          {
            text: args.text,
            comments: args.comments
          }
        );
        
        return {
          content: [{
            type: 'text',
            text: `Wiki page "${args.page_title}" created/updated successfully.
URL: ${config.url}/projects/${args.project_id}/wiki/${encodeURIComponent(args.page_title)}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error creating/updating wiki page: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  },

  'redmine_wiki_delete': {
    description: 'Delete a wiki page',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'Project ID or identifier'
        },
        page_title: {
          type: 'string',
          description: 'Wiki page title to delete'
        }
      },
      required: ['project_id', 'page_title']
    },
    handler: async (args: { project_id: string; page_title: string }) => {
      try {
        await client.deleteWikiPage(args.project_id, args.page_title);
        
        return {
          content: [{
            type: 'text',
            text: `Wiki page "${args.page_title}" deleted successfully.`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error deleting wiki page: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  }
};