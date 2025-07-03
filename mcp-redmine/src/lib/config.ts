import { RedmineConfig } from './types.js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export function loadConfig(): RedmineConfig {
  // Environment variables have highest priority
  if (process.env.REDMINE_URL && process.env.REDMINE_API_KEY) {
    return {
      url: process.env.REDMINE_URL,
      apiKey: process.env.REDMINE_API_KEY,
    };
  }

  // Check for config file in home directory
  const configPath = join(homedir(), '.mcp-redmine.json');
  if (existsSync(configPath)) {
    try {
      const configData = readFileSync(configPath, 'utf-8');
      return JSON.parse(configData);
    } catch (error) {
      console.error('Error reading config file:', error);
    }
  }

  // Check for local config file
  const localConfigPath = '.mcp-redmine.json';
  if (existsSync(localConfigPath)) {
    try {
      const configData = readFileSync(localConfigPath, 'utf-8');
      return JSON.parse(configData);
    } catch (error) {
      console.error('Error reading local config file:', error);
    }
  }

  throw new Error(
    'Redmine configuration not found. Please set REDMINE_URL and REDMINE_API_KEY environment variables or create a .mcp-redmine.json config file.'
  );
}