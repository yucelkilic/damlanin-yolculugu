import './assets/hero-water.js?v=20261022-school-art';
import { waterUses, suitableUseIds, useFeedback, unsuitableUseFeedback } from './assets/water-uses.js?v=20261019-all-uses';
import { t, translateHome } from './assets/home-locale.js?v=20261022-school-art';
translateHome();

const details = [
  ['İlk durak: çatı!', 'Yağmur damlaları çatıya düşer. Çatının eğimi, suyu oluğa doğru taşır.'],
  ['Oluk ve boru suya yol gösterir.', 'Çatının kenarındaki oluk damlaları toplar. Boru, suyu aşağıdaki toplama sistemine taşır.'],
  ['Yapraklar süzgeçte kalır.', 'Süzgeç yaprakları ve iri parçaları tutar. Ancak suyu içilebilir yapmaz; bu suyu içmeyiz.'],
  ['Damlalar kapalı depoda buluşur.', 'Su daha sonra kullanılmak üzere birikir. Depo kapalı tutulur; kapağını ve musluğunu yalnızca görevli yetişkin kullanır.'],
  ['Yeni görev: sulama, sifon ve temizlik!', useFeedback]
];

document.querySelectorAll('[data-step]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-step]').forEach(stop => {
      const selected = stop === button;
      stop.classList.toggle('active', selected);
      stop.setAttribute('aria-pressed', String(selected));
    });
    const [title, copy] = details[Number(button.dataset.step)].map(t);
    const output = document.getElementById('step-detail');
    const strong = document.createElement('strong');
    strong.textContent = title;
    output.replaceChildren(strong, document.createTextNode(' ' + copy));
  });
});

const useList = document.getElementById('water-uses');
for (const use of waterUses) {
  const article = document.createElement('article');
  const visual = document.createElement(use.image ? 'img' : 'span');
  if (use.image) { visual.src = `assets/story/${use.image}.webp`; visual.alt = ''; visual.width = 72; visual.height = 72; }
  else { visual.textContent = use.icon; visual.setAttribute('aria-hidden', 'true'); }
  const heading = document.createElement('h3'); heading.textContent = use.label;
  const copy = document.createElement('p'); copy.textContent = use.copy;
  article.append(visual, heading, copy); useList.append(article);
}

let celebrated = false;
document.querySelectorAll('[data-answer]').forEach(button => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-answer]').forEach(answer => {
      answer.classList.remove('correct', 'wrong');
      answer.setAttribute('aria-pressed', 'false');
    });
    const correct = suitableUseIds.has(button.dataset.answer);
    button.classList.add(correct ? 'correct' : 'wrong');
    button.setAttribute('aria-pressed', 'true');
    document.getElementById('game-feedback').textContent = correct
      ? useFeedback
      : unsuitableUseFeedback;
    if (correct && !celebrated) {
      celebrated = true;
      celebrate();
    }
  });
});

function celebrate() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#f4ca67', '#6fc8df', '#83b8af', '#d88352', '#e2b6ca'];
  for (let i = 0; i < 36; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.setAttribute('aria-hidden', 'true');
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty('--piece', colors[i % colors.length]);
    piece.style.setProperty('--drift', `${Math.random() * 180 - 90}px`);
    piece.style.animationDelay = `${Math.random() * .35}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
}
