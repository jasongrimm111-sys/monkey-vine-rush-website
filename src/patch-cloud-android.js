// "Saves with iCloud" names Google's backup too, and the "my progress is gone" answer covers Android (user, 2026-11-08).
// node src/patch-cloud-android.js  (then node src/build.js). Safe to run twice.
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, 'i18n');
const HEAD = { en:'Saves with iCloud and Google backup', de:'Speichert in iCloud und Google-Sicherung', es:'Se guarda en iCloud y en la copia de seguridad de Google',
  fr:'Sauvegarde iCloud et Google', id:'Tersimpan di iCloud dan cadangan Google', it:'Salva su iCloud e nel backup Google', ja:'iCloud と Google バックアップに保存',
  ko:'iCloud 및 Google 백업에 저장', nl:'Opslaan in iCloud en Google-back-up', pl:'Zapis w iCloud i kopii zapasowej Google', pt:'Salva no iCloud e no backup do Google',
  ru:'Сохранение в iCloud и резервной копии Google', sv:'Sparas i iCloud och Google-säkerhetskopia', tr:'iCloud ve Google yedeği ile kaydeder',
  'zh-TW':'iCloud 與 Google 備份存檔', zh:'iCloud 和 Google 备份存档' };
const A6 = {
  en:'On Android, your progress comes back from your phone\'s Google backup. Google updates the backup about once a day, so your most recent play may not be in it yet.',
  de:'Auf Android kommt dein Fortschritt aus der Google-Sicherung deines Handys zurück. Google aktualisiert die Sicherung etwa einmal am Tag, deshalb ist dein neuestes Spiel vielleicht noch nicht dabei.',
  es:'En Android, tu progreso vuelve desde la copia de seguridad de Google de tu móvil. Google la actualiza más o menos una vez al día, así que puede que tus últimas partidas aún no estén incluidas.',
  fr:'Sur Android, ta progression revient depuis la sauvegarde Google de ton téléphone. Google la met à jour environ une fois par jour, donc tes dernières parties n\'y sont peut-être pas encore.',
  id:'Di Android, progresmu kembali dari cadangan Google ponselmu. Google memperbarui cadangan kira-kira sekali sehari, jadi permainan terbarumu mungkin belum ikut tersimpan.',
  it:'Su Android, i progressi tornano dal backup Google del telefono. Google aggiorna il backup circa una volta al giorno, quindi le partite più recenti potrebbero non esserci ancora.',
  ja:'Android では、進行状況はスマホの Google バックアップから戻ります。バックアップは 1 日に 1 回ほど更新されるため、直近のプレイはまだ含まれていない場合があります。',
  ko:'Android에서는 진행 상황이 휴대폰의 Google 백업에서 돌아와요. 백업은 하루에 한 번 정도 업데이트되므로 가장 최근 플레이는 아직 포함되지 않았을 수 있어요.',
  nl:'Op Android komt je voortgang terug uit de Google-back-up van je telefoon. Google werkt die ongeveer één keer per dag bij, dus je laatste spelletjes staan er misschien nog niet in.',
  pl:'Na Androidzie postępy wracają z kopii zapasowej Google na telefonie. Google aktualizuje ją mniej więcej raz dziennie, więc najnowszej gry może jeszcze w niej nie być.',
  pt:'No Android, seu progresso volta do backup do Google do celular. O Google atualiza o backup cerca de uma vez por dia, então suas partidas mais recentes podem ainda não estar nele.',
  ru:'На Android прогресс возвращается из резервной копии Google на телефоне. Google обновляет её примерно раз в день, поэтому самая последняя игра может ещё не попасть в копию.',
  sv:'På Android kommer dina framsteg tillbaka från mobilens Google-säkerhetskopia. Google uppdaterar den ungefär en gång om dagen, så det senaste du spelat kanske inte är med än.',
  tr:'Android\'de ilerlemen telefonunun Google yedeğinden geri gelir. Google yedeği günde yaklaşık bir kez günceller, bu yüzden en son oyunların henüz yedekte olmayabilir.',
  'zh-TW':'在 Android 上，進度會從手機的 Google 備份回來。Google 大約每天更新一次備份，所以最近的遊玩紀錄可能還沒包含在內。',
  zh:'在 Android 上，进度会从手机的 Google 备份恢复。Google 大约每天更新一次备份，所以最近的游戏进度可能还没包含在内。' };
let n = 0;
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const lang = f.replace('.json', ''), file = path.join(DIR, f), j = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (HEAD[lang] && j.fam4_h !== HEAD[lang]) { j.fam4_h = HEAD[lang]; n++; }
  if (A6[lang] && j.a6 && !j.a6.includes('Android')) { j.a6 += '<p>' + A6[lang] + '</p>'; n++; }
  fs.writeFileSync(file, JSON.stringify(j, null, 2) + '\n');
}
console.log('changes made:', n);
