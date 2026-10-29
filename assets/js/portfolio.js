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

const methods = {
  understand: {
    kicker: 'Start with the system',
    title: 'Know what you’re protecting.',
    description: 'Map the application, its inputs and trust boundaries before jumping to conclusions.',
    signature: 'Context creates better questions.'
  },
  investigate: {
    kicker: 'Follow the evidence',
    title: 'Test how things really behave.',
    description: 'Use hands-on testing, source review and reproducible proof to understand a potential issue.',
    signature: 'A useful finding tells a clear story.'
  },
  automate: {
    kicker: 'Make the repeatable easier',
    title: 'Give good workflows a boost.',
    description: 'Explore scripts and AI-assisted tools that reduce repetitive work and leave more room for thinking.',
    signature: 'Automation should make work clearer.'
  },
  verify: {
    kicker: 'Keep the human in the loop',
    title: 'Check the result, not just the output.',
    description: 'Treat tool and model outputs as hypotheses. Check evidence, limitations and real-world context.',
    signature: 'Confidence is earned through verification.'
  }
};

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

  const tabs = Array.from(document.querySelectorAll('[data-method]'));
  const panel = document.querySelector('#method-panel');
  function selectMethod(tab) {
    const value = methods[tab.dataset.method];
    if (!value || !panel) return;
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    document.querySelector('#method-kicker').textContent = value.kicker;
    document.querySelector('#method-title').textContent = value.title;
    document.querySelector('#method-description').textContent = value.description;
    document.querySelector('#method-signature').textContent = value.signature;
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectMethod(tab));
    tab.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      selectMethod(tabs[next]);
    });
  });
}
if (typeof module !== 'undefined') module.exports = { completedMonthsSince, formatTenure, methods };
