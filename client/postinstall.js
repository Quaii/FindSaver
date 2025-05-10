// This script ensures the correct platform-specific esbuild package is installed
const { execSync } = require('child_process');
const os = require('os');

try {
  // Try to require esbuild to see if it's already installed correctly
  require.resolve('esbuild');
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
  
  try {
    console.log(`📦 Installing ${esbuildPackage}...`);
    execSync(`npm install ${esbuildPackage} --no-save`, { stdio: 'inherit' });
    console.log('✅ Platform-specific esbuild package installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install platform-specific esbuild package:', installError.message);
    process.exit(1);
  }
}