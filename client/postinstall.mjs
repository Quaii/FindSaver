// This script ensures the correct platform-specific esbuild package is installed
import { execSync } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to check if a package is installed
const isPackageInstalled = (packageName) => {
  try {
    // Check in node_modules
    const packagePath = path.join(__dirname, 'node_modules', packageName);
    return fs.existsSync(packagePath);
  } catch (error) {
    return false;
  }
};

try {
  // Try to import esbuild to see if it's already installed correctly
  // Using dynamic import for ES modules
  await import('esbuild');
  console.log('✅ esbuild is already properly installed');
} catch (error) {
  console.log('⚠️ esbuild installation issue detected, installing platform-specific package...');
  
  // Determine platform and architecture
  const platform = os.platform();
  const arch = os.arch();
  
  let esbuildPackage = '';
  
  // Map common platforms and architectures to esbuild packages
  if (platform === 'linux' && arch === 'x64') {
    esbuildPackage = '@esbuild/linux-x64';
  } else if (platform === 'darwin' && arch === 'x64') {
    esbuildPackage = '@esbuild/darwin-x64';
  } else if (platform === 'darwin' && arch === 'arm64') {
    esbuildPackage = '@esbuild/darwin-arm64';
  } else if (platform === 'win32' && arch === 'x64') {
    esbuildPackage = '@esbuild/win32-x64';
  } else {
    console.log(`⚠️ Unsupported platform: ${platform} ${arch}`);
    console.log('⚠️ You may need to manually install the appropriate esbuild package');
    process.exit(1);
  }
  
  // Check if the package is already installed
  if (isPackageInstalled(esbuildPackage)) {
    console.log(`✅ ${esbuildPackage} is already installed`);
  } else {
    try {
      console.log(`📦 Installing ${esbuildPackage}...`);
      execSync(`npm install ${esbuildPackage} --no-save`, { stdio: 'inherit' });
      console.log(`✅ Successfully installed ${esbuildPackage}`);
    } catch (installError) {
      console.error(`❌ Failed to install ${esbuildPackage}:`, installError.message);
      console.log('⚠️ Attempting alternative installation method...');
      try {
        // Try with --force flag as a fallback
        execSync(`npm install ${esbuildPackage} --no-save --force`, { stdio: 'inherit' });
        console.log(`✅ Successfully installed ${esbuildPackage} with force option`);
      } catch (fallbackError) {
        console.error(`❌ All installation attempts failed for ${esbuildPackage}`);
        process.exit(1);
      }
    }
  }
}

// Verify the installation by checking if esbuild works
try {
  console.log('🔍 Verifying esbuild installation...');
  execSync('npx esbuild --version', { stdio: 'inherit' });
  console.log('✅ esbuild verification successful');
} catch (verifyError) {
  console.error('❌ esbuild verification failed:', verifyError.message);
  console.log('⚠️ You may need to manually fix the esbuild installation');
  // Don't exit with error to allow build process to continue
}
