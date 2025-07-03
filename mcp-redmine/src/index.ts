#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { projectTools } from './tools/projects.js';
import { issueTools } from './tools/issues.js';
import { metadataTools } from './tools/metadata.js';
import { wikiTools } from './tools/wiki.js';

// Combine all tools
const allTools = {
  ...projectTools,
  ...issueTools,
  ...metadataTools,
  ...wikiTools
};

const server = new Server(
  {
    name: 'mcp-redmine',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name in allTools) {
    const tool = allTools[name as keyof typeof allTools];
    return await tool.handler(args as any);
  }
  
  throw new Error(`Unknown tool: ${name}`);
});

// Handle tools/list request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.entries(allTools).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Redmine Server started');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});