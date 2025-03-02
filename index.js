// Loading the main content for the user from the get-go
document.addEventListener("DOMContentLoaded", () => {
  renderContent("main");
});

const renderContent = (content) => {
  let contentHolder = document.getElementById("nav-content");
  switch (content) {
    case "main":
      contentHolder.innerHTML = `
                <img src="assets/logotext.svg" id="haalarilanit-logo"/>
                <h1>Nähdään taas ensi vuonna!</h1>
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
				<div class="paragraph">
          <p class="tournament-p">Haalarilaneilla järjestetään puolivakavia turnauksia, joissa voittajat palkitaan lahjakorteilla tai yhteistyökumppaneiden tarjoamilla palkinnoilla. Lahjakortit on arvoltaan 20-50€.
          Tapahtuma-alueelle on ilmainen sisäänpääsy kaikille ja turnauksia voi tulla katsomaan ja kannustamaan paikan päälle!</p>
				</div>
				<div class="paragraph tournament-paragraph">
					<h2>Counter Strike 2</h2>
          <div class="sponsors-container container-tournament">
            <a><div><img src="assets/sponsor-logo/cgi.svg"/></div></a>
          </div>
          <p class="tournament-p">Mitä olisikaan lanit ilman kynttää? Haalarilanien CS2-turnaus vedetään perinteisellä 5v5 MR24 formaatilla, map poolina active duty-kartat. Kyseessä on BYOC -turnaus, joten osallistuminen vaatii oman konepaikan hankkimista laneilta. Koko turnaus pelataan lanien aikana, ja osa peleistä striimataan Twitchiin.</p>
				  <p class="tournament-p">Pelit aloitetaan perjantaina 18.10. noin klo.17:00 ja niitä pelaillaan hyvällä tahdilla päivän mittaan. Loppupelit pelataan lauantaina 19.10. noin klo.19:00->.</p>
          <span class="tournament-join">
            Ilmoittaudu mukaan
            <a class="embedded-anchor" href="https://challonge.com/fi/dk76etx8">
              TÄSTÄ!
            </a>
          </span>
        </div>

				<div class="paragraph tournament-paragraph">
					<h2>League of Legends</h2>
            <div class="sponsors-container container-tournament">
              <a><div><img src="assets/sponsor-logo/reaktor.svg"/></div></a>
            </div>
          <p class="tournament-p">Nyt on aika näyttää taitosi League of Legendsin parissa! Oletteko sinä ja kaverisi lanien parhaita kokkaajia, vai onko mekaniikkanne omaa luokkaansa? Kokoa 3-henkinen joukkueesi ja astu kilpailemaan sillan herruudesta tässä suositussa MOBA-pelissä. Huomioithan, että turnaus pelataan EUW -serverillä.
Kyseessä on BYOC -turnaus, joten osallistuminen vaatii oman konepaikan hankkimista laneilta. Koko turnaus pelataan lanien aikana, ja osa peleistä striimataan Twitchiin.</p>
          <p class="tournament-p">Pelit pelataan lauantaina 19.10. noin klo.12:00->.</p>
          <span class="tournament-join">
            Ilmoittaudu mukaan
            <a class="embedded-anchor" href="https://challonge.com/fi/nq8bon6o">
              TÄSTÄ!
            </a>
          </span>
        </div>

				<div class="paragraph tournament-paragraph">
					<h2>EA SPORTS™ WRC</h2>
          <div class="sponsors-container container-tournament">
            <a><div><img src="assets/sponsor-logo/visma.svg"/></div></a>
          </div>
				  <p class="tournament-p">Lauantain aikana on mahdollisuus päästä näyttämään taitojaan ajosimulaattorin ratissa! Tähän aika-ajokisaan ei tarvitse ilmoittautua erikseen, vaan voit käydä ajamassa oman suorituksen lauantain aikana klo. 14:00 - 21:00. Nopein aika palkitaan!</p>
        </div>
				<div class="paragraph tournament-paragraph">
					<h2>NHL 24 - PS5</h2>
            <div class="sponsors-container container-tournament">
              <a><div><img src="assets/sponsor-logo/ltky.png"/></div></a>
            </div>
			    <p class="tournament-p">Tänä vuonna LTKY:n kiltaolympialaisten lajikirjoon on lisätty vanha kunnon änäri pelattuna Playstation 5:lla! Ilmoittautuminen ja tarkempien lisätietojen kysyminen tapahtuu oman killan liikuntavastaavan kautta.
Turnaus tullaan pelaamaan perjantaina 18.10.</p>
        </div>

				<div class="paragraph">
					<p class="tournament-p">Haalarilanien turnausvastaavana toimii
						<span id="tournament-staff">Noora Parkko, noora.parkko@cluster.fi</span>
					</p>
				</div>


            `;
      break;

    case "contact":
      contentHolder.innerHTML = `
            <div>
                <h1>Yhteystiedot</h1>
                <h2>Yrityssuhdevastaava</h2>
                <div class="paragraph center">
                    <p>Vilppu Penttilä</p>
                    <p>yritys@ruut.me</p>
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
  const eventDate = new Date(2024, 9, 18, 15).getTime();

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
