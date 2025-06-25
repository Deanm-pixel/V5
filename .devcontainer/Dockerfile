FROM mcr.microsoft.com/devcontainers/typescript-node:18

# Install global tools if needed:
RUN npm install -g vite

# For PDF export: system dependencies (optional)
RUN apt-get update && apt-get install -y libfontconfig1
