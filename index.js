let switchStatus = false; 
let currentPage = "main";

// Loading the main content for the user from the get-go
document.addEventListener("DOMContentLoaded", () => {
  renderContent("main");
  const currentLanguage = switchStatus ? english : finnish;
  const translationButton = document.getElementById("translation");
  translationButton.textContent = currentLanguage.translation_button.title; 
  
  translationButton.addEventListener("click", () => { 
    switchStatus = !switchStatus
    translationButton.textContent = switchStatus ? "in English" : "suomeksi"; 
    renderContent(currentPage);
  })
});

const renderContent = (content) => {
  let contentHolder = document.getElementById("nav-content");
  const currentLanguage = switchStatus ? english : finnish
  currentPage = content;
  switch (content) {
    case "main":
      contentHolder.innerHTML = `
                <img src="assets/logotext.svg" id="haalarilanit-logo"/>
                <div class="paragraph">
                    <h3>${currentLanguage.main.time.time}</h3>
                    <h3>${currentLanguage.main.time.where}</h3>
                    <p id="event-countdown"></p>
                </div>

                <div id="button-holder">
                    <form action="https://ruut.eventiolive.fi/events/6895e7678a0c35132a8b456a/">
                    <input id="ticket-button" type="submit" value="${currentLanguage.main.purchase_button}"/>
                    </form>
                </div>

                <div class="paragraph">
                  <h2>${currentLanguage.main.header}</h2>
                  <p>
                    Haalarilanit on suuri lanitapahtuma, jota on järjestetty LAB-kampuksen liikuntasalissa Lappeenrannassa.
                  </p>
                  <p>
                    Luvassa on syksyn eeppisin pelihetki, kun lähes kaksisataa pelaajaa kerääntyy yhteen saliin ja nauttii yhdessä pelaamisen ilosta. Olitpa sitten intohimoinen e-urheilija tai rento viikonlopun pelaaja, peliseuraa riittää varmasti.
                  </p>
                  <p>
                    Laneilla järjestään lukuisia turnauksia, joissa pelaajat pääsevät tavoittelemaan ykköspaikkaa - Onko CS2 sinun lajisi, vai loistatko NHL-jäällä? Entä oletko ralliratojen kuningas ajosimulaattorilla? Nyt on sinun mahdollisuutesi näyttää taitosi niin järjestetyissä turnauksissa kuin ystäviesi kesken kisatessa!
                  </p>
                  <p>
                    Tuo oma koneesi, liitä se kiinni verkkoon ja oletkin valmis kokemaan mukaansatempaavia pelikokemuksia! Lisäksi paikan päällä on kioski, josta voit hankkia pientä juotavaa ja purtavaa nautittavaksi kesken pelihetkien 
                      <a class="embedded-anchor" href="#"
                      onclick="renderContent('guide')">
                      (kts. Tapahtumakartta)
                      </a>
                    .

                  </p>
                  <p>
                    Tapahtuma-alue on päihteetön eikä alueelle saa tuoda alkoholijuomia. Voit osallistua laneille matalalla kynnyksellä ja ilman mitään aikaisempaa kokemusta! Mikäli sinulla herää kysymyksiä Haalarilaneihin liittyen, ota yhteyttä 
                      <a class="embedded-anchor" href="#"
                      onclick="renderContent('contact')">
                      pääjärjestäjiin
                      </a>.
                  </p>
                </div>

                <div class="paragraph">
                  <h2>Kuvapankit</h2>
                  <p>Alhaalla on linkki kuvapankkiin. Kuvat on otettu tapahtumapaikalta.</p>
                  <a href="https://cluster.kuvat.fi/kuvat/2024_014+-+Haalarilanit"/>2024</a>
                </div>

                <div>
                  <span class="tournament-join">

                  </span>
                </div>
                `;
      countdownTimer();
      break;

    case "rules":
      contentHolder.innerHTML = `
<h1>Säännöt</h1>
<div class="paragraph">
  <h2>Tapahtuma-alueelle ei saa tuoda</h2>
  <ul>
    <li>Toisten ihmisten vahingoittamiseen soveltuvia välineitä</li>
    <li>Alkoholia tai huumausaineita</li>
    <li>Räjähteitä tai muita vaarallisia aineita</li>
  </ul>
</div>

<div class="paragraph">
  <h2>Alkoholi ja tupakointi</h2>
  <p>Alkoholin tai muiden päihdeaineiden nauttiminen ja hallussapito tapahtuma-alueella on ehdottomasti kiellettyä. Alkoholituotteet ja muut päihteet tulee jättää tapahtuman sisäänkäynnin lähelle niille erikseen osoitettuun paikkaan.<p/>
  <p>Tupakoiminen ja sähkötupakointi on sallittua vain sille merkityllä alueella. Paikalla on tumppeja varten astia ja sitä tulee myös käyttää.</p>
</div>

<div class="paragraph">
  <h2>Sähköverkko</h2>
  <p>Kodinkoneiden ja muiden suuritehoisten sähkölaitteiden kytkeminen konepaikalle on ehdottomasti kiellettyä. Jokaiselle konepaikalle on varattu yksi sähköpistoke, josta riittää kullekin konepaikalle 350 W sähköteho.</p>
  <p>Tapahtuma-alueelta löytyy yleiseen käyttöön tarkoitettu mikro ja vedenkeitin. Mikäli tietokoneesi tai muut sähkölaitteesi tarvitsevat yhteensä enemmän kuin 350 W sähkötehoa, ole ennakkoon yhteydessä järjestäjiin.</p>
</div>

<div class="paragraph">
  <h2>Tapahtuma-alueen vauriot</h2>
  <p>Tapahtuma-alueiden vaurioittaminen ja sotkeminen on ehdottomasti kiellettyä. Esimerkiksi tarrojen liimailu seiniin. Vahingonaiheuttaja on aina korvausvelvollinen.</p>
</div>

<div class="paragraph">
  <h2>Verkko</h2>
  <p>Tapahtuma-alueen verkossa on kiellettyä:</p>
  <ul>
    <li>DHCP-palvelimet</li>
    <li>Verkkoliikenteen häiritseminen</li>
    <li>Muun liikenteen seuraaminen, kuin sen, jonka pääte- tai lähtöpiste, on oma tietokone</li>
    <li>Ylimääräisten laitteiden, kuten kytkinten tai palomuurin kytkeminen</li>
    <li>Tekijänoikeudella suojatun tai Suomen lain vastaisen materiaalin haku tai levitys</li>
  </ul>
</div>

<div class="paragraph">
  <h2>Nukkuminen</h2>
  <p>Turvallisuussyistä nukkuminen on sallittua ainoastaan omalla konepaikalla pystyasennossa (esimerkiksi pää konepaikalla). Nukkuminen lattialla tai muualla tapahtuma-alueella ei ole sallittua.</p>
</div>

<div class="paragraph">
  <h2>Muuta</h2>
  <ul>
    <li>Kaikki Suomen lait ovat voimassa tapahtumassa</li>
    <li>Järjestäjät eivät vastaa mahdollisista laiterikoista</li>
    <li>Järjestäjillä on oikeus poistaa henkilö tapahtumapaikalta. Lipun hintaa ei palauteta. Erityistapauksissa on mahdollista, että henkilö poistetaan välittömästi paikalta</li>
    <li>Tekijä on aina vastuussa aiheuttamistaan vahingoista ja mahdollisista korvauksista</li>
  </ul
</div>
`;
      break;

    case "guide":
      contentHolder.innerHTML = `
<h1>Opasteet</h1>
<img src="assets/floorplan.svg" id="floorplan"/>
<div class="paragraph">
  <p>Haalarilaneille on 24h sisäänkäynti, joka tapahtuu parkkipaikan puoleisista ovista. Opastekarttaan on merkitty ovet, mistä tulee kulkea sekä tapahtuma-alueelle, että mm. vessoihin.</p>
  <p>Tapahtuman ajan LAB-ammattikorkeakoulun parkkipaikat ovat vapaita pysäköinnille, eli niissä ei ole tällöin pysäköinninvalvontaa. Sisäänkäynti on esteetön.</p>
</div>
`;
      break;

    case "tournament":
      contentHolder.innerHTML = `
                <h1>Turnaukset</h1>
                <div class="paragraph center">
                    <p>Vuoden 2025 turnausten aikataulut julkaistaan myöhemmin. Kiitokset kärsivällisyydestä!</p>
                </div>
            `;
      break;

    case "contact":
      contentHolder.innerHTML = `
            <div>
                <h1>Yhteystiedot</h1>
                <h2>Yrityssuhdevastaava</h2>
                <div class="paragraph center">
                    <p>Jeremias Wahlsten</p>
                    <p>Markkinointi, Live, Turnaukset</p>
                </div>
                <div class="paragraph center">
                    <p>Miko Mattila</p>
                    <p>Infra, Logistiikka</p>
                    <p>miko.mattila@ruut.me</p>
                </div>
                <div class="paragraph center">
                    <p>Tapio Wallden</p>
                    <p>Kioski, Turvallisuus</p>
                </div>
            </div>
            `;
      break;

    case "pack":
      contentHolder.innerHTML = `
                <h1>Pakkauslista</h1>
                <div class="paragraph">
                    <p>Pakkaa mukaan tarvitsemasi laitteet, ottaen huomioon konepaikan rajoitteet</p>
                    <ul id="pack-list">
                        <li>Tietokone/Konsoli</li>
                        <li>Näyttö</li>
                        <li>Näppäimistö/Ohjain</li>
                        <li>Hiiri & Hiirimatto</li>
                        <li>Kuulokkeet</li>
                        <li>Jatkojohto</li>
                        <li>Verkkokaapeli (10m)</li>
                        <li>Puhelimen / Kuulokkeiden latausjohto</li>
                        <li>Taskurahaa / Mobilepay</li>
                    </ul>
                </div>
            `;
      break;

    default:
      contentHolder.innerHTML = `<h2>Sisältöä ei löytynyt.</h2>`;
  }
};

const countdownTimer = () => {
  const eventDate = new Date(2025, 10, 9, 15).getTime();

  // Initial starting time on page load
  let timeDifference = eventDate - new Date().getTime();
  displayTime(timeDifference);

  // Starting the second-by-second
  setInterval(() => {
    timeDifference = eventDate - new Date().getTime();

    displayTime(timeDifference);
  }, 1000);
};

const displayTime = (timeDifference) => {
  if (!document.getElementById("event-countdown")) {
    return;
  }
  // If the event has already begun
  if (timeDifference < 0) {
    document.getElementById("event-countdown").innerHTML =
      "Tapahtuma on alkanut!";
    return;
  }

  let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  let hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  let countdown = `${days} päivää,
    ${hours} tuntia,
    ${minutes} minuuttia,
    ${seconds} sekuntia.`;

  // Displaying the time difference
  document.getElementById("event-countdown").innerHTML = countdown;
};

const finnish = {
  translation_button: {
    title: "suomeksi",
  },
  main: {
    time: {
      time: "Aika: to 9.10. Klo 15:00 - su 12.10.2025 klo 12:00",
      where: "Paikka: LAB-kampuksen liikuntasali",
    },
    purchase_button: "Osta lippu",
    header: "Mistä on kyse?"
  }
}

const english = {
  translation_button: {
    title: "in English",
  },
  main: {
    time: {
      time: "Thu 9.10. from 15:00 - Sun 12.10.2025 till 12:00",
      where: "Where: LAB University of Applied Sciences' gymnasium"
    },
    purchase_button: "Buy your ticket",
    header: "What's this all about?"
  }
}