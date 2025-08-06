const fs = require('fs');
const path = require('path');

function setupEnvironment() {
  console.log('🔧 Setting up environment variables...');
  
  const apiEnvPath = path.join(__dirname, '../apps/api/.env');
  const apiEnvExamplePath = path.join(__dirname, '../apps/api/env.example');
  
  // Check if .env already exists
  if (fs.existsSync(apiEnvPath)) {
    console.log('✅ .env file already exists in apps/api/.env');
    return;
  }
  
  // Check if env.example exists
  if (!fs.existsSync(apiEnvExamplePath)) {
    console.log('❌ env.example file not found in apps/api/env.example');
    console.log('📝 Creating .env file with default settings...');
    
    const defaultEnvContent = `# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fullstack_product_and_category"

# API Configuration
PORT=5005
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
`;
    
    fs.writeFileSync(apiEnvPath, defaultEnvContent);
    console.log('✅ .env file created with default settings');
  } else {
    // Copy env.example to .env
    console.log('📝 Copying env.example to .env...');
    const envExampleContent = fs.readFileSync(apiEnvExamplePath, 'utf8');
    fs.writeFileSync(apiEnvPath, envExampleContent);
    console.log('✅ .env file created from env.example');
  }
  
  console.log('🎉 Environment setup completed!');
}

setupEnvironment(); 