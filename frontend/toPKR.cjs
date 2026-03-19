const fs = require('fs');
const path = require('path');

const dirs = [
  'd:/Hafiz Tahir T/inventory-management-system/frontend/src/pages',
  'd:/Hafiz Tahir T/inventory-management-system/frontend/src/components'
];

function walk(directory) {
  let results = [];
  if (!fs.existsSync(directory)) return results;
  const list = fs.readdirSync(directory);
  list.forEach(file => {
    file = path.join(directory, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

dirs.forEach(dir => {
  const files = walk(dir);
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace standalone $ in JSX with Rs.
    // E.g. ${Number(...)} remains mostly logic, but visible text like "${" or "$" changes.
    // Actually, in React template literals we use `$` for variables. So we must ONLY replace \$ or \${ inside HTML text, BUT NOT inside JS template string `${}`.
    
    // Safer regex: look for ' $' or '>$' or '=$' and replace
    // Better yet, in JSX, I wrote ${Number(p.price).toFixed(2)}. This is inside JSX text node: `>${Number...}` NO wait, I wrote `td>${Number...}` NO, I wrote `td>${`... Wait!
    // In React: <td>${Number(product.price).toFixed(2)}</td>.
    // The first `$` is literal text. The second `{` opens JS eval.
    // So \$\{ is literally "$ followed by {" -> I can replace "${\Number" with "Rs. {Number"
    // Let's replace "${\Number(" with "Rs. {Number("
    
    content = content.replace(/\$\{Number/g, 'Rs. {Number');
    content = content.replace(/\$\{item/g, 'Rs. {item');
    content = content.replace(/\$\{totalAmount/g, 'Rs. {totalAmount');
    content = content.replace(/\$\{(formData\.quantity/g, 'Rs. {(formData.quantity');
    content = content.replace(/\$\{stat\.value/g, 'Rs. {stat.value');
    content = content.replace(/\$\{p\./g, 'Rs. {p.');
    
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log("Updated Currency for: " + file);
    }
  });
});
