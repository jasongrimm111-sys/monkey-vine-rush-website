// One-off (8 Nov 2026): the privacy policy covers Google Play (Android backup) and the Microsoft Store as well as the App Store.
// Replaces store-specific phrases in every language; fails loudly if a phrase is missing so nothing is half-done.
const fs = require('fs'), path = require('path');
const D = path.join(__dirname, 'i18n');

// [key, old, new] phrase swaps per language, plus the new Android and Windows paragraphs appended to "choices"
const T = {
en: { upd: 'Last updated 8 November 2026', swaps: [
  ['sum_3', 'go through Apple or Google,', 'go through Apple, Google or Microsoft,'],
  ['stores', 'In the app store versions, this copy is kept in your own iCloud or Google Play Games account instead.', "In the app store versions, this copy is kept by your device's own service instead: your iCloud on iPhone and iPad, or your Google backup on Android. In the Microsoft Store version on Windows, your progress stays on your PC."],
  ['purchases', 'through the App Store or Google Play.', 'through the App Store, Google Play or the Microsoft Store.'],
  ['purchases', 'handled by Apple or Google under their own terms', 'handled by Apple, Google or Microsoft under their own terms'],
  ['purchases', 'Refunds are handled by Apple or Google', 'Refunds are handled by Apple, Google or Microsoft'],
  ['basis', '(Apple or Google process the payment)', '(Apple, Google or Microsoft process the payment)'],
  ['security', 'in your own iCloud or Google Play Games account, protected by', 'in your own iCloud or Google backup if you use one, protected by'],
  ['marks', 'Apple and Google are named only to explain how app store payments work', 'Apple, Google and Microsoft are named only to explain how app store payments and backups work'],
 ], android: "<b>Android (Google Play):</b> if your phone's Google backup is on, your progress is also saved in your own backup, so it comes back on a new phone or if you reinstall the app. You can turn this off in your phone's backup settings. Google Play Games scores are kept by Google. You can see or delete your Google data at <a href=\"https://myaccount.google.com/\">myaccount.google.com</a>.",
 windows: "<b>Windows (Microsoft Store):</b> your progress is saved on your PC only. You can see or delete your Microsoft data at <a href=\"https://account.microsoft.com/privacy\">account.microsoft.com/privacy</a>." },

de: { upd: 'Zuletzt aktualisiert am 8. November 2026', swaps: [
  ['sum_3', 'laufen über Apple oder Google', 'laufen über Apple, Google oder Microsoft'],
  ['stores', 'In den App-Store-Versionen wird diese Kopie stattdessen in deinem eigenen iCloud- oder Google Play Spiele-Konto gespeichert.', 'In den App-Store-Versionen wird diese Kopie stattdessen vom Dienst deines Geräts gespeichert: in deiner iCloud auf iPhone und iPad oder in deiner Google-Sicherung auf Android. In der Microsoft Store-Version unter Windows bleibt dein Fortschritt auf deinem PC.'],
  ['purchases', 'über den App Store oder Google Play.', 'über den App Store, Google Play oder den Microsoft Store.'],
  ['purchases', 'Zahlungen werden von Apple oder Google', 'Zahlungen werden von Apple, Google oder Microsoft'],
  ['purchases', 'Rückerstattungen werden von Apple oder Google', 'Rückerstattungen werden von Apple, Google oder Microsoft'],
  ['basis', '(die Zahlung verarbeiten Apple oder Google)', '(die Zahlung verarbeiten Apple, Google oder Microsoft)'],
  ['security', 'in deinem eigenen iCloud- oder Google Play Spiele-Konto, geschützt', 'in deiner eigenen iCloud oder Google-Sicherung, falls du eine nutzt, geschützt'],
  ['marks', 'Apple und Google werden nur genannt, um zu erklären, wie Zahlungen in den App-Stores funktionieren', 'Apple, Google und Microsoft werden nur genannt, um zu erklären, wie Zahlungen und Sicherungen in den App-Stores funktionieren'],
 ], android: '<b>Android (Google Play):</b> Wenn die Google-Sicherung deines Handys eingeschaltet ist, wird dein Fortschritt auch in deiner eigenen Sicherung gespeichert und ist auf einem neuen Handy oder nach einer Neuinstallation wieder da. Du kannst das in den Sicherungseinstellungen deines Handys ausschalten. Google Play Spiele-Bestenlisten werden von Google gespeichert. Du kannst deine Google-Daten unter <a href="https://myaccount.google.com/">myaccount.google.com</a> einsehen oder löschen.',
 windows: '<b>Windows (Microsoft Store):</b> Dein Fortschritt wird nur auf deinem PC gespeichert. Du kannst deine Microsoft-Daten unter <a href="https://account.microsoft.com/privacy">account.microsoft.com/privacy</a> einsehen oder löschen.' },

es: { upd: 'Última actualización: 8 de noviembre de 2026', swaps: [
  ['sum_3', 'Apple o Google', 'Apple, Google o Microsoft'],
  ['stores', 'En las versiones de las tiendas de apps, esta copia se guarda en tu propia cuenta de iCloud o de Google Play Juegos.', 'En las versiones de las tiendas de apps, esta copia la guarda el propio servicio de tu dispositivo: tu iCloud en iPhone y iPad, o tu copia de seguridad de Google en Android. En la versión de Microsoft Store para Windows, tu progreso se queda en tu PC.'],
  ['purchases', 'a través del App Store o Google Play.', 'a través del App Store, Google Play o Microsoft Store.'],
  ['purchases', 'Apple o Google gestionan los pagos', 'Apple, Google o Microsoft gestionan los pagos'],
  ['purchases', 'Apple o Google gestionan los reembolsos', 'Apple, Google o Microsoft gestionan los reembolsos'],
  ['basis', '(Apple o Google procesan el pago)', '(Apple, Google o Microsoft procesan el pago)'],
  ['security', 'en tu propia cuenta de iCloud o Google Play Juegos, protegido', 'en tu propio iCloud o copia de seguridad de Google si usas una, protegido'],
  ['marks', 'Apple y Google se mencionan solo para explicar cómo funcionan los pagos en las tiendas de apps', 'Apple, Google y Microsoft se mencionan solo para explicar cómo funcionan los pagos y las copias de seguridad en las tiendas de apps'],
 ], android: '<b>Android (Google Play):</b> si la copia de seguridad de Google de tu móvil está activada, tu progreso también se guarda en tu propia copia, así que vuelve en un móvil nuevo o si reinstalas la app. Puedes desactivarlo en los ajustes de copia de seguridad del móvil. Google guarda las clasificaciones de Google Play Juegos. Puedes ver o borrar tus datos de Google en <a href="https://myaccount.google.com/">myaccount.google.com</a>.',
 windows: '<b>Windows (Microsoft Store):</b> tu progreso se guarda solo en tu PC. Puedes ver o borrar tus datos de Microsoft en <a href="https://account.microsoft.com/privacy">account.microsoft.com/privacy</a>.' },

fr: { upd: 'Dernière mise à jour : 8 novembre 2026', swaps: [
  ['sum_3', 'Apple ou Google', 'Apple, Google ou Microsoft'],
  ['stores', "Dans les versions des boutiques d'apps, cette copie est conservée à la place dans ton propre compte iCloud ou Google Play Jeux.", "Dans les versions des boutiques d'apps, cette copie est conservée par le service de ton appareil : ton iCloud sur iPhone et iPad, ou ta sauvegarde Google sur Android. Dans la version Microsoft Store sur Windows, ta progression reste sur ton PC."],
  ['purchases', "via l'App Store ou Google Play.", "via l'App Store, Google Play ou le Microsoft Store."],
  ['purchases', 'Les paiements sont gérés par Apple ou Google', 'Les paiements sont gérés par Apple, Google ou Microsoft'],
  ['purchases', 'Les remboursements sont gérés par Apple ou Google', 'Les remboursements sont gérés par Apple, Google ou Microsoft'],
  ['basis', '(Apple ou Google traitent le paiement)', '(Apple, Google ou Microsoft traitent le paiement)'],
  ['security', 'dans ton propre compte iCloud ou Google Play Jeux, protégée', 'dans ton propre iCloud ou ta sauvegarde Google si tu en utilises une, protégée'],
  ['marks', "Apple et Google sont cités uniquement pour expliquer le fonctionnement des paiements dans les boutiques d'apps", "Apple, Google et Microsoft sont cités uniquement pour expliquer le fonctionnement des paiements et des sauvegardes dans les boutiques d'apps"],
 ], android: '<b>Android (Google Play) :</b> si la sauvegarde Google de ton téléphone est activée, ta progression est aussi enregistrée dans ta propre sauvegarde, et elle revient sur un nouveau téléphone ou si tu réinstalles l’app. Tu peux la désactiver dans les réglages de sauvegarde de ton téléphone. Les classements Google Play Jeux sont conservés par Google. Tu peux voir ou supprimer tes données Google sur <a href="https://myaccount.google.com/">myaccount.google.com</a>.',
 windows: '<b>Windows (Microsoft Store) :</b> ta progression est enregistrée uniquement sur ton PC. Tu peux voir ou supprimer tes données Microsoft sur <a href="https://account.microsoft.com/privacy">account.microsoft.com/privacy</a>.' },

id: { upd: 'Terakhir diperbarui 8 November 2026', swaps: [
  ['sum_3', 'Apple atau Google', 'Apple, Google, atau Microsoft'],
  ['stores', 'Di versi toko aplikasi, salinan ini disimpan di akun iCloud atau Google Play Game milikmu sendiri.', 'Di versi toko aplikasi, salinan ini disimpan oleh layanan perangkatmu sendiri: iCloud-mu di iPhone dan iPad, atau cadangan Google-mu di Android. Di versi Microsoft Store untuk Windows, progresmu tetap di PC-mu.'],
  ['purchases', 'melalui App Store atau Google Play.', 'melalui App Store, Google Play, atau Microsoft Store.'],
  ['purchases', 'Pembayaran ditangani oleh Apple atau Google', 'Pembayaran ditangani oleh Apple, Google, atau Microsoft'],
  ['purchases', 'Pengembalian dana ditangani oleh Apple atau Google', 'Pengembalian dana ditangani oleh Apple, Google, atau Microsoft'],
  ['basis', '(pembayaran diproses oleh Apple atau Google)', '(pembayaran diproses oleh Apple, Google, atau Microsoft)'],
  ['security', 'di akun iCloud atau Google Play Game milikmu, dilindungi', 'di iCloud atau cadangan Google milikmu jika kamu memakainya, dilindungi'],
  ['marks', 'Apple dan Google disebut hanya untuk menjelaskan cara kerja pembayaran di toko aplikasi', 'Apple, Google, dan Microsoft disebut hanya untuk menjelaskan cara kerja pembayaran dan pencadangan di toko aplikasi'],
 ], android: '<b>Android (Google Play):</b> jika cadangan Google di ponselmu aktif, progresmu juga disimpan di cadanganmu sendiri, jadi akan kembali di ponsel baru atau jika kamu memasang ulang aplikasi. Kamu bisa mematikannya di pengaturan cadangan ponselmu. Skor Google Play Game disimpan oleh Google. Kamu bisa melihat atau menghapus data Google-mu di <a href="https://myaccount.google.com/">myaccount.google.com</a>.',
 windows: '<b>Windows (Microsoft Store):</b> progresmu hanya disimpan di PC-mu. Kamu bisa melihat atau menghapus data Microsoft-mu di <a href="https://account.microsoft.com/privacy">account.microsoft.com/privacy</a>.' },

it: { upd: 'Ultimo aggiornamento: 8 novembre 2026', swaps: [
  ['sum_3', 'Apple o Google', 'Apple, Google o Microsoft'],
  ['stores', 'Nelle versioni degli store di app, questa copia è conservata invece nel tuo account iCloud o Google Play Giochi.', 'Nelle versioni degli store di app, questa copia è conservata invece dal servizio del tuo dispositivo: il tuo iCloud su iPhone e iPad, o il tuo backup Google su Android. Nella versione Microsoft Store per Windows, i tuoi progressi restano sul tuo PC.'],
  ['purchases', 'tramite App Store o Google Play.', 'tramite App Store, Google Play o Microsoft Store.'],
  ['purchases', 'I pagamenti sono gestiti da Apple o Google', 'I pagamenti sono gestiti da Apple, Google o Microsoft'],
  ['purchases', 'I rimborsi sono gestiti da Apple o Google', 'I rimborsi sono gestiti da Apple, Google o Microsoft'],
  ['basis', '(il pagamento è elaborato da Apple o Google)', '(il pagamento è elaborato da Apple, Google o Microsoft)'],
  ['security', 'nel tuo account iCloud o Google Play Giochi, protetti', 'nel tuo iCloud o backup Google se ne usi uno, protetti'],
  ['marks', 'Apple e Google sono citati solo per spiegare come funzionano i pagamenti negli store di app', 'Apple, Google e Microsoft sono citati solo per spiegare come funzionano i pagamenti e i backup negli store di app'],
 ], android: '<b>Android (Google Play):</b> se il backup Google del tuo telefono è attivo, i tuoi progressi vengono salvati anche nel tuo backup, così tornano su un nuovo telefono o se reinstalli l’app. Puoi disattivarlo nelle impostazioni di backup del telefono. Le classifiche di Google Play Giochi sono conservate da Google. Puoi vedere o eliminare i tuoi dati Google su <a href="https://myaccount.google.com/">myaccount.google.com</a>.',
 windows: '<b>Windows (Microsoft Store):</b> i tuoi progressi sono salvati solo sul tuo PC. Puoi vedere o eliminare i tuoi dati Microsoft su <a href="https://account.microsoft.com/privacy">account.microsoft.com/privacy</a>.' },

ja: { upd: '最終更新日：2026年11月8日', swaps: [
  ['sum_3', 'Apple または Google', 'Apple、Google または Microsoft'],
  ['stores', 'アプリストア版では、このコピーは代わりにあなた自身の iCloud または Google Play ゲームのアカウントに保存されます。', 'アプリストア版では、このコピーは代わりにデバイス自身のサービスに保存されます。iPhone と iPad ではあなたの iCloud、Android ではあなたの Google バックアップです。Windows の Microsoft Store 版では、進行状況はあなたの PC にのみ残ります。'],
  ['purchases', 'App Store または Google Play を通じた', 'App Store、Google Play または Microsoft Store を通じた'],
  ['purchases', '支払いは、Apple または Google が', '支払いは、Apple、Google または Microsoft が'],
  ['purchases', '返金は、Apple または Google が', '返金は、Apple、Google または Microsoft が'],
  ['basis', '（支払いは Apple または Google が処理します）', '（支払いは Apple、Google または Microsoft が処理します）'],
  ['security', 'あなた自身の iCloud または Google Play ゲームのアカウントに保存され', 'ご利用の場合はあなた自身の iCloud または Google バックアップに保存され'],
  ['marks', 'Apple と Google の名称は、アプリストアでの支払いの仕組みを説明するためにのみ', 'Apple、Google、Microsoft の名称は、アプリストアでの支払いとバックアップの仕組みを説明するためにのみ'],
 ], android: '<b>Android（Google Play）：</b>スマートフォンの Google バックアップがオンの場合、進行状況はあなた自身のバックアップにも保存されるため、新しいスマートフォンやアプリの再インストール時に戻ってきます。スマートフォンのバックアップ設定でオフにできます。Google Play ゲームのランキングは Google が保管します。Google のデータは <a href="https://myaccount.google.com/">myaccount.google.com</a> で確認・削除できます。',
 windows: '<b>Windows（Microsoft Store）：</b>進行状況はあなたの PC にのみ保存されます。Microsoft のデータは <a href="https://account.microsoft.com/privacy">account.microsoft.com/privacy</a> で確認・削除できます。' },

ko: { upd: '최종 업데이트: 2026년 11월 8일', swaps: [
  ['sum_3', 'Apple 또는 Google', 'Apple, Google 또는 Microsoft'],
  ['stores', '앱 스토어 버전에서는 이 사본이 대신 내 iCloud 또는 Google Play 게임즈 계정에 보관돼요.', '앱 스토어 버전에서는 이 사본이 대신 기기 자체 서비스에 보관돼요. iPhone과 iPad에서는 내 iCloud, Android에서는 내 Google 백업이에요. Windows용 Microsoft Store 버전에서는 진행 상황이 내 PC에만 남아요.'],
  ['purchases', 'App Store 또는 Google Play를 통한', 'App Store, Google Play 또는 Microsoft Store를 통한'],
  ['purchases', '결제는 Apple 또는 Google이', '결제는 Apple, Google 또는 Microsoft가'],
  ['purchases', '환불은 Apple 또는 Google이', '환불은 Apple, Google 또는 Microsoft가'],
  ['basis', '(결제는 Apple 또는 Google이 처리해요)', '(결제는 Apple, Google 또는 Microsoft가 처리해요)'],
  ['security', '여러분의 iCloud 또는 Google Play 게임즈 계정에 저장되며', '사용하는 경우 여러분의 iCloud 또는 Google 백업에 저장되며'],
  ['marks', 'Apple과 Google은 앱 스토어 결제 방식을 설명하기 위해서만', 'Apple, Google, Microsoft는 앱 스토어 결제와 백업 방식을 설명하기 위해서만'],
 ], android: '<b>Android(Google Play):</b> 휴대폰의 Google 백업이 켜져 있으면 진행 상황이 내 백업에도 저장되어, 새 휴대폰이나 앱을 다시 설치할 때 돌아와요. 휴대폰의 백업 설정에서 끌 수 있어요. Google Play 게임즈 순위는 Google이 보관해요. Google 데이터는 <a href="https://myaccount.google.com/">myaccount.google.com</a>에서 확인하거나 삭제할 수 있어요.',
 windows: '<b>Windows(Microsoft Store):</b> 진행 상황은 내 PC에만 저장돼요. Microsoft 데이터는 <a href="https://account.microsoft.com/privacy">account.microsoft.com/privacy</a>에서 확인하거나 삭제할 수 있어요.' },

nl: { upd: 'Laatst bijgewerkt op 8 november 2026', swaps: [
  ['sum_3', 'Apple of Google', 'Apple, Google of Microsoft'],
  ['stores', 'In de appstore-versies wordt deze kopie in plaats daarvan in je eigen iCloud- of Google Play Games-account bewaard.', 'In de appstore-versies wordt deze kopie in plaats daarvan bewaard door de eigen dienst van je apparaat: je iCloud op iPhone en iPad, of je Google-back-up op Android. In de Microsoft Store-versie op Windows blijft je voortgang op je pc.'],
  ['purchases', 'via de App Store of Google Play.', 'via de App Store, Google Play of de Microsoft Store.'],
  ['purchases', 'Betalingen worden afgehandeld door Apple of Google', 'Betalingen worden afgehandeld door Apple, Google of Microsoft'],
  ['purchases', 'Terugbetalingen worden afgehandeld door Apple of Google', 'Terugbetalingen worden afgehandeld door Apple, Google of Microsoft'],
  ['basis', '(Apple of Google verwerken de betaling)', '(Apple, Google of Microsoft verwerken de betaling)'],
  ['security', 'in je eigen iCloud- of Google Play Games-account, beschermd', 'in je eigen iCloud of Google-back-up als je die gebruikt, beschermd'],
  ['marks', 'Apple en Google worden alleen genoemd om uit te leggen hoe betalingen in appstores werken', 'Apple, Google en Microsoft worden alleen genoemd om uit te leggen hoe betalingen en back-ups in appstores werken'],
 ], android: '<b>Android (Google Play):</b> als de Google-back-up van je telefoon aanstaat, wordt je voortgang ook in je eigen back-up opgeslagen, zodat hij terugkomt op een nieuwe telefoon of als je de app opnieuw installeert. Je kunt dit uitzetten in de back-upinstellingen van je telefoon. Ranglijsten van Google Play Games worden door Google bewaard. Je kunt je Google-gegevens bekijken of verwijderen op <a href="https://myaccount.google.com/">myaccount.google.com</a>.',
 windows: '<b>Windows (Microsoft Store):</b> je voortgang wordt alleen op je pc opgeslagen. Je kunt je Microsoft-gegevens bekijken of verwijderen op <a href="https://account.microsoft.com/privacy">account.microsoft.com/privacy</a>.' },

pl: { upd: 'Ostatnia aktualizacja: 8 listopada 2026', swaps: [
  ['sum_3', 'Apple lub Google', 'Apple, Google lub Microsoft'],
  ['stores', 'W wersjach ze sklepów z aplikacjami ta kopia jest zamiast tego przechowywana na twoim własnym koncie iCloud lub Gry Google Play.', 'W wersjach ze sklepów z aplikacjami ta kopia jest zamiast tego przechowywana przez usługę twojego urządzenia: w twoim iCloud na iPhonie i iPadzie lub w twojej kopii zapasowej Google na Androidzie. W wersji z Microsoft Store na Windows twoje postępy zostają na twoim komputerze.'],
  ['purchases', 'przez App Store lub Google Play.', 'przez App Store, Google Play lub Microsoft Store.'],
  ['purchases', 'Płatności obsługuje Apple lub Google', 'Płatności obsługuje Apple, Google lub Microsoft'],
  ['purchases', 'Zwrotami zajmuje się Apple lub Google', 'Zwrotami zajmuje się Apple, Google lub Microsoft'],
  ['basis', '(płatność przetwarza Apple lub Google)', '(płatność przetwarza Apple, Google lub Microsoft)'],
  ['security', 'na twoim własnym koncie iCloud lub Gry Google Play, chronione', 'w twoim własnym iCloud lub kopii zapasowej Google, jeśli jej używasz, chronione'],
  ['marks', 'Apple i Google są wymienione wyłącznie, by wyjaśnić, jak działają płatności w sklepach z aplikacjami', 'Apple, Google i Microsoft są wymienione wyłącznie, by wyjaśnić, jak działają płatności i kopie zapasowe w sklepach z aplikacjami'],
 ], android: '<b>Android (Google Play):</b> jeśli kopia zapasowa Google na twoim telefonie jest włączona, twoje postępy są też zapisywane w twojej kopii, więc wrócą na nowym telefonie lub po ponownej instalacji aplikacji. Możesz to wyłączyć w ustawieniach kopii zapasowej telefonu. Rankingi Gier Google Play przechowuje Google. Swoje dane Google możesz zobaczyć lub usunąć na <a href="https://myaccount.google.com/">myaccount.google.com</a>.',
 windows: '<b>Windows (Microsoft Store):</b> twoje postępy są zapisywane tylko na twoim komputerze. Swoje dane Microsoft możesz zobaczyć lub usunąć na <a href="https://account.microsoft.com/privacy">account.microsoft.com/privacy</a>.' },

pt: { upd: 'Última atualização: 8 de novembro de 2026', swaps: [
  ['sum_3', 'pela Apple ou pelo Google', 'pela Apple, pelo Google ou pela Microsoft'],
  ['stores', 'Nas versões das lojas de apps, essa cópia fica no seu próprio iCloud ou na sua conta do Google Play Games.', 'Nas versões das lojas de apps, essa cópia fica no serviço do próprio aparelho: seu iCloud no iPhone e iPad, ou seu backup do Google no Android. Na versão da Microsoft Store para Windows, seu progresso fica no seu PC.'],
  ['purchases', 'pela App Store ou pelo Google Play.', 'pela App Store, pelo Google Play ou pela Microsoft Store.'],
  ['purchases', 'Os pagamentos são processados pela Apple ou pelo Google', 'Os pagamentos são processados pela Apple, pelo Google ou pela Microsoft'],
  ['purchases', 'Os reembolsos são tratados pela Apple ou pelo Google', 'Os reembolsos são tratados pela Apple, pelo Google ou pela Microsoft'],
  ['basis', '(a Apple ou o Google processam o pagamento)', '(a Apple, o Google ou a Microsoft processam o pagamento)'],
  ['security', 'na sua própria conta do iCloud ou do Google Play Games, protegido', 'no seu próprio iCloud ou backup do Google, se você usar um, protegido'],
  ['marks', 'Apple e Google são citados apenas para explicar como funcionam os pagamentos nas lojas de apps', 'Apple, Google e Microsoft são citados apenas para explicar como funcionam os pagamentos e backups nas lojas de apps'],
 ], android: '<b>Android (Google Play):</b> se o backup do Google do seu celular estiver ativado, seu progresso também fica salvo no seu próprio backup e volta em um celular novo ou se você reinstalar o app. Você pode desativar isso nas configurações de backup do celular. Os placares do Google Play Games ficam com o Google. Você pode ver ou apagar seus dados do Google em <a href="https://myaccount.google.com/">myaccount.google.com</a>.',
 windows: '<b>Windows (Microsoft Store):</b> seu progresso fica salvo só no seu PC. Você pode ver ou apagar seus dados da Microsoft em <a href="https://account.microsoft.com/privacy">account.microsoft.com/privacy</a>.' },

ru: { upd: 'Последнее обновление: 8 ноября 2026 г.', swaps: [
  ['sum_3', 'Apple или Google', 'Apple, Google или Microsoft'],
  ['stores', 'В версиях из магазинов приложений эта копия хранится в твоём собственном аккаунте iCloud или Google Play Игры.', 'В версиях из магазинов приложений эта копия хранится в собственной службе твоего устройства: в твоём iCloud на iPhone и iPad или в твоей резервной копии Google на Android. В версии из Microsoft Store для Windows твой прогресс остаётся на твоём ПК.'],
  ['purchases', 'через App Store или Google Play.', 'через App Store, Google Play или Microsoft Store.'],
  ['purchases', 'Платежи обрабатывают Apple или Google', 'Платежи обрабатывают Apple, Google или Microsoft'],
  ['purchases', 'Возвраты обрабатывают Apple или Google', 'Возвраты обрабатывают Apple, Google или Microsoft'],
  ['basis', '(оплату обрабатывает Apple или Google)', '(оплату обрабатывает Apple, Google или Microsoft)'],
  ['security', 'в твоём собственном аккаунте iCloud или Google Play Игры под защитой', 'в твоём собственном iCloud или резервной копии Google, если ты их используешь, под защитой'],
  ['marks', 'Apple и Google упоминаются только для объяснения того, как работают платежи в магазинах приложений', 'Apple, Google и Microsoft упоминаются только для объяснения того, как работают платежи и резервные копии в магазинах приложений'],
 ], android: '<b>Android (Google Play):</b> если на твоём телефоне включено резервное копирование Google, прогресс также сохраняется в твоей резервной копии и вернётся на новом телефоне или после переустановки приложения. Это можно отключить в настройках резервного копирования телефона. Таблицы лидеров Google Play Игры хранит Google. Посмотреть или удалить свои данные Google можно на <a href="https://myaccount.google.com/">myaccount.google.com</a>.',
 windows: '<b>Windows (Microsoft Store):</b> твой прогресс сохраняется только на твоём ПК. Посмотреть или удалить свои данные Microsoft можно на <a href="https://account.microsoft.com/privacy">account.microsoft.com/privacy</a>.' },

sv: { upd: 'Senast uppdaterad 8 november 2026', swaps: [
  ['sum_3', 'Apple eller Google', 'Apple, Google eller Microsoft'],
  ['stores', 'I appbutiksversionerna sparas den här kopian i stället i ditt eget iCloud- eller Google Play Spel-konto.', 'I appbutiksversionerna sparas den här kopian i stället av enhetens egen tjänst: ditt iCloud på iPhone och iPad, eller din Google-säkerhetskopia på Android. I Microsoft Store-versionen för Windows stannar dina framsteg på din dator.'],
  ['purchases', 'via App Store eller Google Play.', 'via App Store, Google Play eller Microsoft Store.'],
  ['purchases', 'Betalningar hanteras av Apple eller Google', 'Betalningar hanteras av Apple, Google eller Microsoft'],
  ['purchases', 'Återbetalningar hanteras av Apple eller Google', 'Återbetalningar hanteras av Apple, Google eller Microsoft'],
  ['basis', '(Apple eller Google hanterar betalningen)', '(Apple, Google eller Microsoft hanterar betalningen)'],
  ['security', 'i ditt eget iCloud- eller Google Play Spel-konto, skyddade', 'i ditt eget iCloud eller din Google-säkerhetskopia om du använder en, skyddade'],
  ['marks', 'Apple och Google nämns bara för att förklara hur betalningar i appbutiker fungerar', 'Apple, Google och Microsoft nämns bara för att förklara hur betalningar och säkerhetskopior i appbutiker fungerar'],
 ], android: '<b>Android (Google Play):</b> om telefonens Google-säkerhetskopiering är på sparas dina framsteg också i din egen säkerhetskopia, så de kommer tillbaka på en ny telefon eller om du installerar om appen. Du kan stänga av det i telefonens inställningar för säkerhetskopiering. Topplistorna i Google Play Spel sparas av Google. Du kan se eller radera dina Google-uppgifter på <a href="https://myaccount.google.com/">myaccount.google.com</a>.',
 windows: '<b>Windows (Microsoft Store):</b> dina framsteg sparas bara på din dator. Du kan se eller radera dina Microsoft-uppgifter på <a href="https://account.microsoft.com/privacy">account.microsoft.com/privacy</a>.' },

tr: { upd: 'Son güncelleme: 8 Kasım 2026', swaps: [
  ['sum_3', 'Apple veya Google', 'Apple, Google veya Microsoft'],
  ['stores', 'Uygulama mağazası sürümlerinde bu kopya bunun yerine kendi iCloud veya Google Play Oyunlar hesabında tutulur.', 'Uygulama mağazası sürümlerinde bu kopya bunun yerine cihazının kendi hizmetinde tutulur: iPhone ve iPad’de iCloud’unda, Android’de Google yedeğinde. Windows’taki Microsoft Store sürümünde ilerlemen bilgisayarında kalır.'],
  ['purchases', 'App Store veya Google Play üzerinden', 'App Store, Google Play veya Microsoft Store üzerinden'],
  ['purchases', 'Ödemeler Apple veya Google tarafından', 'Ödemeler Apple, Google veya Microsoft tarafından'],
  ['purchases', 'İadeler Apple veya Google tarafından', 'İadeler Apple, Google veya Microsoft tarafından'],
  ['basis', '(ödemeyi Apple veya Google işler)', '(ödemeyi Apple, Google veya Microsoft işler)'],
  ['security', 'kendi iCloud veya Google Play Oyunlar hesabında, Apple veya Google güvenliğiyle', 'kullanıyorsan kendi iCloud veya Google yedeğinde, Apple veya Google güvenliğiyle'],
  ['marks', 'Apple ve Google yalnızca uygulama mağazası ödemelerinin nasıl işlediğini açıklamak için anılmıştır', 'Apple, Google ve Microsoft yalnızca uygulama mağazası ödemelerinin ve yedeklemelerin nasıl işlediğini açıklamak için anılmıştır'],
 ], android: '<b>Android (Google Play):</b> telefonunun Google yedeklemesi açıksa ilerlemen kendi yedeğine de kaydedilir; böylece yeni bir telefonda ya da uygulamayı yeniden yüklediğinde geri gelir. Bunu telefonunun yedekleme ayarlarından kapatabilirsin. Google Play Oyunlar liderlik tablolarını Google saklar. Google verilerini <a href="https://myaccount.google.com/">myaccount.google.com</a> adresinde görebilir veya silebilirsin.',
 windows: '<b>Windows (Microsoft Store):</b> ilerlemen yalnızca bilgisayarına kaydedilir. Microsoft verilerini <a href="https://account.microsoft.com/privacy">account.microsoft.com/privacy</a> adresinde görebilir veya silebilirsin.' },

'zh-TW': { upd: '最後更新：2026 年 11 月 8 日', swaps: [
  ['sum_3', 'Apple 或 Google', 'Apple、Google 或 Microsoft'],
  ['stores', '在 App 商店版本中，這份副本改為儲存在你自己的 iCloud 或 Google Play 遊戲帳號中。', '在 App 商店版本中，這份副本改由你裝置本身的服務保存：iPhone 和 iPad 上是你的 iCloud，Android 上是你的 Google 備份。在 Windows 的 Microsoft Store 版本中，你的進度只會留在你的電腦上。'],
  ['purchases', '透過 App Store 或 Google Play 進行的', '透過 App Store、Google Play 或 Microsoft Store 進行的'],
  ['purchases', '付款由 Apple 或 Google', '付款由 Apple、Google 或 Microsoft'],
  ['purchases', '退款由 Apple 或 Google', '退款由 Apple、Google 或 Microsoft'],
  ['basis', '（付款由 Apple 或 Google 處理）', '（付款由 Apple、Google 或 Microsoft 處理）'],
  ['security', '你自己的 iCloud 或 Google Play 遊戲帳號中', '你自己的 iCloud 或 Google 備份中（如果你有使用）'],
  ['marks', '提及 Apple 和 Google 僅為說明 App 商店付款的運作方式', '提及 Apple、Google 和 Microsoft 僅為說明 App 商店付款和備份的運作方式'],
 ], android: '<b>Android（Google Play）：</b>如果你手機的 Google 備份已開啟，你的進度也會儲存在你自己的備份中，換新手機或重新安裝 App 時就會回來。你可以在手機的備份設定中關閉。Google Play 遊戲的排行榜由 Google 保存。你可以在 <a href="https://myaccount.google.com/">myaccount.google.com</a> 查看或刪除你的 Google 資料。',
 windows: '<b>Windows（Microsoft Store）：</b>你的進度只會儲存在你的電腦上。你可以在 <a href="https://account.microsoft.com/privacy">account.microsoft.com/privacy</a> 查看或刪除你的 Microsoft 資料。' },

zh: { upd: '最后更新：2026 年 11 月 8 日', swaps: [
  ['sum_3', 'Apple 或 Google', 'Apple、Google 或 Microsoft'],
  ['stores', '在应用商店版本中，这份副本改为保存在你自己的 iCloud 或 Google Play 游戏账户中。', '在应用商店版本中，这份副本改由你设备自身的服务保存：iPhone 和 iPad 上是你的 iCloud，Android 上是你的 Google 备份。在 Windows 的 Microsoft Store 版本中，你的进度只会留在你的电脑上。'],
  ['purchases', '通过 App Store 或 Google Play 进行的', '通过 App Store、Google Play 或 Microsoft Store 进行的'],
  ['purchases', '付款由 Apple 或 Google', '付款由 Apple、Google 或 Microsoft'],
  ['purchases', '退款由 Apple 或 Google', '退款由 Apple、Google 或 Microsoft'],
  ['basis', '（付款由 Apple 或 Google 处理）', '（付款由 Apple、Google 或 Microsoft 处理）'],
  ['security', '你自己的 iCloud 或 Google Play 游戏账户中', '你自己的 iCloud 或 Google 备份中（如果你有使用）'],
  ['marks', '提及 Apple 和 Google 仅为说明应用商店付款的运作方式', '提及 Apple、Google 和 Microsoft 仅为说明应用商店付款和备份的运作方式'],
 ], android: '<b>Android（Google Play）：</b>如果你手机的 Google 备份已开启，你的进度也会保存在你自己的备份中，换新手机或重新安装应用时就会回来。你可以在手机的备份设置中关闭。Google Play 游戏的排行榜由 Google 保存。你可以在 <a href="https://myaccount.google.com/">myaccount.google.com</a> 查看或删除你的 Google 数据。',
 windows: '<b>Windows（Microsoft Store）：</b>你的进度只会保存在你的电脑上。你可以在 <a href="https://account.microsoft.com/privacy">account.microsoft.com/privacy</a> 查看或删除你的 Microsoft 数据。' },
};

let bad = 0;
for (const [lang, t] of Object.entries(T)){
  const f = path.join(D, lang + '.json'), j = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const [k, a, b] of t.swaps){
    const v = j[k];
    if (typeof v !== 'string' || v.split(a).length !== 2){ console.log(`MISSING ${lang} ${k}: ${a.slice(0, 50)}`); bad++; continue; }
    j[k] = v.replace(a, () => b);
  }
  if (!j.choices || j.choices.includes('myaccount.google.com')) { console.log(`choices already done or missing: ${lang}`); bad++; }
  else j.choices = j.choices + `<p>${t.android}</p><p>${t.windows}</p>`;
  j.p_updated = t.upd;
  T[lang].out = j;
}
if (bad){ console.log(bad + ' problems, nothing written'); process.exit(1); }
for (const [lang, t] of Object.entries(T)) fs.writeFileSync(path.join(D, lang + '.json'), JSON.stringify(t.out, null, 2) + '\n');
console.log('updated', Object.keys(T).length, 'languages');
