#!/usr/bin/env node
{
  "name": "automation-mcp",
  "version": "1.0.0",
  "description": "MCP Server para automação com n8n e outras ferramentas",
  "type": "module",
  "main": "server.js",
  "bin": {
    "automation-mcp": "./server.js"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "keywords": ["mcp", "automation", "n8n", "workflow", "claude"],
  "author": "Seu Nome",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.4.0"
  }
}
