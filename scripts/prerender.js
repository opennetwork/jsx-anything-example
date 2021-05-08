import "./jsdom.js";
import { promises as fs } from "node:fs";
import { dirname, join } from 'node:path';
import JSDOM from "jsdom";
import { createHook } from "async_hooks";
import { PerformanceObserver, performance } from "perf_hooks";

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries());
  performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

performance.mark('A');


const types = new Map();
let count = 0n;
let resolved = 0n;
createHook({
    init(asyncId, type) {
        count += 1n;
        types.set(type, (types.get(type) || 0n) + 1n);
    },
    promiseResolve(asyncId) {
        resolved += 1n;
    }
}).enable();

{

// Create a new root element
  const root = document.createElement("div");
  root.id = "root";

// No harm in appending our root to the document body
  document.body.append(root);

// This will initialise our sites render
  await import("../build/index.js");

// The bundler does not have top level await support, so we must utilise the global
// the above import sets
  await window.proposalSiteRender;
}

performance.mark('B');
performance.measure('A to B', 'A', 'B');

console.log({ count, resolved, types });

const directory = dirname(new URL(import.meta.url).pathname);

const indexPath = join(directory, "../build/index.html");
const index = await fs.readFile(indexPath, "utf8");

const target = new JSDOM.JSDOM(index);

// Copy over generated templates
const template = document.createElement("template");
const foundTemplates = document.body.querySelectorAll("template[id]");

// Remove any existing versions of the template found
for (const foundTemplate of foundTemplates) {
  const existing = target.window.document.getElementById(foundTemplate.id);
  if (existing) {
    existing.parentElement.removeChild(existing);
  }
  template.content.append(foundTemplate);
}

// Create a template in our target DOM and then copy over using an HTML string
// then append these to the targets body using the target templates DocumentFragment
const targetTemplate = target.window.document.createElement("template");
targetTemplate.innerHTML = template.innerHTML;
target.window.document.body.append(targetTemplate.content);

// Write to disk
if (process.env.WRITE_FILE !== "0") {
  await fs.writeFile(
    indexPath,
    target.serialize()
  )
}

console.log({ count });
