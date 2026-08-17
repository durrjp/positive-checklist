const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const DURATION_SECONDS = 0.12;
const FREQUENCY = 880;
const numSamples = Math.floor(SAMPLE_RATE * DURATION_SECONDS);

const samples = new Int16Array(numSamples);
for (let i = 0; i < numSamples; i++) {
  const t = i / SAMPLE_RATE;
  const envelope = Math.exp(-t * 30);
  samples[i] = Math.round(Math.sin(2 * Math.PI * FREQUENCY * t) * envelope * 32767);
}

const dataSize = samples.length * 2;
const buffer = Buffer.alloc(44 + dataSize);

buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(1, 22);
buffer.writeUInt32LE(SAMPLE_RATE, 24);
buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

for (let i = 0; i < samples.length; i++) {
  buffer.writeInt16LE(samples[i], 44 + i * 2);
}

const outDir = path.join(__dirname, '..', 'assets', 'sounds');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'tap.wav'), buffer);
console.log('Wrote', path.join(outDir, 'tap.wav'));
