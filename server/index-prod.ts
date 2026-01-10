import 'dotenv/config'; // Load .env file FIRST

import fs from "node:fs";
import path from "node:path";
import { type Server } from "node:http";

import express, { type Express } from "express";
import runApp from "./app";

export async function serveStatic(app: Express, _server: Server) {
  // When bundled, dist/index.js runs from dist/ directory
  // Vite builds to dist/public/, so resolve relative to dist/
  // Try resolving from current working directory first (most reliable)
  const cwd = process.cwd();
  const distPathFromRoot = path.resolve(cwd, "dist", "public");
  
  // Also try from import.meta.dirname (where the bundled file is located)
  const currentFileDir = import.meta.dirname;
  const distPathFromFile = currentFileDir ? path.resolve(currentFileDir, "public") : null;
  
  // Determine which path exists
  let distPath: string;
  if (fs.existsSync(distPathFromRoot)) {
    distPath = distPathFromRoot;
  } else if (distPathFromFile && fs.existsSync(distPathFromFile)) {
    distPath = distPathFromFile;
  } else {
    // Log diagnostic information before failing
    console.error(`❌ Could not find build directory.`);
    console.error(`   Tried: ${distPathFromRoot}`);
    if (distPathFromFile) console.error(`   Also tried: ${distPathFromFile}`);
    console.error(`   Current working directory: ${cwd}`);
    console.error(`   import.meta.dirname: ${currentFileDir || 'undefined'}`);
    
    // List what's in dist/ if it exists
    const distDir = path.resolve(cwd, "dist");
    if (fs.existsSync(distDir)) {
      console.error(`   Contents of dist/:`, fs.readdirSync(distDir));
    } else {
      console.error(`   dist/ directory does not exist`);
    }
    
    throw new Error(
      `Could not find the build directory at ${distPathFromRoot}. Make sure to run 'npm run build' first.`
    );
  }

  console.log(`✅ Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (!fs.existsSync(indexPath)) {
      console.error(`❌ index.html not found at: ${indexPath}`);
      return res.status(500).send("Internal Server Error: index.html not found. Build may be incomplete.");
    }
    res.sendFile(indexPath);
  });
}

(async () => {
  await runApp(serveStatic);
})();
