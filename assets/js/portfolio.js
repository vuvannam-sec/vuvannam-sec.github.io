function completedMonthsSince(value, today) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const start = new Date(year, month - 1, day);
  if (start.getFullYear() !== year || start.getMonth() !== month - 1 || start.getDate() !== day || start > today) return null;
  let months = (today.getFullYear() - year) * 12 + today.getMonth() - (month - 1);
  if (today.getDate() < day) months -= 1;
  return months;
}

function formatTenure(months) {
  if (months === 0) return 'Less than a month at NTQ';
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  const pieces = [];
  if (years) pieces.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (remainder) pieces.push(`${remainder} ${remainder === 1 ? 'month' : 'months'}`);
  return `${pieces.join(', ')} at NTQ`;
}

// Fixed, harmless demonstration. It changes text only inside an opaque-origin sandbox.
const DEMO_PAYLOAD = `<img src="data:," onerror="document.getElementById('state').textContent='Code ran'">`;
const TRACE_LABELS = ['Next: the conversation', 'Next: the browser', 'Restart the trace'];

function buildDemoDocument(mode) {
  const useHtml = mode === 'unsafe';
  const payloadJson = JSON.stringify(DEMO_PAYLOAD).replace(/</g, '\\u003c');
  const insertion = useHtml ? 'output.innerHTML = payload;' : 'output.textContent = payload;';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'">
<style>
*{box-sizing:border-box}body{margin:0;padding:15px 18px;background:#f4f6f9;color:#233449;font-family:system-ui,sans-serif;font-size:13px;line-height:1.45}
.result{display:inline-flex;padding:4px 8px;border:1px solid ${useHtml ? '#bc715a' : '#7a9b6b'};background:${useHtml ? '#ffe4d8' : '#deebd5'};color:${useHtml ? '#7a2b16' : '#2c5222'};font-weight:700;font-size:13px}
p{margin:8px 0;font-size:12px;color:#4a5d73}pre{margin:0;font:10px/1.4 ui-monospace,monospace;white-space:pre-wrap;overflow-wrap:anywhere;max-height:47px;overflow:auto}img{width:1px;height:1px;opacity:0}
</style></head><body><div id="state" class="result">${useHtml ? 'Waiting for image event' : 'No code executed'}</div><p>${useHtml ? 'The HTML event handler can run here.' : 'The same input is displayed as text.'}</p><pre id="output"></pre><script>
const payload = ${payloadJson};
const output = document.getElementById('output');
${insertion}
</script></body></html>`;
}

if (typeof document !== 'undefined') {
  const tenure = document.querySelector('[data-start-date]');
  if (tenure) {
    const months = completedMonthsSince(tenure.dataset.startDate, new Date());
    if (months !== null) {
      tenure.textContent = formatTenure(months);
      tenure.hidden = false;
    }
  }
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  const stops = Array.from(document.querySelectorAll('[data-trace]'));
  const panels = Array.from(document.querySelectorAll('[data-panel]'));
  const next = document.querySelector('#trace-next');
  const announcement = document.querySelector('#trace-announcement');
  let traceStep = 0;

  function showStep(index) {
    if (index < 0 || index >= panels.length) return;
    traceStep = index;
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    stops.forEach((stop, i) => {
      if (i === index) stop.setAttribute('aria-current', 'step');
      else stop.removeAttribute('aria-current');
    });
    if (announcement) announcement.textContent = `Step ${index + 1} of ${panels.length}`;
    if (next) {
      next.replaceChildren(document.createTextNode(`${TRACE_LABELS[index]} `));
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';
      next.append(arrow);
    }
  }
  stops.forEach(stop => stop.addEventListener('click', () => showStep(Number(stop.dataset.trace))));
  if (next) next.addEventListener('click', () => showStep((traceStep + 1) % panels.length));

  const run = document.querySelector('#run-demo');
  const frame = document.querySelector('#demo-frame');
  const placeholder = document.querySelector('#demo-placeholder');
  const modeButtons = Array.from(document.querySelectorAll('[data-render]'));
  let rendering = 'unsafe';
  let hasRun = false;
  function renderDemo() {
    if (!frame) return;
    frame.srcdoc = buildDemoDocument(rendering);
    frame.hidden = false;
    if (placeholder) placeholder.hidden = true;
  }
  if (run) run.addEventListener('click', () => { hasRun = true; renderDemo(); });
  modeButtons.forEach(button => button.addEventListener('click', () => {
    rendering = button.dataset.render === 'text' ? 'text' : 'unsafe';
    modeButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    if (hasRun) renderDemo();
  }));
}

if (typeof module !== 'undefined') {
  module.exports = { completedMonthsSince, formatTenure, buildDemoDocument, DEMO_PAYLOAD, TRACE_LABELS };
}
