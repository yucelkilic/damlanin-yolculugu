import { pick, escapeHTML } from './locale.js';
import { stops } from './story-content.js';

const text = Object.fromEntries(Object.entries({
  reset:['Yeniden başla','Start again','Volver a empezar'],
  choose:['İlk durağı seç.','Choose the first stop.','Elige la primera parada.'],
  next:['Sıradaki durak hangisi?','Which stop comes next?','¿Cuál es la siguiente parada?'],
  wrongOrder:['Henüz oraya gelmedik. Önceki durağı düşün ve yeniden dene.','We’re not there yet. Think about the previous stop and try again.','Todavía no hemos llegado ahí. Piensa en la parada anterior y prueba otra vez.'],
  ordered:['Harika! Damla bahçeye ulaştı. Beş durağı da doğru sıraladın!','Wonderful! Damla reached the garden. You put all five stops in order!','¡Genial! Damla ha llegado al jardín. ¡Has ordenado las cinco paradas!'],
  sequenceTask:['Görevin: beni çatıdan çiçeklere ulaştır. Duraklara doğru sırayla dokun!','Your mission: take me from the roof to the flowers. Select the stops in the right order!','Tu misión: llévame del tejado a las flores. ¡Elige las paradas en orden!'],
  spotTask:['Görevin: resimdeki iki hatayı bul. Şüpheli yerlere dokun!','Your mission: find two mistakes in the picture. Select the suspicious places!','Tu misión: encuentra dos errores en la imagen. ¡Pulsa en los lugares sospechosos!'],
  spotAlt:['Okul bahçesinde iki kapalı yağmur suyu deposu, bir boru ve çocuk olan oyun çizimi.','Game illustration of a school garden with two covered rainwater tanks, a pipe and a child.','Ilustración de un jardín escolar con dos depósitos cerrados, una tubería y un niño.'],
  leakLabel:['Soldaki boruyu incele','Inspect the pipe on the left','Examina la tubería de la izquierda'],
  handsLabel:['Sağdaki su kullanımını incele','Inspect how water is used on the right','Examina el uso del agua a la derecha'],
  leak:['Birinci hata: boru boşa akıyor! Suyu kapalı toplama sistemine yönlendirmek gerekir. Bağlantıyı bir yetişkin düzeltir.','A mistake: the pipe is spilling water! It should lead into the covered collection system. An adult repairs the connection.','¡Un error: la tubería desperdicia agua! Debe conducirla al sistema cerrado de recogida. Un adulto arregla la conexión.'],
  hands:['Bir hata daha: yağmur suyuyla el yıkanıyor! Toplanan su el yıkamak için kullanılmaz.','Another mistake: washing hands with collected rainwater! This water is not for handwashing.','¡Otro error: lavarse las manos con agua de lluvia recogida! Esta agua no se usa para lavarse las manos.'],
  found:['İki hatayı da buldun! Suyu hem koruyor hem doğru işte kullanıyoruz.','You found both mistakes! We save water and use it for the right tasks.','¡Has encontrado los dos errores! Ahorramos agua y la usamos correctamente.'],
  lookAgain:['Buraya bir daha bak. Boşa akan suyu ve uygun olmayan bir kullanımı arıyoruz.','Look again. We’re looking for wasted water and an unsuitable use.','Mira otra vez. Buscamos agua desperdiciada y un uso inadecuado.'],
  hint:['İpucu göster','Show a hint','Mostrar una pista'],
  spotCount:['bulunan hata','mistakes found','errores encontrados'],
  quizTask:['Görevin: beş soruyu cevapla. Her cevapta birlikte öğrenelim!','Your mission: answer five questions. Let’s learn from every answer!','Tu misión: responde a cinco preguntas. ¡Aprendamos con cada respuesta!'],
  correct:['Doğru!','Correct!','¡Correcto!'],
  tryAnswer:['Birlikte öğrenelim:','Let’s learn together:','Aprendamos juntos:'],
  nextQuestion:['Sonraki soru','Next question','Siguiente pregunta'],
  results:['Sonucu gör','See results','Ver el resultado'],
  result:['Bilgi yolculuğun tamamlandı!','Your knowledge journey is complete!','¡Has completado el reto!'],
  firstTry:['İlk denemede doğru cevap','Correct answers on the first try','Respuestas correctas al primer intento'],
  resultCopy:['Hatalar da öğrenmenin bir parçası. İstersen yeniden deneyebilirsin!','Mistakes are part of learning too. You can try again!','Los errores también ayudan a aprender. ¡Puedes volver a intentarlo!'],
  question:['Soru','Question','Pregunta'],
}).map(([key, values]) => [key, pick(values)]));

const question = (q, answers, correct, why) => ({q:pick(q),answers:pick(answers),correct,why:pick(why)});
export const questions = [
  question(['Topladığımız yağmur suyu hangi işte kullanılabilir?','What can collected rainwater be used for?','¿Para qué sirve el agua de lluvia recogida?'],
    [['Çiçekleri sulamak','Su içmek','El yıkamak'],['Watering flowers','Drinking','Washing hands'],['Regar flores','Beber','Lavarse las manos']],0,
    ['Görevli yetişkin bu suyu çiçekleri sulamakta kullanabilir. İçmeyiz ve el yıkamada kullanmayız.','The responsible adult can use it to water flowers. We do not drink it or wash our hands with it.','El adulto responsable puede regar las flores con ella. No la bebemos ni nos lavamos las manos con ella.']),
  question(['Yaprak süzgeci ne yapar?','What does the leaf screen do?','¿Qué hace el filtro de hojas?'],
    [['Suyu içilebilir yapar','Yaprak ve iri parçaları tutar','Yağmur yağdırır'],['Makes water safe to drink','Catches leaves and large pieces','Makes it rain'],['Hace potable el agua','Retiene hojas y trozos grandes','Hace que llueva']],1,
    ['Süzgeç iri parçaları tutar; suyu içilebilir hâle getirmez.','The screen catches large pieces; it does not make water safe to drink.','El filtro retiene trozos grandes, pero no hace potable el agua.']),
  question(['Depoyu kim kullanmalı?','Who should operate the tank?','¿Quién debe utilizar el depósito?'],
    [['Çocuklar tek başına','Herkes sırayla','Görevli yetişkin'],['Children on their own','Anyone taking turns','The responsible adult'],['Los niños solos','Todos por turnos','El adulto responsable']],2,
    ['Depoyu, musluğu ve sistemi görevli yetişkin kullanır. Biz güvenli bir yerden gözlemleriz.','The responsible adult uses the tank, tap and system. We observe from a safe place.','El adulto responsable utiliza el depósito, el grifo y el sistema. Nosotros observamos desde un lugar seguro.']),
  question(['Depo neden kapalı olmalı?','Why should the tank stay covered?','¿Por qué debe estar cerrado el depósito?'],
    [['Kir ve böcek girişini azaltmak için','Suyun rengini değiştirmek için','İçine daha çok yaprak koymak için'],['To reduce dirt and insects getting in','To change the water’s colour','To put more leaves inside'],['Para reducir la entrada de suciedad e insectos','Para cambiar el color del agua','Para poner más hojas dentro']],0,
    ['Kapak, dışarıdan kir ve böcek girişini azaltır. Bakımı yetişkinler yapar.','The cover reduces the entry of dirt and insects. Adults carry out maintenance.','La tapa reduce la entrada de suciedad e insectos. Los adultos realizan el mantenimiento.']),
  question(['Diş fırçalarken suyu nasıl koruruz?','How do we save water while brushing our teeth?','¿Cómo ahorramos agua al cepillarnos los dientes?'],
    [['Musluğu sürekli açık bırakarak','Musluğu ihtiyaç olmadığında kapatarak','Daha çok su akıtarak'],['Leave the tap running','Turn off the tap when not needed','Let more water flow'],['Dejando el grifo abierto','Cerrando el grifo cuando no hace falta','Dejando correr más agua']],1,
    ['Musluğu yalnızca ihtiyacımız olduğunda açarız. Küçük alışkanlıklar suyu korur.','We turn on the tap only when we need it. Small habits help save water.','Abrimos el grifo solo cuando lo necesitamos. Los pequeños hábitos ayudan a ahorrar agua.'])
];

export function celebrate(parent=document.body) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer=document.createElement('div'); layer.className='celebration'; layer.setAttribute('aria-hidden','true');
  for(let i=0;i<42;i++){
    const bit=document.createElement('i');bit.style.cssText=`--x:${Math.random()*100}%;--delay:${Math.random()*.3}s;--drift:${Math.random()*160-80}px;--color:${['#f4c956','#65c4da','#7db7a0','#e9967c'][i%4]}`;layer.append(bit);
  }
  parent.append(layer);setTimeout(()=>layer.remove(),2900);
}
const buddy = message => `<div class="game-buddy"><img src="${new URL('./damla.svg',import.meta.url)}" alt="" width="48" height="58"><p>${escapeHTML(message)}</p></div>`;
const announce = (root, message, success=false) => { const out=root.querySelector('.game-status');out.textContent=message;out.classList.toggle('success',success); };
const icons=['⌂','↳','🍃','▤','🌼'];
export function mountGame(root, kind) {
  root.replaceChildren();
  if(kind==='sequence') return sequenceGame(root);
  if(kind==='spot') return spotGame(root);
  if(kind==='quiz') return quizGame(root);
}
function sequenceGame(root) {
  let order=[];
  root.innerHTML=`${buddy(text.sequenceTask)}<ol class="sequence-slots" aria-label="${escapeHTML(text.sequenceTask)}">${stops.map((_,i)=>`<li><span>${i+1}</span><b>…</b></li>`).join('')}</ol><div class="sequence-options">${[3,0,4,2,1].map(i=>`<button data-order="${i}"><span aria-hidden="true">${icons[i]}</span>${escapeHTML(stops[i])}</button>`).join('')}</div><p class="game-status" role="status">${text.choose}</p><button class="game-reset">↻ ${text.reset}</button>`;
  root.querySelectorAll('[data-order]').forEach(button=>button.addEventListener('click',()=>{
    const n=Number(button.dataset.order);
    if(n!==order.length){announce(root,text.wrongOrder);return;}
    order.push(n);button.disabled=true;button.classList.add('solved');
    const slot=root.querySelectorAll('.sequence-slots li')[n];slot.classList.add('filled');slot.querySelector('b').textContent=stops[n];
    announce(root,order.length===5?text.ordered:text.next,order.length===5);
    if(order.length===5)celebrate(root);
  }));
  root.querySelector('.game-reset').addEventListener('click',()=>sequenceGame(root));
}
function spotGame(root) {
  const found=new Set();
  root.innerHTML=`${buddy(text.spotTask)}<div class="spot-scene"><img src="${new URL('./games/hatalari-bul.webp',import.meta.url)}" alt="${escapeHTML(text.spotAlt)}" width="1672" height="941"><button class="hotspot leak" data-error="leak" aria-label="${text.leakLabel}"><span>✓</span></button><button class="hotspot hands" data-error="hands" aria-label="${text.handsLabel}"><span>✓</span></button></div><div class="spot-tools"><b class="spot-count">0 / 2 ${text.spotCount}</b><button class="game-hint">${text.hint}</button></div><p class="game-status" role="status">${text.spotTask}</p><button class="game-reset">↻ ${text.reset}</button>`;
  root.querySelector('.spot-scene').addEventListener('click',event=>{if(event.target.tagName==='IMG')announce(root,text.lookAgain);});
  root.querySelectorAll('[data-error]').forEach(button=>button.addEventListener('click',()=>{
    if(found.has(button.dataset.error))return;
    found.add(button.dataset.error);button.classList.add('found');button.setAttribute('aria-pressed','true');
    root.querySelector('.spot-count').textContent=`${found.size} / 2 ${text.spotCount}`;
    const message=text[button.dataset.error]+(found.size===2?' '+text.found:'');
    announce(root,message,found.size===2);
    if(found.size===2)celebrate(root);
  }));
  root.querySelector('.game-hint').addEventListener('click',()=>root.querySelector('.spot-scene').classList.toggle('show-hints'));
  root.querySelector('.game-reset').addEventListener('click',()=>spotGame(root));
}
function quizGame(root) {
  let current=0,score=0;
  function render(){
    if(current===questions.length){
      root.innerHTML=`${buddy(text.result)}<div class="quiz-result"><strong>${score}<small> / ${questions.length}</small></strong><h3>${text.firstTry}</h3><p>${text.resultCopy}</p></div><button class="game-reset">↻ ${text.reset}</button>`;
      root.querySelector('.game-reset').addEventListener('click',()=>quizGame(root));celebrate(root);return;
    }
    const q=questions[current];
    root.innerHTML=`${buddy(text.quizTask)}<div class="quiz-heading"><span>${text.question} ${current+1} / ${questions.length}</span><h3>${escapeHTML(q.q)}</h3></div><div class="quiz-options">${q.answers.map((answer,i)=>`<button data-choice="${i}"><span>${String.fromCharCode(65+i)}</span>${current===0?`<img class="answer-icon" src="${new URL('./story/'+['flowers','drink','hands'][i]+'.webp',import.meta.url)}" alt="" width="40" height="40">`:''}${escapeHTML(answer)}</button>`).join('')}</div><p class="game-status" role="status"></p><button class="quiz-next" hidden>${current===questions.length-1?text.results:text.nextQuestion} →</button>`;
    root.querySelectorAll('[data-choice]').forEach(button=>button.addEventListener('click',()=>{
      const choice=Number(button.dataset.choice),correct=choice===q.correct;
      if(correct)score++;
      root.querySelectorAll('[data-choice]').forEach(option=>{option.disabled=true;option.classList.toggle('correct',Number(option.dataset.choice)===q.correct);});
      if(!correct)button.classList.add('wrong');
      announce(root,`${correct?text.correct:text.tryAnswer} ${q.why}`,correct);
      root.querySelector('.quiz-next').hidden=false;
    }));
    root.querySelector('.quiz-next').addEventListener('click',()=>{current++;render();});
  }
  render();
}
