const { fork } = require('child_process');
const path = require('path');

function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`\n======================================================`);
    console.log(`[Master Seeder] Launching child process: ${path.basename(scriptPath)}`);
    console.log(`======================================================\n`);
    
    const cp = fork(scriptPath, [], { stdio: 'inherit' });
    
    cp.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${path.basename(scriptPath)} exited with code ${code}`));
      }
    });
  });
}

async function runAll() {
  try {
    const seedersDir = __dirname;
    
    // 1. Run CSV Seeder (Truncates table, seeds bulk items with strict isolation)
    await runScript(path.join(seedersDir, 'csv-seeder.js'));
    
    // 2. Run Deals and New Arrivals Seeder
    await runScript(path.join(seedersDir, 'seed_deals_and_new.js'));
    
    // 3. Run Brand Fillers Seeder
    await runScript(path.join(seedersDir, 'seed_brand_fillers.js'));
    
    console.log(`\n======================================================`);
    console.log(`[Master Seeder] ALL SEEDERS COMPLETED SUCCESSFULLY!`);
    console.log(`======================================================\n`);
    process.exit(0);
  } catch (err) {
    console.error(`\n[Master Seeder] Execution failed:`, err.message);
    process.exit(1);
  }
}

runAll();
