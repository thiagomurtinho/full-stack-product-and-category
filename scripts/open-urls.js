const { default: open } = require('open');

async function openUrls() {
  console.log('🌐 Opening services in browser...');
  
  const urls = [
    {
      url: 'http://localhost:3000',
      name: 'Frontend (Next.js)'
    },
    {
      url: 'http://localhost:5005/api/docs',
      name: 'API Documentation (Swagger)'
    }
  ];

  for (const { url, name } of urls) {
    try {
      await open(url);
      console.log(`✅ ${name}: ${url}`);
    } catch (error) {
      console.log(`❌ Error opening ${name}: ${error.message}`);
    }
  }

  console.log('\n🎉 Quick Start completed!');
  console.log('\n📱 Available services:');
  console.log('   • Frontend: http://localhost:3000');
  console.log('   • API Docs: http://localhost:5005/api/docs');
  console.log('   • Prisma Studio: http://localhost:5555 (opens automatically)');
  console.log('\n🛑 To stop: npm run stop:all');
}

openUrls().catch(console.error); 