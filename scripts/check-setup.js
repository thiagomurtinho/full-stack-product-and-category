const fs = require('fs');
const path = require('path');

function checkSetup() {
  console.log('🔍 Checking project setup...');
  
  const checks = [
    {
      name: 'Node.js >= 18',
      check: () => {
        const version = process.version;
        const major = parseInt(version.slice(1).split('.')[0]);
        return major >= 18;
      },
      message: (result) => result ? `✅ Node.js ${process.version}` : `❌ Node.js ${process.version} (requires >= 18)`
    },
    {
      name: 'Docker installed',
      check: () => {
        try {
          require('child_process').execSync('docker --version', { stdio: 'ignore' });
          return true;
        } catch {
          return false;
        }
      },
      message: (result) => result ? '✅ Docker installed' : '❌ Docker not found'
    },
    {
      name: '.env file',
      check: () => {
        const envPath = path.join(__dirname, '../apps/api/.env');
        return fs.existsSync(envPath);
      },
      message: (result) => result ? '✅ .env file configured' : '❌ .env file not found'
    },
    {
      name: 'Dependencies installed',
      check: () => {
        const nodeModulesPath = path.join(__dirname, '../node_modules');
        return fs.existsSync(nodeModulesPath);
      },
      message: (result) => result ? '✅ Dependencies installed' : '❌ Run npm install'
    }
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    const result = check.check();
    console.log(check.message(result));
    if (!result) allPassed = false;
  }
  
  console.log('\n' + (allPassed ? '🎉 Setup verified successfully!' : '⚠️ Some issues found'));
  
  if (!allPassed) {
    console.log('\n💡 To resolve:');
    console.log('   npm install');
    console.log('   npm run setup:env');
  }
  
  return allPassed;
}

if (require.main === module) {
  checkSetup();
}

module.exports = { checkSetup }; 