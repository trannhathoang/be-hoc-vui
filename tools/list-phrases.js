// In ra (JSON) mọi câu mà game có thể đọc, lấy trực tiếp từ js/games.js.
// Dùng bởi tools/make-voice.py.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const ctx = vm.createContext({ Math });
for (const f of ['js/art.js', 'js/games.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
}
process.stdout.write(JSON.stringify(vm.runInContext('Games.phrases()', ctx), null, 2));
