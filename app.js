import { t, translateHome } from './assets/home-locale.js';
translateHome();

const details = [
  ['İlk durak: çatı!', 'Yağmur damlaları çatıya düşer. Çatının eğimi, suyu oluğa doğru taşır.'],
  ['Oluk ve boru suya yol gösterir.', 'Çatının kenarındaki oluk damlaları toplar. Boru, suyu aşağıdaki toplama sistemine taşır.'],
  ['Yapraklar süzgeçte kalır.', 'Süzgeç yaprakları ve iri parçaları tutar. Ancak suyu içilebilir yapmaz; bu suyu içmeyiz.'],
  ['Damlalar kapalı depoda buluşur.', 'Su daha sonra kullanılmak üzere birikir. Depo kapalı tutulur; kapağını ve musluğunu yalnızca görevli yetişkin kullanır.'],
  ['Yeni görev: çiçeklere su olmak!', 'Görevli yetişkin, biriken suyu çiçekleri ve süs bitkilerini sulamak için kullanabilir. Böylece bu iş için daha az şebeke suyu gerekir.']
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

let celebrated = false;
document.querySelectorAll('[data-answer]').forEach(button => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-answer]').forEach(answer => {
      answer.classList.remove('correct', 'wrong');
      answer.setAttribute('aria-pressed', 'false');
    });
    const correct = button.dataset.answer === 'flowers';
    button.classList.add(correct ? 'correct' : 'wrong');
    button.setAttribute('aria-pressed', 'true');
    document.getElementById('game-feedback').textContent = correct
      ? t('Harika! Çiçekleri görevli yetişkin sulayabilir. Damla’ya yeni bir görev buldun! 🌼')
      : t('Bir kez daha düşünelim! Bu suyu içmeyiz ve el yıkamada kullanmayız. Süzgeç, suyu içilebilir yapmaz.');
    if (correct && !celebrated) {
      celebrated = true;
      celebrate();
    }
  });
});

const missions = [
  ['🪥', 'Fırçala, musluğu kapat!', 'Dişlerini fırçalarken musluğu kapat. Suyu yalnızca ihtiyacın olduğunda aç.'],
  ['🔎', 'Bir damlanın izini sür!', 'Damlayan bir musluk fark edersen öğretmenine veya ailene haber ver. Küçük bir gözlem güzel bir başlangıçtır.'],
  ['✎', 'Fikrini bir afişe dönüştür!', 'Suyu korumak için bir öneri düşün. Önerini çiz ve sınıf arkadaşlarınla paylaş.'],
  ['🌼', 'Sulama zamanını konuş!', 'Bitkilerin ne zaman ve ne kadar suya ihtiyaç duyduğunu bir yetişkinle birlikte araştır.'],
  ['💬', 'Öğrendiğini paylaş!', 'Yağmur suyunun çatıdan bahçeye yolunu bugün evde birine anlat. Bakalım beş durağı da hatırlayacak mısın?']
];
let mission = 0;
const missionCard = document.querySelector('.mission-card');
missionCard.setAttribute('aria-live', 'polite');
document.getElementById('next-mission').addEventListener('click', () => {
  mission = (mission + 1) % missions.length;
  const [icon, title, copy] = missions[mission];
  document.getElementById('mission-icon').textContent = icon;
  document.getElementById('mission-title').textContent = t(title);
  document.getElementById('mission-copy').textContent = t(copy);
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
