// The game is on Google Play as well as the App Store (user, 2026-11-08): add Android wherever the site says iPhone and iPad,
// a Google Play badge text, Google's trademark line, and the Android answers on the support page, in all 16 languages.
// node src/patch-android-live.js  (then node src/build.js). Safe to run twice: it checks before changing anything.
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, 'i18n');
const KEYS = ['meta_title', 'meta_desc', 'og_desc', 'hero_eyebrow', 'fam4_p', 'final_p'];

// phrase swaps, longest first, per language
const SWAP = {
  en:[['your iPhone or iPad', 'your phone or tablet'], ['iPhone &amp; iPad', 'iPhone, iPad &amp; Android'], ['iPhone & iPad', 'iPhone, iPad & Android'], ['iPhone and iPad', 'iPhone, iPad and Android']],
  de:[['deinem iPhone oder iPad', 'deinem Handy oder Tablet'], ['iPhone und iPad', 'iPhone, iPad und Android']],
  es:[['tu iPhone o iPad', 'tu móvil o tableta'], ['iPhone y iPad', 'iPhone, iPad y Android']],
  fr:[['ton iPhone ou ton iPad', 'ton téléphone ou ta tablette'], ['iPhone et iPad', 'iPhone, iPad et Android']],
  id:[['iPhone atau iPad-mu', 'ponsel atau tabletmu'], ['iPhone dan iPad', 'iPhone, iPad, dan Android']],
  it:[['su iPhone o iPad', 'su telefono o tablet'], ['iPhone e iPad', 'iPhone, iPad e Android']],
  ja:[['iPhone でも iPad でも', 'スマホでもタブレットでも'], ['iPhone と iPad で', 'iPhone・iPad・Android で'], ['iPhone・iPad', 'iPhone・iPad・Android']],
  ko:[['iPhone이나 iPad에서', '휴대폰이나 태블릿에서'], ['iPhone과 iPad에서', 'iPhone, iPad, Android에서'], ['iPhone 및 iPad', 'iPhone, iPad 및 Android']],
  nl:[['je iPhone of iPad', 'je telefoon of tablet'], ['iPhone en iPad', 'iPhone, iPad en Android']],
  pl:[['na iPhonie lub iPadzie', 'na telefonie lub tablecie'], ['na iPhonie i iPadzie', 'na iPhonie, iPadzie i Androidzie'], ["Na iPhone'a i iPada", "Na iPhone'a, iPada i Androida"], ['iPhone i iPad', 'iPhone, iPad i Android']],
  pt:[['no seu iPhone ou iPad', 'no seu celular ou tablet'], ['iPhone e iPad', 'iPhone, iPad e Android']],
  ru:[['на iPhone или iPad', 'на телефоне или планшете'], ['iPhone и iPad', 'iPhone, iPad и Android']],
  sv:[['din iPhone eller iPad', 'din mobil eller surfplatta'], ['iPhone och iPad', 'iPhone, iPad och Android']],
  tr:[["iPhone veya iPad'inde", 'telefonunda veya tabletinde'], ["iPhone ve iPad'de", "iPhone, iPad ve Android'de"], ['iPhone ve iPad', 'iPhone, iPad ve Android']],
  'zh-TW':[['在 iPhone 或 iPad 上', '在手機或平板上'], ['iPhone 與 iPad', 'iPhone、iPad 與 Android']],
  zh:[['在 iPhone 或 iPad 上', '在手机或平板上'], ['iPhone 和 iPad', 'iPhone、iPad 和 Android']],
};

const BADGE = { en:'Get it on Google Play', de:'Jetzt bei Google Play', es:'Disponible en Google Play', fr:'Disponible sur Google Play', id:'Temukan di Google Play',
  it:'Disponibile su Google Play', ja:'Google Play で手に入れよう', ko:'Google Play에서 다운로드', nl:'Ontdek het op Google Play', pl:'Pobierz z Google Play',
  pt:'Disponível no Google Play', ru:'Доступно в Google Play', sv:'Ladda ned på Google Play', tr:"Google Play'den alın", 'zh-TW':'立即前往 Google Play 下載', zh:'在 Google Play 上获取' };

const TM = { en:'Google Play and the Google Play logo are trademarks of Google LLC.', de:'Google Play und das Google Play-Logo sind Marken von Google LLC.',
  es:'Google Play y el logotipo de Google Play son marcas de Google LLC.', fr:'Google Play et le logo Google Play sont des marques de Google LLC.',
  id:'Google Play dan logo Google Play adalah merek dagang Google LLC.', it:'Google Play e il logo Google Play sono marchi di Google LLC.',
  ja:'Google Play および Google Play ロゴは Google LLC の商標です。', ko:'Google Play 및 Google Play 로고는 Google LLC의 상표입니다.',
  nl:'Google Play en het Google Play-logo zijn handelsmerken van Google LLC.', pl:'Google Play i logo Google Play są znakami towarowymi Google LLC.',
  pt:'Google Play e o logotipo do Google Play são marcas da Google LLC.', ru:'Google Play и логотип Google Play являются товарными знаками Google LLC.',
  sv:'Google Play och Google Play-logotypen är varumärken som tillhör Google LLC.', tr:"Google Play ve Google Play logosu Google LLC'nin ticari markalarıdır.",
  'zh-TW':'Google Play 和 Google Play 標誌是 Google LLC 的商標。', zh:'Google Play 和 Google Play 徽标是 Google LLC 的商标。' };

const REFUND = 'https://play.google.com/store/account/orderhistory';
const P = s => `<p>${s}</p>`, PATH = s => `<span class="path">${s}</span>`;
// support answers for Android: a3 turning off purchases, a4 refunds, a5 a new phone
const ANDROID = {
  en:{ a3:P(`On Android, open the Google Play Store app, tap your profile picture, then ${PATH('Settings › Authentication › Require authentication for purchases')} and choose <b>For all purchases</b>. Parents can also use <b>Google Family Link</b>.`),
       a4:P(`On Android, Google handles payments and refunds. Go to <a href="${REFUND}">play.google.com/store/account/orderhistory</a>, sign in with the Google Account that made the purchase, find the coin pack and choose <b>Request a refund</b>.`),
       a5:P(`On Android, your progress is kept in your phone's Google backup. On the new phone, sign in with the same Google Account and restore your backup when asked, then install Monkey Vine Rush. Your progress comes back by itself.`) },
  de:{ a3:P(`Auf Android öffnest du die Google Play Store-App, tippst auf dein Profilbild und dann auf ${PATH('Einstellungen › Authentifizierung › Authentifizierung für Käufe erforderlich')} und wählst <b>Für alle Käufe</b>. Eltern können auch <b>Google Family Link</b> nutzen.`),
       a4:P(`Auf Android kümmert sich Google um Zahlungen und Erstattungen. Geh auf <a href="${REFUND}">play.google.com/store/account/orderhistory</a>, melde dich mit dem Google-Konto an, mit dem gekauft wurde, such das Münzpaket und wähle <b>Erstattung anfordern</b>.`),
       a5:P(`Auf Android steckt dein Fortschritt in der Google-Sicherung deines Handys. Melde dich auf dem neuen Handy mit demselben Google-Konto an, stell deine Sicherung wieder her, wenn du gefragt wirst, und installiere dann Monkey Vine Rush. Dein Fortschritt kommt von allein zurück.`) },
  es:{ a3:P(`En Android, abre la app Google Play Store, toca tu foto de perfil y luego ${PATH('Ajustes › Autenticación › Solicitar autenticación para realizar compras')} y elige <b>Para todas las compras</b>. Los padres también pueden usar <b>Google Family Link</b>.`),
       a4:P(`En Android, Google gestiona los pagos y los reembolsos. Ve a <a href="${REFUND}">play.google.com/store/account/orderhistory</a>, inicia sesión con la cuenta de Google que hizo la compra, busca el paquete de monedas y elige <b>Solicitar un reembolso</b>.`),
       a5:P(`En Android, tu progreso se guarda en la copia de seguridad de Google de tu móvil. En el móvil nuevo, inicia sesión con la misma cuenta de Google y restaura la copia cuando te lo pida; después instala Monkey Vine Rush. Tu progreso vuelve solo.`) },
  fr:{ a3:P(`Sur Android, ouvre l'app Google Play Store, touche ta photo de profil, puis ${PATH('Paramètres › Authentification › Exiger une authentification pour les achats')} et choisis <b>Pour tous les achats</b>. Les parents peuvent aussi utiliser <b>Google Family Link</b>.`),
       a4:P(`Sur Android, Google gère les paiements et les remboursements. Va sur <a href="${REFUND}">play.google.com/store/account/orderhistory</a>, connecte-toi avec le compte Google qui a fait l'achat, trouve le pack de pièces et choisis <b>Demander un remboursement</b>.`),
       a5:P(`Sur Android, ta progression est gardée dans la sauvegarde Google de ton téléphone. Sur le nouveau téléphone, connecte-toi avec le même compte Google et restaure ta sauvegarde quand on te le propose, puis installe Monkey Vine Rush. Ta progression revient toute seule.`) },
  id:{ a3:P(`Di Android, buka aplikasi Google Play Store, ketuk foto profilmu, lalu ${PATH('Setelan › Autentikasi › Wajibkan autentikasi untuk pembelian')} dan pilih <b>Untuk semua pembelian</b>. Orang tua juga bisa memakai <b>Google Family Link</b>.`),
       a4:P(`Di Android, Google yang mengurus pembayaran dan pengembalian dana. Buka <a href="${REFUND}">play.google.com/store/account/orderhistory</a>, masuk dengan Akun Google yang melakukan pembelian, cari paket koinnya, lalu pilih <b>Minta pengembalian dana</b>.`),
       a5:P(`Di Android, progresmu disimpan di cadangan Google ponselmu. Di ponsel baru, masuk dengan Akun Google yang sama dan pulihkan cadanganmu saat diminta, lalu pasang Monkey Vine Rush. Progresmu kembali dengan sendirinya.`) },
  it:{ a3:P(`Su Android, apri l'app Google Play Store, tocca la tua immagine del profilo, poi ${PATH('Impostazioni › Autenticazione › Richiedi l\'autenticazione per gli acquisti')} e scegli <b>Per tutti gli acquisti</b>. I genitori possono usare anche <b>Google Family Link</b>.`),
       a4:P(`Su Android, pagamenti e rimborsi sono gestiti da Google. Vai su <a href="${REFUND}">play.google.com/store/account/orderhistory</a>, accedi con l'account Google che ha fatto l'acquisto, trova il pacchetto di monete e scegli <b>Richiedi un rimborso</b>.`),
       a5:P(`Su Android, i tuoi progressi sono salvati nel backup Google del telefono. Sul nuovo telefono, accedi con lo stesso account Google e ripristina il backup quando ti viene chiesto, poi installa Monkey Vine Rush. I tuoi progressi tornano da soli.`) },
  ja:{ a3:P(`Android では、Google Play ストアアプリを開き、プロフィール写真をタップして ${PATH('設定 › 認証 › 購入時には認証を必要とする')} を開き、<b>すべての購入</b>を選びます。保護者の方は <b>Google ファミリー リンク</b>も使えます。`),
       a4:P(`Android では、支払いと払い戻しは Google が扱います。<a href="${REFUND}">play.google.com/store/account/orderhistory</a> を開き、購入した Google アカウントでログインして、コインパックを探し、<b>払い戻しをリクエスト</b>を選びます。`),
       a5:P(`Android では、進行状況はスマホの Google バックアップに保存されます。新しいスマホで同じ Google アカウントにログインし、案内に従ってバックアップを復元してから Monkey Vine Rush をインストールしてください。進行状況は自動で戻ります。`) },
  ko:{ a3:P(`Android에서는 Google Play 스토어 앱을 열고 프로필 사진을 탭한 다음 ${PATH('설정 › 인증 › 구매 시 인증 필요')}에서 <b>모든 구매</b>를 선택하세요. 부모님은 <b>Google Family Link</b>도 사용할 수 있어요.`),
       a4:P(`Android에서는 결제와 환불을 Google이 처리해요. <a href="${REFUND}">play.google.com/store/account/orderhistory</a>로 가서 구매한 Google 계정으로 로그인한 뒤, 코인 팩을 찾아 <b>환불 요청</b>을 선택하세요.`),
       a5:P(`Android에서는 진행 상황이 휴대폰의 Google 백업에 저장돼요. 새 휴대폰에서 같은 Google 계정으로 로그인하고 안내가 나오면 백업을 복원한 다음 Monkey Vine Rush를 설치하세요. 진행 상황이 저절로 돌아와요.`) },
  nl:{ a3:P(`Op Android open je de Google Play Store-app, tik je op je profielfoto en dan op ${PATH('Instellingen › Verificatie › Verificatie vereisen voor aankopen')} en kies je <b>Voor alle aankopen</b>. Ouders kunnen ook <b>Google Family Link</b> gebruiken.`),
       a4:P(`Op Android regelt Google betalingen en terugbetalingen. Ga naar <a href="${REFUND}">play.google.com/store/account/orderhistory</a>, log in met het Google-account waarmee je kocht, zoek het muntenpakket en kies <b>Terugbetaling aanvragen</b>.`),
       a5:P(`Op Android staat je voortgang in de Google-back-up van je telefoon. Log op de nieuwe telefoon in met hetzelfde Google-account, zet je back-up terug als daarom gevraagd wordt en installeer daarna Monkey Vine Rush. Je voortgang komt vanzelf terug.`) },
  pl:{ a3:P(`Na Androidzie otwórz aplikację Sklep Google Play, kliknij swoje zdjęcie profilowe, potem ${PATH('Ustawienia › Uwierzytelnianie › Wymagaj uwierzytelniania przy zakupach')} i wybierz <b>Przy wszystkich zakupach</b>. Rodzice mogą też korzystać z <b>Google Family Link</b>.`),
       a4:P(`Na Androidzie płatnościami i zwrotami zajmuje się Google. Wejdź na <a href="${REFUND}">play.google.com/store/account/orderhistory</a>, zaloguj się kontem Google, z którego kupiono, znajdź pakiet monet i wybierz <b>Poproś o zwrot środków</b>.`),
       a5:P(`Na Androidzie postępy są zapisane w kopii zapasowej Google na telefonie. Na nowym telefonie zaloguj się tym samym kontem Google i przywróć kopię, gdy pojawi się pytanie, a potem zainstaluj Monkey Vine Rush. Postępy wrócą same.`) },
  pt:{ a3:P(`No Android, abra o app Google Play Store, toque na sua foto de perfil e depois em ${PATH('Configurações › Autenticação › Exigir autenticação para compras')} e escolha <b>Para todas as compras</b>. Os pais também podem usar o <b>Google Family Link</b>.`),
       a4:P(`No Android, o Google cuida dos pagamentos e reembolsos. Acesse <a href="${REFUND}">play.google.com/store/account/orderhistory</a>, entre com a Conta do Google que fez a compra, encontre o pacote de moedas e escolha <b>Solicitar reembolso</b>.`),
       a5:P(`No Android, seu progresso fica no backup do Google do celular. No celular novo, entre com a mesma Conta do Google e restaure o backup quando for pedido, depois instale Monkey Vine Rush. Seu progresso volta sozinho.`) },
  ru:{ a3:P(`На Android откройте приложение Google Play Маркет, нажмите на фото профиля, затем ${PATH('Настройки › Аутентификация › Аутентификация при покупке')} и выберите <b>Для всех покупок</b>. Родители также могут использовать <b>Google Family Link</b>.`),
       a4:P(`На Android платежами и возвратами занимается Google. Откройте <a href="${REFUND}">play.google.com/store/account/orderhistory</a>, войдите в аккаунт Google, с которого была покупка, найдите набор монет и выберите <b>Запросить возврат средств</b>.`),
       a5:P(`На Android прогресс хранится в резервной копии Google на телефоне. На новом телефоне войдите в тот же аккаунт Google и восстановите резервную копию, когда это предложат, затем установите Monkey Vine Rush. Прогресс вернётся сам.`) },
  sv:{ a3:P(`På Android öppnar du appen Google Play Butik, trycker på din profilbild och sedan ${PATH('Inställningar › Autentisering › Kräv autentisering vid köp')} och väljer <b>För alla köp</b>. Föräldrar kan också använda <b>Google Family Link</b>.`),
       a4:P(`På Android sköter Google betalningar och återbetalningar. Gå till <a href="${REFUND}">play.google.com/store/account/orderhistory</a>, logga in med Google-kontot som gjorde köpet, hitta myntpaketet och välj <b>Begär återbetalning</b>.`),
       a5:P(`På Android sparas dina framsteg i mobilens Google-säkerhetskopia. Logga in på den nya mobilen med samma Google-konto och återställ säkerhetskopian när du får frågan, installera sedan Monkey Vine Rush. Dina framsteg kommer tillbaka av sig själva.`) },
  tr:{ a3:P(`Android'de Google Play Store uygulamasını aç, profil fotoğrafına dokun, sonra ${PATH('Ayarlar › Kimlik doğrulama › Satın alma işlemleri için kimlik doğrulama gerekir')} yolunu izle ve <b>Tüm satın alma işlemleri için</b> seçeneğini seç. Ebeveynler <b>Google Family Link</b> de kullanabilir.`),
       a4:P(`Android'de ödemeleri ve iadeleri Google yürütür. <a href="${REFUND}">play.google.com/store/account/orderhistory</a> adresine git, satın alımı yapan Google Hesabı ile giriş yap, jeton paketini bul ve <b>Para iadesi iste</b>'yi seç.`),
       a5:P(`Android'de ilerlemen telefonunun Google yedeğinde saklanır. Yeni telefonda aynı Google Hesabı ile giriş yap, sorulduğunda yedeğini geri yükle, sonra Monkey Vine Rush'ı yükle. İlerlemen kendiliğinden geri gelir.`) },
  'zh-TW':{ a3:P(`在 Android 上，打開 Google Play 商店 App，點一下你的個人資料相片，然後前往 ${PATH('設定 › 驗證 › 購買時需要驗證')}，並選擇<b>所有購買交易</b>。家長也可以使用 <b>Google Family Link</b>。`),
       a4:P(`在 Android 上，付款和退款由 Google 處理。前往 <a href="${REFUND}">play.google.com/store/account/orderhistory</a>，用購買時的 Google 帳戶登入，找到金幣包並選擇<b>要求退款</b>。`),
       a5:P(`在 Android 上，你的進度會存在手機的 Google 備份裡。在新手機上用同一個 Google 帳戶登入，出現提示時還原備份，然後安裝 Monkey Vine Rush。進度會自動回來。`) },
  zh:{ a3:P(`在 Android 上，打开 Google Play 商店应用，点按你的个人资料照片，然后前往 ${PATH('设置 › 身份验证 › 购买时需要进行身份验证')}，并选择<b>所有购买交易</b>。家长也可以使用 <b>Google Family Link</b>。`),
       a4:P(`在 Android 上，付款和退款由 Google 处理。前往 <a href="${REFUND}">play.google.com/store/account/orderhistory</a>，用购买时的 Google 账号登录，找到金币包并选择<b>申请退款</b>。`),
       a5:P(`在 Android 上，你的进度保存在手机的 Google 备份中。在新手机上用同一个 Google 账号登录，出现提示时恢复备份，然后安装 Monkey Vine Rush。进度会自动回来。`) },
};

let changed = 0;
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const lang = f.replace('.json', ''), file = path.join(DIR, f), j = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const k of KEYS) { if (typeof j[k] !== 'string') continue;
    for (const [a, b] of SWAP[lang] || []) if (j[k].includes(a) && !j[k].includes(b)) { j[k] = j[k].split(a).join(b); changed++; } }
  if (!j.badge_play_alt) { j.badge_play_alt = BADGE[lang] || BADGE.en; changed++; }
  if (j.legal && !j.legal.includes('Google Play')) { j.legal += ' ' + (TM[lang] || TM.en); changed++; }
  const A = ANDROID[lang] || ANDROID.en;
  if (j.a3 && !j.a3.includes('Google Play')) { const i = j.a3.indexOf('</p>') + 4; j.a3 = j.a3.slice(0, i) + A.a3 + j.a3.slice(i); changed++; }
  if (j.a4 && !j.a4.includes(REFUND)) { j.a4 += A.a4; changed++; }
  if (j.a5 && !j.a5.includes('Google')) { j.a5 += A.a5; changed++; }
  fs.writeFileSync(file, JSON.stringify(j, null, 2) + '\n');
}
console.log('changes made:', changed);
