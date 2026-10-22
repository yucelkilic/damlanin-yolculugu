import { pick } from './locale.js?v=20261019-all-uses';
import { waterUses } from './water-uses.js?v=20261019-all-uses';

const host = document.querySelector('.hero-art');
const image = host.querySelector('.journey-art');
const scene = document.createElement('div');
scene.className = 'water-scene';
image.before(scene);
scene.append(image);
scene.insertAdjacentHTML('beforeend', `<svg class="water-overlay" viewBox="0 0 1374 1145" aria-hidden="true">
  <g data-water-phase="0" class="water-rain"><path d="M320 255l-28 85 M470 290l-28 85 M620 285l-28 85 M760 310l-28 85 M850 360l-28 85"/></g>
  <path data-water-phase="1" class="water-flow" d="M228 431L864 510Q876 512 876 536L876 548Q876 559 891 559Q904 559 904 575L904 592"/>
  <ellipse data-water-phase="2" class="water-focus" cx="901" cy="620" rx="45" ry="39"/>
  <path data-water-phase="3" class="water-fill" d="M760 865H963V724Q860 695 760 724Z"/>
  <path data-water-phase="4" class="water-flow" d="M751 851L698 868L602 893L480 960 M602 893L520 976 M602 893L450 935"/>
  <path data-water-phase="5" class="water-flow" d="M978 861Q997 861 997 842L997 724Q997 704 975 687L975 583Q975 559 994 564L1250 600Q1267 600 1267 622V702 M1137 583V701"/>
  <g data-water-phase="6"><circle class="water-focus" cx="435" cy="830" r="68"/><text x="435" y="850" text-anchor="middle" font-size="75">🪣</text></g>
</svg>`);
const steps = [
  pick(['Yağmur çatıya düşer.','Rain falls on the roof.','La lluvia cae sobre el tejado.']),
  pick(['Oluk ve borular suyu taşır.','Gutters and pipes carry the water.','Los canalones y las tuberías transportan el agua.']),
  pick(['Süzgeç yaprakları tutar; suyu içilebilir yapmaz.','The screen catches leaves; it does not make water safe to drink.','El filtro retiene las hojas; no hace potable el agua.']),
  pick(['Su kapalı depoda birikir.','Water collects in the covered tank.','El agua se acumula en el depósito cerrado.']),
  ...waterUses.map(use => `${use.label} · ${use.copy}`)
];
const controls = document.createElement('div');
controls.className = 'water-story';
const count = document.createElement('span');
count.className = 'water-count';
const caption = document.createElement('p');
caption.id = 'water-caption';
const pause = document.createElement('button');
const next = document.createElement('button');
next.textContent = '→';
next.setAttribute('aria-label', pick(['Sonraki adım','Next step','Paso siguiente']));
controls.append(count, caption, pause, next);
host.append(controls);
const safety = document.createElement('p');
safety.className = 'water-safety';
safety.textContent = pick(['Temsili sistem · Bu su içilmez. Sistemi görevli yetişkinler kullanır.','Illustrative system · Do not drink this water. Responsible adults operate the system.','Sistema ilustrativo · Esta agua no se bebe. Los adultos responsables utilizan el sistema.']);
host.append(safety);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reducedMotion.matches;
let step = 0;
let timer;
function render() {
  scene.querySelectorAll('[data-water-phase]').forEach(el => el.classList.toggle('is-active', Number(el.dataset.waterPhase) === step));
  count.textContent = `${String(step + 1).padStart(2, '0')} / 07`;
  caption.textContent = steps[step];
  scene.classList.toggle('is-paused', paused);
  pause.textContent = paused ? '▶' : 'Ⅱ';
  pause.setAttribute('aria-label', paused ? pick(['Animasyonu oynat','Play animation','Reproducir animación']) : pick(['Animasyonu duraklat','Pause animation','Pausar animación']));
}
function schedule() {
  clearInterval(timer);
  if (!paused && !document.hidden) timer = setInterval(() => { step = (step + 1) % steps.length; render(); }, 4800);
}
pause.addEventListener('click', () => { paused = !paused; render(); schedule(); });
next.addEventListener('click', () => { paused = true; step = (step + 1) % steps.length; render(); schedule(); });
reducedMotion.addEventListener('change', event => { paused = event.matches; render(); schedule(); });
document.addEventListener('visibilitychange', schedule);
render();
schedule();
