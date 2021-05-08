import { PerformanceObserver, performance } from "perf_hooks";
import { Worker, isMainThread, parentPort } from "worker_threads";

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries());
  performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

performance.mark('A');

{
  if (isMainThread) {
    for (const iteration of Array.from({ length: +(process.env.LOOPS ?? "0") || 1 }, (_, index) => index)) {
      performance.mark('C');
      await run();
      performance.mark('D');
      performance.measure(`#${iteration}: C to D`, 'C', 'D');
    }
  } else {
    await import("./prerender.js");
    parentPort.postMessage("Complete");
  }
}

performance.mark('B');
performance.measure(`A to B, main: ${isMainThread}`, 'A', 'B');

async function run() {
  const results = await Promise.all(
    Array.from({ length: +(process.env.WORKERS ?? "1") }, async (_, index) => {
      const worker = new Worker(new URL(import.meta.url).pathname, {
        workerData: index.toString(),
        env: {
          WRITE_FILE: "0"
        }
      });
      return await new Promise((resolve, reject) => {
        worker.on("message", resolve);
        worker.on("error", reject);
        worker.on("exit", (code) => {
          if (code !== 0)
            reject(new Error(`Worker stopped with exit code ${code}`));
        });
      });
    })
  );
  const timeout = Math.random() * 1000;
  console.log({ timeout, results });
  await new Promise(resolve => setTimeout(resolve, timeout));
}
