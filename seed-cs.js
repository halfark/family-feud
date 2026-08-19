// Česká databáze otázek pro ZŠ — 15 sad po 6 otázkách.
const { set } = require('./seed-util');

const G1 = '1.–3. třída';
const G2 = '4.–5. třída';
const G3 = '6.–9. třída';

module.exports = [

  // ============================ 1.–3. TŘÍDA ============================
  set('Zvířata kolem nás', 'Přírodověda', G1,
    'Jmenuj domácí zvíře.|Pes:34|Kočka:28|Králík:14|Křeček:10|Andulka:8|Rybička:6',
    'Jmenuj zvíře, které žije v lese.|Liška:26|Srnka:22|Zajíc:18|Veverka:16|Divočák:12|Ježek:6',
    'Jmenuj zvíře, které uvidíš v ZOO.|Lev:28|Slon:24|Žirafa:20|Opice:14|Tygr:8|Zebra:6',
    'Jmenuj zvíře, které žije na statku.|Kráva:28|Prase:22|Kůň:20|Slepice:16|Ovce:8|Koza:6',
    'Co nám dává kráva?|Mléko:52|Maso:24|Kůži:12|Hnůj:8|Sýr:4',
    'Které zvíře umí létat?|Pták:32|Netopýr:22|Motýl:18|Včela:14|Moucha:8|Vážka:6'),

  set('Ve škole', 'Škola', G1,
    'Co máš v penálu?|Tužka:28|Pero:24|Guma:18|Pastelky:14|Ořezávátko:10|Pravítko:6',
    'Jmenuj školní předmět.|Matematika:26|Čeština:24|Tělocvik:20|Prvouka:12|Výtvarka:10|Hudebka:8',
    'Co děláš o přestávce?|Svačím:30|Povídám si s kamarády:24|Hraju si:18|Běhám po chodbě:14|Jdu na záchod:8|Připravuju se na hodinu:6',
    'Kdo pracuje ve škole?|Učitel:34|Ředitel:22|Uklízečka:16|Kuchařka:14|Školník:10|Vychovatelka:4',
    'Co si dáš ve školní jídelně?|Polévku:30|Hlavní jídlo:26|Pití:18|Ovoce:14|Moučník:12',
    'Co si nosíš do školy?|Aktovku:30|Svačinu:24|Penál:18|Sešity:14|Učebnice:10|Cvičky:4'),

  set('Ovoce, zelenina a jídlo', 'Jídlo a zdraví', G1,
    'Jmenuj ovoce.|Jablko:30|Banán:26|Hruška:16|Pomeranč:12|Jahoda:10|Švestka:6',
    'Jmenuj zeleninu.|Mrkev:28|Rajče:24|Okurka:18|Brambora:14|Paprika:10|Cibule:6',
    'Co jíš k snídani?|Rohlík:28|Cereálie:22|Chléb:18|Jogurt:14|Vajíčka:10|Kakao:8',
    'Co roste na zahradě?|Jahody:24|Rajčata:22|Mrkev:18|Salát:16|Ředkvičky:12|Cibule:8',
    'Jmenuj sladkost.|Čokoláda:34|Bonbony:24|Zmrzlina:18|Sušenky:12|Dort:8|Lízátko:4',
    'Co piješ nejčastěji?|Vodu:34|Džus:24|Čaj:16|Mléko:14|Limonádu:8|Kakao:4'),

  set('Doprava a bezpečí', 'Dopravní výchova', G1,
    'Jmenuj dopravní prostředek.|Auto:28|Autobus:22|Vlak:18|Kolo:14|Letadlo:10|Tramvaj:8',
    'Co má na sobě cyklista pro bezpečí?|Přilbu:36|Reflexní vestu:26|Světla na kole:16|Rukavice:12|Chrániče:10',
    'Jaké barvy má semafor?|Červená:36|Zelená:34|Oranžová:30',
    'Kde se správně přechází silnice?|Na přechodu:44|Na semaforu:26|Podchodem:16|Nadchodem:10|U školy:4',
    'Kdo nebo co řídí dopravu?|Policista:40|Semafor:28|Dopravní značky:20|Závory:8|Strážník:4',
    'Co uděláš, než přejdeš silnici?|Rozhlédnu se:44|Zastavím se:24|Počkám na zelenou:18|Poslouchám:8|Zvednu ruku:6'),

  set('Roční období a svátky', 'Prvouka', G1,
    'Jmenuj roční období.|Léto:28|Zima:26|Jaro:24|Podzim:22',
    'Co děláme v zimě?|Sáňkujeme:26|Stavíme sněhuláka:24|Lyžujeme:20|Bruslíme:16|Koulujeme se:14',
    'Jaké známe svátky?|Vánoce:34|Velikonoce:26|Mikuláš:16|Silvestr:12|Den dětí:8|Halloween:4',
    'Co patří k Vánocům?|Stromeček:30|Dárky:26|Cukroví:18|Kapr:14|Betlém:8|Koledy:4',
    'Co děláme na jaře?|Sázíme květiny:26|Jezdíme na kole:22|Pozorujeme přírodu:18|Hrabeme zahradu:16|Chodíme na procházky:12|Malujeme vajíčka:6',
    'Co si oblečeš v létě?|Tričko:30|Kraťasy:26|Sandály:18|Kšiltovku:12|Plavky:10|Sluneční brýle:4'),

  // ============================ 4.–5. TŘÍDA ============================
  set('Ptáci a hmyz', 'Přírodověda', G2,
    'Jmenuj hmyz.|Mravenec:26|Včela:24|Motýl:20|Moucha:14|Beruška:10|Komár:6',
    'Jmenuj ptáka, kterého u nás běžně uvidíš.|Vrabec:24|Sýkorka:22|Kos:18|Vlaštovka:16|Holub:12|Straka:8',
    'Co dělají zvířata v zimě?|Spí zimním spánkem:32|Odlétají do teplých krajin:26|Shánějí zásoby:18|Naroste jim hustší srst:16|Schovají se v noře:8',
    'Čím krmíme ptáky v zimě?|Slunečnicová semínka:30|Lůj:24|Ořechy:18|Zrní:16|Ovoce:8|Strouhanka:4',
    'Který hmyz je pro člověka užitečný?|Včela:38|Beruška:24|Mravenec:16|Čmelák:14|Vážka:8',
    'Kde ptáci staví hnízdo?|Na stromě:34|V budce:24|Pod střechou:18|V keři:14|Na zemi:6|V dutině:4'),

  set('Zdravý životní styl', 'Jídlo a zdraví', G2,
    'Co patří ke zdravému životu?|Pohyb a sport:30|Ovoce a zelenina:26|Dostatek spánku:18|Pitný režim:14|Pobyt venku:12',
    'Jmenuj zdravý nápoj.|Voda:34|Ovocný džus:22|Čaj:16|Mléko:14|Smoothie:8|Minerálka:6',
    'Co škodí našemu zdraví?|Kouření:30|Sladkosti:22|Málo pohybu:18|Alkohol:16|Fastfood:8|Málo spánku:6',
    'Jak se chráníme před nemocí?|Myjeme si ruce:34|Oblékáme se podle počasí:22|Jíme vitamíny:18|Očkování:14|Větráme:8|Nosíme roušku:4',
    'Co děláš, když jsi nemocný?|Ležím v posteli:30|Piju čaj:24|Jdu k lékaři:20|Beru léky:16|Měřím si teplotu:10',
    'Kolik hodin by měl školák spát?|Devět hodin:32|Deset hodin:26|Osm hodin:22|Jedenáct hodin:12|Dvanáct hodin:8'),

  set('Sport a pohyb', 'Sport', G2,
    'Jmenuj míčový sport.|Fotbal:34|Basketbal:22|Volejbal:16|Házená:12|Tenis:10|Florbal:6',
    'Co si vezmeš na lyže?|Lyže:28|Hůlky:22|Přilbu:18|Rukavice:14|Brýle:10|Bundu:8',
    'Jaký sport se dělá ve vodě?|Plavání:40|Skoky do vody:20|Vodní pólo:16|Potápění:12|Aquaerobik:8|Veslování:4',
    'Co dostane vítěz závodu?|Medaili:34|Pohár:26|Diplom:18|Věcnou cenu:12|Peníze:6|Potlesk:4',
    'Kde se dá sportovat?|V tělocvičně:28|Na hřišti:26|V bazénu:18|V parku:14|Na zimním stadionu:8|Doma:6',
    'Jmenuj zimní sport.|Lyžování:32|Snowboarding:22|Bruslení:18|Hokej:16|Sáňkování:8|Biatlon:4'),

  set('Povolání', 'Člověk a společnost', G2,
    'Jmenuj povolání.|Lékař:24|Učitel:22|Hasič:18|Policista:16|Kuchař:12|Řidič:8',
    'Kdo pracuje v nemocnici?|Lékař:32|Zdravotní sestra:26|Sanitář:14|Lékárník:12|Uklízečka:10|Řidič sanitky:6',
    'Kdo nám pomáhá v nouzi?|Hasiči:32|Záchranka:28|Policie:24|Horská služba:10|Sousedé:6',
    'Jaké nářadí používá řemeslník?|Kladivo:28|Šroubovák:24|Pilu:18|Kleště:14|Vrtačku:10|Metr:6',
    'Kdo pracuje venku?|Zahradník:26|Stavař:22|Popelář:18|Zemědělec:16|Listonoš:12|Lesník:6',
    'Co všechno dělá učitel?|Učí:34|Opravuje sešity:22|Zkouší:18|Připravuje hodiny:14|Má dozor:8|Známkuje:4'),

  set('Lidské tělo', 'Přírodověda', G2,
    'Jmenuj část lidského těla.|Ruka:24|Noha:22|Hlava:18|Oko:14|Ucho:12|Nos:10',
    'Které máme smysly?|Zrak:26|Sluch:24|Čich:20|Chuť:18|Hmat:12',
    'Jmenuj lidský orgán.|Srdce:32|Plíce:24|Mozek:18|Žaludek:14|Játra:8|Ledviny:4',
    'K čemu slouží srdce?|Pumpuje krev:48|Udržuje nás naživu:22|Bije:16|Rozvádí kyslík:14',
    'Co si čistíme každý den?|Zuby:44|Ruce:24|Obličej:14|Vlasy:10|Uši:8',
    'Co roste člověku celý život?|Vlasy:40|Nehty:34|Kosti:14|Zuby:12'),

  set('Stromy a rostliny', 'Přírodověda', G2,
    'Jmenuj listnatý strom.|Dub:26|Buk:22|Bříza:18|Lípa:16|Javor:10|Kaštan:8',
    'Jmenuj jehličnatý strom.|Smrk:30|Borovice:26|Jedle:18|Modřín:14|Túje:8|Tis:4',
    'Jmenuj jarní květinu.|Sněženka:28|Petrklíč:22|Tulipán:18|Narcis:16|Fialka:10|Bledule:6',
    'Co potřebuje rostlina k životu?|Vodu:34|Světlo:26|Půdu:16|Vzduch:14|Teplo:10',
    'Jmenuj houbu.|Hřib:32|Křemenáč:20|Bedla:16|Muchomůrka:16|Liška:12|Klouzek:4',
    'Z jakých částí se skládá rostlina?|Kořen:28|Stonek:24|List:22|Květ:18|Plod:8'),

  // ============================ 6.–9. TŘÍDA ============================
  set('Škola a učení', 'Škola', G3,
    'Který předmět mají žáci nejraději?|Tělocvik:28|Informatika:22|Výtvarná výchova:16|Dějepis:14|Matematika:12|Chemie:8',
    'Co potřebuješ na hodinu výtvarky?|Štětec:26|Barvy:24|Papír:18|Vodu:14|Nůžky:10|Paletu:8',
    'Jak se dá připravit na písemku?|Číst si sešit:30|Počítat příklady:24|Učit se s kamarádem:18|Dělat si výpisky:16|Ptát se učitele:12',
    'Co se dělá na školním výletě?|Prohlídka památky:28|Návštěva ZOO:22|Turistika:18|Muzeum:16|Opékání:10|Koupání:6',
    'Jmenuj kroužek, který bývá ve škole.|Sportovní:26|Výtvarný:22|Hudební:18|Počítačový:16|Jazykový:12|Divadelní:6',
    'Co dělá dobrý spolužák?|Pomůže:32|Půjčí věci:24|Nepomlouvá:18|Zastane se:16|Vysvětlí látku:10'),

  set('Naše vlast – Česko', 'Vlastivěda / Zeměpis', G3,
    'Jmenuj české město.|Praha:32|Brno:24|Ostrava:16|Plzeň:10|Olomouc:10|Liberec:8',
    'Jmenuj českou řeku.|Vltava:32|Labe:26|Morava:16|Odra:12|Ohře:8|Sázava:6',
    'Jmenuj české pohoří.|Krkonoše:28|Šumava:24|Jeseníky:18|Beskydy:16|Orlické hory:8|Krušné hory:6',
    'Jmenuj českou památku.|Karlštejn:26|Pražský hrad:24|Karlův most:20|Hluboká:14|Český Krumlov:10|Lednice:6',
    'Co je symbolem České republiky?|Vlajka:28|Státní znak:24|Hymna:22|Lev:16|Lípa:10',
    'Jmenuj sousední stát Česka.|Slovensko:30|Německo:28|Polsko:24|Rakousko:18'),

  set('Vesmír', 'Přírodní vědy', G3,
    'Jmenuj planetu sluneční soustavy.|Země:24|Mars:22|Jupiter:16|Saturn:14|Venuše:14|Merkur:10',
    'Co vidíš na noční obloze?|Hvězdy:34|Měsíc:28|Planety:14|Letadlo:10|Družice:8|Kometu:6',
    'Kdo létá do vesmíru?|Kosmonaut:44|Astronaut:28|Vědec:14|Turista:8|Robot:6',
    'Co potřebuje kosmonaut?|Skafandr:34|Kyslík:26|Raketu:16|Jídlo:12|Přilbu:8|Výcvik:4',
    'Jmenuj těleso ve vesmíru.|Hvězda:26|Planeta:24|Kometa:18|Měsíc:16|Asteroid:10|Černá díra:6',
    'Čím pozorujeme oblohu?|Dalekohledem:44|Z hvězdárny:24|Pouhým okem:16|Družicí:10|Sondou:6'),

  set('Čeština – slovní druhy', 'Český jazyk', G3,
    'Jmenuj slovní druh.|Podstatné jméno:24|Sloveso:22|Přídavné jméno:18|Zájmeno:14|Číslovka:12|Příslovce:10',
    'Jmenuj vyjmenované slovo po B.|Bydlet:24|Být:22|Byt:18|Obyvatel:14|Nábytek:12|Babyka:10',
    'Jmenuj interpunkční znaménko.|Tečka:30|Čárka:26|Otazník:20|Vykřičník:16|Dvojtečka:8',
    'Jmenuj literární žánr.|Pohádka:28|Báseň:24|Román:18|Bajka:14|Povídka:10|Pověst:6',
    'Jmenuj českého spisovatele.|Karel Čapek:30|Božena Němcová:24|Jan Neruda:16|Alois Jirásek:12|Jaroslav Seifert:10|Karel Havlíček Borovský:8',
    'Co má mít dobrá slohová práce?|Úvod a závěr:28|Odstavce:24|Bohatou slovní zásobu:20|Být bez chyb:16|Zajímavý nápad:12'),
];
