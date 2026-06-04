import { readFileSync } from 'fs';

const logPath = 'C:\\Users\\UMAIR\\.gemini\\antigravity\\brain\\8e85c84b-7c50-415b-a727-a3f6a593531a\\.system_generated\\logs\\transcript.jsonl';

try {
  const content = readFileSync(logPath, 'utf-8');
  const lines = content.split('\n').filter(Boolean);
  
  for (const line of lines) {
    const step = JSON.parse(line);
    // Find final responses or search results
    if (step.source === 'MODEL' && step.content) {
      console.log('--- MODEL MESSAGE ---');
      console.log(step.content);
    }
  }
} catch (err) {
  console.error('Error reading log:', err);
}
