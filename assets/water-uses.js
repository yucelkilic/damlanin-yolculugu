import { pick } from './locale.js?v=20261019-all-uses';

export const waterUses = [
  {id:'flowers', image:'flowers', label:pick(['Bahçe sulama','Garden watering','Riego del jardín']), copy:pick(['Biriken suyla çiçekler ve süs bitkileri sulanabilir.','Stored rainwater can water flowers and ornamental plants.','El agua guardada puede regar flores y plantas ornamentales.'])},
  {id:'toilet', image:'toilet', label:pick(['Klozet sifonları','Toilet flushing','Descarga del WC']), copy:pick(['Su, uygun tesisatla klozet rezervuarlarına aktarılıp sifonlarda kullanılabilir.','Water can supply toilet cisterns through suitable plumbing and be used for flushing.','Con una instalación adecuada, el agua puede abastecer las cisternas del WC para la descarga.'])},
  {id:'cleaning', icon:'🧹', label:pick(['Okul temizliği','School cleaning','Limpieza del colegio']), copy:pick(['Görevli yetişkinler, biriken suyu okulun temizlik işlerinde değerlendirebilir.','Responsible adults can use stored rainwater for school cleaning.','Los adultos responsables pueden aprovechar el agua guardada para la limpieza del colegio.'])}
];
export const suitableUseIds = new Set(waterUses.map(use=>use.id));
export const useSummary = pick(['Bahçe sulama, klozet sifonları ve okul temizliği','Garden watering, toilet flushing and school cleaning','Riego del jardín, descarga del WC y limpieza del colegio']);
export const useFeedback = pick(['Harika! Toplanan su bahçe sulamada, klozet sifonlarında ve okul temizliğinde kullanılabilir. Sistemi görevli yetişkinler kullanır.','Great! Collected rainwater can be used for garden watering, toilet flushing and school cleaning. Responsible adults operate the system.','¡Genial! El agua recogida puede usarse para regar, descargar el WC y limpiar el colegio. Los adultos responsables utilizan el sistema.']);
export const unsuitableUseFeedback = pick(['Bir kez daha düşünelim! Bu suyu içmeyiz ve el yıkamada kullanmayız. Süzgeç, suyu içilebilir yapmaz.','Think again! We do not drink this water or wash our hands with it. The screen does not make it safe to drink.','¡Piénsalo otra vez! No bebemos esta agua ni nos lavamos las manos con ella. El filtro no la hace potable.']);
