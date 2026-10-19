import { pick, languagePicker, initLocale } from '../assets/locale.js?v=20261019-all-uses';
import { ui } from '../assets/story-content.js?v=20261019-all-uses';
import { mountGame } from '../assets/games.js?v=20261019-all-uses';
const $=id=>document.getElementById(id);
const titles=pick([
  {sequence:'Hasat adımlarını sırala',spot:'Resimdeki hataları bul',quiz:'Damla’nın bilgi testi'},
  {sequence:'Order the harvesting steps',spot:'Spot the mistakes',quiz:'Damla’s knowledge quiz'},
  {sequence:'Ordena las etapas de recogida',spot:'Encuentra los errores',quiz:'El test de Damla'}
]);
document.title=ui.games+' · '+ui.title;
$('language-slot').innerHTML=languagePicker();
$('game-brand').textContent=ui.title;
$('home-link').textContent=ui.home;
$('story-link').textContent=pick(['Sunumumuz','Our presentation','Presentación']);
$('game-kicker').textContent=pick(['DAMLA’NIN GÖREVLERİ','DAMLA’S MISSIONS','LAS MISIONES DE DAMLA']);
$('game-title').textContent=pick(['Oyna, keşfet, suyu koru.','Play, explore, save water.','Juega, explora, cuida el agua.']);
$('game-intro').textContent=pick(['Damla sana üç görev hazırladı. İstediğini seç, kendi hızında keşfet. Yanlış cevaplar da öğrenmenin bir parçası!','Damla has three missions for you. Choose one and explore at your own pace. Mistakes are part of learning too!','Damla te ha preparado tres misiones. Elige una y explora a tu ritmo. ¡Los errores también ayudan a aprender!']);
$('game-safety').textContent=ui.safety+' '+ui.illustration;
$('story-back').textContent='← '+pick(['Önce Damla’nın hikâyesini keşfet','Explore Damla’s story first','Descubre primero la historia de Damla']);
document.querySelector('.game-tabs').setAttribute('aria-label',ui.games);
document.querySelector('meta[name="description"]').content=$('game-intro').textContent;
document.querySelectorAll('[data-game]').forEach(link=>{link.textContent=titles[link.dataset.game];});
initLocale();
function render(){const key=location.hash.slice(1);const type=Object.hasOwn(titles,key)?key:'sequence';document.querySelectorAll('[data-game]').forEach(link=>link.setAttribute('aria-current',String(link.dataset.game===type)));$('game-container').setAttribute('aria-label',titles[type]);mountGame($('game-container'),type);}
window.addEventListener('hashchange',render);render();
