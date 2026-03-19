const fs = require('fs');
const path = require('path');

const dir = 'd:/Hafiz Tahir T/inventory-management-system/frontend/src';

const preciseReplacements = {
  'bg-amber-800': 'bg-slate-900', // Sidebar background
  'border-amber-700': 'border-slate-800', // Sidebar borders
  'text-amber-200': 'text-slate-400', // Sidebar subtext
  'hover:bg-amber-700': 'hover:bg-slate-800', // Sidebar hover
  'hover:bg-amber-500': 'hover:bg-indigo-500', 
  
  'bg-orange-50': 'bg-slate-50', // App Background (Layout)
  'border-orange-100': 'border-slate-200',
  'text-amber-900': 'text-slate-700', // Table header text
  
  'bg-orange-50/50': 'hover:bg-indigo-50/50', // Hover row
};

function walk(directory) {
  let results = [];
  const list = fs.readdirSync(directory);
  list.forEach(file => {
    file = path.join(directory, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(dir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const [oldVal, newVal] of Object.entries(preciseReplacements)) {
    content = content.split(oldVal).join(newVal);
  }
  
  // Blanket replace remaining warm colors to a sleek indigo professional tone
  content = content.replace(/amber-/g, 'indigo-');
  content = content.replace(/orange-/g, 'slate-');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log("Updated Theme for: " + file);
  }
});
