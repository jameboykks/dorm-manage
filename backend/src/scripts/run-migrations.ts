
import umzug from '../config/umzug.config';

async function runMigrations() {
  try {
    await umzug.up();
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations(); 