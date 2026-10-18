import { lang, pick, languagePicker, initLocale, escapeHTML as esc, localized } from '../assets/locale.js';
import { slides, ui, stops } from '../assets/story-content.js';
import { mountGame } from '../assets/games.js';

const $=id=>document.getElementById(id);
const gameTypes=new Set(['sequence','spot','quiz']);
let index=Math.max(0,slides.findIndex(slide=>slide.id===location.hash.slice(1)));
let started=false,sound=false,playing=false,timer=null,toastTimer=null,voiceWatchdog=null,speechToken=0,utterance=null,animations=[];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const synth=window.speechSynthesis;
document.title=ui.title+' · '+ui.project;
$('language-slot').innerHTML=languagePicker();
initLocale();
for(const [id,value] of Object.entries({'brand-title':ui.title,'start-title':ui.title,'start-eyebrow':ui.project,'start-hint':ui.startHint,'start-with-sound':'▶ '+ui.start,'start-silent':ui.silent,'keyboard-help':ui.help,'caption-label':ui.transcript,'sources-title':ui.sources,'sources-copy':ui.sourceNote}))$(id).textContent=value;
$('previous').querySelector('span').textContent=ui.previous;
$('next').querySelector('span').textContent=ui.next;
$('stage').setAttribute('aria-label',ui.scene);
$('captions').setAttribute('aria-label',ui.transcript);
$('timeline').setAttribute('aria-label',ui.chapters);
$('chapters').setAttribute('aria-label',ui.chapters);
for(const [id,label] of Object.entries({'replay':ui.replay,'fullscreen':ui.fullscreen,'chapter-toggle':ui.chapters,'transcript-toggle':ui.transcript,'close-transcript':ui.close})){$(id).setAttribute('aria-label',label);$(id).title=label;}
$('timeline').innerHTML=slides.map((slide,i)=>`<button data-scene="${i}" aria-label="${i+1}. ${esc(slide.title.replaceAll('\n',' '))}"></button>`).join('');
$('chapters').innerHTML=slides.map((slide,i)=>`<button data-scene="${i}"><span>${String(i+1).padStart(2,'0')}</span>${esc(slide.title.replaceAll('\n',' '))}</button>`).join('');
document.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',()=>{go(Number(button.dataset.scene));closeChapters();}));

function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,6500);}
function controls(){
  $('previous').disabled=index===0;
  $('next').disabled=index===slides.length-1;
  $('counter').textContent=`${index+1} / ${slides.length}`;
  $('scene-title').textContent=slides[index].title.replaceAll('\n',' ');
  $('sound').textContent=sound?'◖ '+ui.soundOff:'◖ '+ui.soundOn;
  $('sound').setAttribute('aria-pressed',String(sound));
  $('autoplay').textContent=playing?'Ⅱ '+ui.pause:'▶ '+ui.play;
  $('autoplay').setAttribute('aria-pressed',String(playing));
  document.querySelectorAll('[data-scene]').forEach(button=>{const i=Number(button.dataset.scene);button.setAttribute('aria-current',String(i===index));button.classList.toggle('visited',i<index);});
}
function stopSpeech(){speechToken++;clearTimeout(voiceWatchdog);if(synth)synth.cancel();utterance=null;$('captions').classList.remove('speaking');$('caption-label').textContent=ui.transcript;}
function clearScene(){clearTimeout(timer);stopSpeech();animations.forEach(animation=>animation.cancel());animations=[];}
function route(step){return `<div class="route-mini">${stops.map((name,i)=>`<span class="${i===step?'current':''}" ${i===step?'aria-current="step"':''}>${i+1} · ${esc(name)}</span>${i<4?'<b aria-hidden="true">→</b>':''}`).join('')}</div>`;}
function rain(){return `<div class="rain-layer" aria-hidden="true">${Array.from({length:22},(_,i)=>`<i style="--left:${3+i*3.4}%;--delay:${(i%7)*.24}s"></i>`).join('')}</div>`;}
function media(slide){
  const water=slide.type==='process'||slide.type==='overview';
  const path=water?'<svg class="water-path" viewBox="0 0 1672 941" aria-hidden="true"><path d="M220 200 830 370 865 422 1008 435 1030 507 1100 555 1130 760 1350 836"/></svg>':'';
  const points=[[28,27],[57,44],[62,51],[70,70]];
  const focus=slide.type==='process'?`<span class="focus-pulse" aria-hidden="true" style="left:${points[slide.step][0]}%;top:${points[slide.step][1]}%"></span>`:'';
  return `<div class="scene-media"><div class="scene-art"><img src="../assets/story/${slide.image}.webp" alt="${esc(ui.illustration)}" width="1672" height="941">${path}${water?'<span class="traveller" aria-hidden="true"><img src="../assets/damla.svg" alt=""></span>':''}${focus}${['question','overview'].includes(slide.type)||slide.step===0?rain():''}</div></div>`;
}
const kicker=slide=>slide.step!==undefined?`${String(slide.step+1).padStart(2,'0')} / 05 · ${stops[slide.step].toLocaleUpperCase(lang)}`:ui.project;
const copy=slide=>`<div class="scene-copy"><p class="scene-kicker">${esc(kicker(slide))}</p><${slide.type==='cover'?'h1':'h2'}>${esc(slide.title)}</${slide.type==='cover'?'h1':'h2'}><p class="scene-body">${esc(slide.body)}</p>${slide.type==='process'&&slide.step>=2||slide.type==='garden'?`<p class="scene-safety">${esc(ui.safety)}</p>`:''}${slide.type==='cover'?'<p class="cover-tag">Fahrettin Sert İlkokulu<br>Konyaaltı / Antalya</p>':''}${slide.type==='end'?`<strong class="end-thanks">${esc(ui.thanks)}</strong><div class="end-actions"><a href="${localized('../oyunlar/')}">${esc(ui.games)} ↗</a><button id="restart">↻ ${esc(ui.backStart)}</button></div><a class="website" href="${localized('../')}">yagmursuyuhasadi.org.tr</a>`:''}</div>`;

function render(){
  clearScene();const slide=slides[index];
  const game=gameTypes.has(slide.type);
  let content='';
  if(game){content=`<div class="scene-top"><div><p class="scene-kicker">${esc(ui.games)}</p><h2>${esc(slide.title.replaceAll('\n',' '))}</h2></div><p class="scene-body">${esc(slide.body)}</p></div><div class="game-mount"></div><p class="game-hint-line">${esc(ui.gameHint)}</p>`;}
  else if(slide.type==='climate'){
    content=copy(slide)+`<div class="climate-board"><div class="sun-symbol" aria-hidden="true">☀</div><p class="climate-number">≈ 1.000 <small>mm / ${lang==='tr'?'yıl':lang==='es'?'año':'year'}</small></p><p class="climate-source">${esc(ui.longRain)}</p><div class="bucket-comparison" role="img" aria-label="${esc(ui.bucketStory)}"><div class="bucket-row" aria-hidden="true">${Array.from({length:10},(_,i)=>`<span class="bucket ${i>=7?'empty':''}" style="--delay:${i*.09}s"></span>`).join('')}</div><p class="model-label">${esc(ui.bucketStory)}</p></div><p class="model-note">${esc(ui.climateNote)}</p></div>`;
  }else if(slide.type==='calculator'){
    content=copy(slide)+`<div class="calculator-card"><div class="calc-inputs"><label>${esc(ui.area)}<input id="area" type="range" min="1" max="200" value="50"><output id="area-value" for="area">50 m²</output></label><label>${esc(ui.rain)}<input id="rain" type="range" min="1" max="50" value="10"><output id="rain-value" for="rain">10 mm</output></label></div><div class="calc-total" aria-live="polite"><strong id="liters">500</strong><p>${esc(ui.liters)}</p></div><p class="model-note">${esc(ui.calcNote)}</p></div>`;
  }else if(slide.type==='flood'){
    content=copy(slide)+`<div class="flood-board"><div class="rainy-days-card"><p>${esc(ui.rainyDays)}</p><div><span><small>2023</small><b>78</b></span><i aria-hidden="true">→</i><span><small>2024</small><b>66</b></span></div></div><div class="downpour-card"><img src="../assets/damla.svg" alt="" aria-hidden="true"><div><strong>297,7 <small>mm</small></strong><p>${esc(ui.rainDayLabel)}</p></div></div><p class="model-label">${esc(ui.bucketStory)}</p><div class="flood-drops" aria-hidden="true">💧　💧　💧</div><p class="model-note">${esc(ui.floodCaution)}</p></div>`;
  }else{
    content=copy(slide)+media(slide);
    if(slide.type==='cover')content+='<img class="floating-drop" src="../assets/damla.svg" alt="" width="60" height="73">';
    if(slide.type==='overview'||slide.step!==undefined)content+=route(slide.step);
  }
  $('stage').innerHTML=`<section class="scene ${slide.type} ${game?'game-slide':''}" ${slide.step!==undefined?`data-step="${slide.step}"`:''} aria-label="${esc(slide.title.replaceAll('\n',' '))}">${content}</section>`;
  if(game)mountGame($('stage').querySelector('.game-mount'),slide.type);
  if(slide.type==='calculator'){
    const update=()=>{const area=Number($('area').value),rain=Number($('rain').value);$('area-value').textContent=area+' m²';$('rain-value').textContent=rain+' mm';$('liters').textContent=new Intl.NumberFormat(lang).format(area*rain);};
    $('area').addEventListener('input',update);$('rain').addEventListener('input',update);update();
  }
  $('restart')?.addEventListener('click',()=>go(0));
  $('caption-text').textContent=slide.narration;
  $('full-narration').textContent=slide.narration;
  $('transcript-title').textContent=ui.transcript+' · '+(index+1);
  controls();
  animateWater(slide);
  if(started&&sound)narrate();else schedule();
}
function animateWater(slide){
  const drop=$('stage').querySelector('.traveller');if(!drop)return;
  const routes=[[[13,18],[27,27],[49,39]],[[49,39],[52,45],[60,46]],[[60,46],[61.5,50],[62,54]],[[62,54],[67,59],[70,79]]];
  const points=slide.type==='overview'?routes.flat():routes[slide.step];
  drop.style.left=points[0][0]+'%';drop.style.top=points[0][1]+'%';
  if(!reduced&&drop.animate)animations.push(drop.animate(points.map(([x,y])=>({left:x+'%',top:y+'%'})),{duration:slide.type==='overview'?12000:5000,iterations:Infinity,easing:'linear'}));
}
function schedule(delay){
  clearTimeout(timer);
  if(!started||!playing||document.hidden||$('transcript-dialog').open||gameTypes.has(slides[index].type)||index===slides.length-1)return;
  const duration=delay??Math.max(11000,slides[index].narration.split(/\s+/).length*470+2500);
  timer=setTimeout(()=>go(index+1),duration);
}
async function narrate(){
  clearTimeout(timer);stopSpeech();const token=speechToken;
  if(!synth||!window.SpeechSynthesisUtterance){sound=false;controls();toast(ui.noVoice);schedule();return;}
  let voices=synth.getVoices();
  if(!voices.length){await new Promise(resolve=>{const done=()=>{clearTimeout(wait);synth.removeEventListener('voiceschanged',done);resolve();};const wait=setTimeout(done,1200);synth.addEventListener('voiceschanged',done);});voices=synth.getVoices();}
  if(token!==speechToken||!sound||document.hidden)return;
  const matching=voices.filter(voice=>voice.lang.toLowerCase().startsWith(lang));
  const voice=matching.find(voice=>/Yelda|Samantha|Google|Mónica|Monica|Paulina/.test(voice.name))||matching[0];
  if(!voice){sound=false;controls();toast(ui.noVoice);schedule();return;}
  utterance=new SpeechSynthesisUtterance(slides[index].narration);utterance.lang=voice.lang;utterance.voice=voice;utterance.rate=lang==='tr'?.88:.91;utterance.pitch=1.12;
  utterance.onstart=()=>{clearTimeout(voiceWatchdog);if(token===speechToken){$('captions').classList.add('speaking');$('caption-label').textContent=ui.caption;}};
  utterance.onboundary=event=>{if(token!==speechToken||event.name!=='word')return;const text=slides[index].narration;const before=text.slice(0,event.charIndex);const sentenceStart=Math.max(before.lastIndexOf('.'),before.lastIndexOf('!'),before.lastIndexOf('?'))+1;const rest=text.slice(sentenceStart);const end=rest.search(/[.!?]/);$('caption-text').textContent=end<0?rest:rest.slice(0,end+1);};
  utterance.onend=()=>{clearTimeout(voiceWatchdog);if(token!==speechToken)return;utterance=null;$('captions').classList.remove('speaking');$('caption-label').textContent=ui.transcript;$('caption-text').textContent=slides[index].narration;schedule(1600);};
  utterance.onerror=event=>{clearTimeout(voiceWatchdog);if(token!==speechToken||event.error==='interrupted'||event.error==='canceled')return;sound=false;$('captions').classList.remove('speaking');controls();toast(ui.voiceError);schedule();};
  voiceWatchdog=setTimeout(()=>{if(token!==speechToken)return;sound=false;stopSpeech();controls();toast(ui.voiceError);schedule();},6000);
  synth.speak(utterance);
}
function go(next){if(next<0||next>=slides.length)return;index=next;const url=new URL(location.href);url.hash=slides[index].id;history.replaceState(null,'',url);render();}
function begin(withSound){started=true;sound=withSound;playing=withSound;$('start-overlay').hidden=true;render();}
$('start-with-sound').addEventListener('click',()=>begin(true));
$('start-silent').addEventListener('click',()=>begin(false));
$('previous').addEventListener('click',()=>go(index-1));$('next').addEventListener('click',()=>go(index+1));
$('sound').addEventListener('click',()=>{if(!started)return;sound=!sound;if(sound)narrate();else{stopSpeech();$('caption-text').textContent=slides[index].narration;schedule();}controls();});
$('autoplay').addEventListener('click',()=>{if(!started)return;playing=!playing;if(playing){if(sound)narrate();else schedule();}else{clearTimeout(timer);stopSpeech();}controls();});
$('replay').addEventListener('click',render);
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast(ui.fullscreen);}});
function closeChapters(){$('chapters').hidden=true;$('chapter-toggle').setAttribute('aria-expanded','false');}
$('chapter-toggle').addEventListener('click',()=>{$('chapters').hidden=!$('chapters').hidden;$('chapter-toggle').setAttribute('aria-expanded',String(!$('chapters').hidden));});
$('transcript-toggle').addEventListener('click',()=>{clearTimeout(timer);stopSpeech();$('transcript-dialog').showModal();});
$('close-transcript').addEventListener('click',()=>$('transcript-dialog').close());
$('transcript-dialog').addEventListener('close',()=>{if(sound&&playing)narrate();else schedule();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(timer);stopSpeech();}else if(started){if(sound&&playing)narrate();else schedule();}});
document.addEventListener('keydown',event=>{
  if(/INPUT|SELECT|TEXTAREA|BUTTON|A/.test(event.target.tagName)||$('transcript-dialog').open||!started)return;
  if(event.key==='ArrowRight'){event.preventDefault();go(index+1);}if(event.key==='ArrowLeft'){event.preventDefault();go(index-1);}
  if(event.code==='Space'){event.preventDefault();$('autoplay').click();}if(event.key.toLowerCase()==='f')$('fullscreen').click();if(event.key==='Escape')closeChapters();
});
window.addEventListener('hashchange',()=>{const target=slides.findIndex(slide=>slide.id===location.hash.slice(1));if(target>=0&&target!==index){index=target;render();}});
window.addEventListener('pagehide',clearScene);
render();
