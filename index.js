
// Loading the main content for the user from the get-go
document.addEventListener("DOMContentLoaded", () => {
    renderContent("main");
});

const renderContent = (content) => {
    let contentHolder = document.getElementById("nav-content");
    switch (content) {

        case "main":
            contentHolder.innerHTML = 
            `
                <img src="assets/logotext.svg" id="haalarilanit-logo"/>
                <div class="paragraph">
                    <p>Haalarilanit järjestetään 18.10.–20.10. LAB-kampuksen liikuntasalissa Lappeenrannassa.</p>
                </div>
                <div class="paragraph">
                    <p>Luvassa on syksyn eeppisin pelihetki, kun lähes kaksisataa pelaajaa kerääntyy yhteen saliin ja nauttii yhdessä pelaamisen ilosta. Olitpa sitten intohimoinen e-urheilija tai rento viikonlopun pelaaja, peliseuraa riittää varmasti.</p>
                </div>
                <div class="paragraph">
                    <p>Laneilla järjestään lukuisia turnauksia, joissa pelaajat pääsevät tavoittelemaan ykköspaikkaa - Onko CS2 sinun lajisi, vai loistatko NHL-jäällä? Entä oletko ralliratojen kuningas ajosimulaattorilla? Nyt on sinun mahdollisuutesi näyttää taitosi niin järjestetyissä turnauksissa kuin ystäviesi kesken kisatessa!</p>
                </div>
                <div class="paragraph">
                    <span>Tuo oma koneesi, liitä se kiinni verkkoon ja oletkin valmis kokemaan mukaansatempaavia pelikokemuksia! Lue lisää konepaikkojen tiedoista alempaa ja hanki lippusi. Lisäksi paikan päällä on kioski, josta voit hankkia pientä juotavaa ja purtavaa nautittavaksi kesken pelihetkien
                        <a class="embedded-anchor" href="#"
                        onclick="renderContent('guide')">
                        (kts. Tapahtumakartta).
                        </a>
                    </span>
                </div>
                <div class="paragraph">
                    <span>Tapahtuma-alue on päihteetön eikä alueelle saa tuoda alkoholijuomia. Voit osallistua laneille matalalla kynnyksellä ja ilman mitään aikaisempaa kokemusta! Mikäli sinulla herää kysymyksiä Haalarilaneihin liittyen, ota yhteyttä
                        <a class="embedded-anchor" href="#"
                        onclick="renderContent('contact')">
                        pääjärjestäjiin.
                        </a>
                    </span>
                </div>
                <div class="paragraph">
                    <h3>Aika: pe 18.10. Klo 15:00 - su 20.10.2024 klo 12:00</h3>
                    <h3>Paikka: LAB-kampuksen liikuntasali</h3>
                    <p id="event-countdown"></p>
                </div>
                <div class="button-container">
                    <form action="https://ruut.eventiolive.fi/events/669e13533633f9012f8b456c/">
                        <input id="ticket-button" type="submit" value="Osta lippu"/>
                    </form>
                </div>
                <div class="paragraph">
                    <h2>Konepaikkaan sisältyy</h2>
                    <ul>
                        <li>80–100 cm leveä konepaikka</li>
                        <li>yksi sähköpistoke</li>
                        <li>yksi Ethernet –verkkoportti</li>
                        <li>yksi Haalarilani -haalarimerkki</li>
                        <li>Ilmainen osallistuminen kaikkiin virallisiin turnauksiin</li>
                    </ul>
                </div>
                
                <div class="paragraph">
                    <span>Tapahtuman virallinen tiedotuskanava on Haalarilanien Discord.</span>
                </div>
                
                <div class="button-container">
                    <form action="https://discord.gg/KmzPVjnAWE">
                        <input id="ticket-button" type="submit" value="Liity Discord-palvelimelle"/>
                    </form>
                </div>

                <div class="sponsors-main-container">
                    <div class="sponsors-container">
                        <a><div><img src="assets/sponsor-logo/reaktor.svg" class="large logo-black"/></div></a>
                        <a href="https://www.kuljetuskoppo.fi/" target="_blank" rel="noopener noreferrer"><div><img src="assets/sponsor-logo/kuljetuskoppo.svg" class="large"/></div></a>
                        <a><div><img src="assets/sponsor-logo/cgi.svg" class="large"/></div></a>
                    </div>
                    <div class="sponsors-container">
                        <a><div><img src="assets/sponsor-logo/loas.svg"/></div></a>
                        <a><div><img src="assets/sponsor-logo/lappeenranta.svg" class="logo-black"/></div></a>
                        <a href="https://www.m-files.com/careers/" target="_blank" rel="noopener noreferrer"><div><img src="assets/sponsor-logo/mfiles.svg"/></div></a>
                    </div>
                    <div class="sponsors-container">
                        <a><div><img src="assets/sponsor-logo/celsius.svg"/></div></a>
                        <a><div><img src="assets/sponsor-logo/tek.svg"/></div></a>
                    </div>
                </div>
                `
            countdownTimer();
            break;

        case "rules":
            contentHolder.innerHTML = 
            `
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
            `
            break;

        case "guide":
            contentHolder.innerHTML =
            `
                <h1>Opasteet</h1>
                <img src="assets/floorplan.svg" id="floorplan"/>
            `
            break;
        
        case "tournament":
            contentHolder.innerHTML = 
            `
                <h1>Turnaukset</h1>
				<div class="paragraph">
					<p>Haalarilaneilla järjestetään puolivakavia turnauksia, joissa voittajat palkitaan lahjakorteilla tai yhteistyökumppaneiden tarjoamilla palkinnoilla.</p>
				</div>
				<div class="paragraph tournament-paragraph">
					<h2>Counter Strike 2 5v5 BYOC</h2>
					<p class="tournament-sponsor">Turnauksen sponsoroi CGI</p> 
					<p>Mitä olisikaan lanit ilman kynttää? Haalarilanien CS2-turnaus vedetään perinteisellä 5v5 MR24 formaatilla, map poolina active duty-kartat. Kyseessä on BYOC -turnaus, joten osallistuminen vaatii oman konepaikan hankkimista laneilta. Koko turnaus pelataan lanien aikana, ja osa peleistä striimataan Twitchiin. </p>
				</div>
				<div class="paragraph tournament-paragraph">
					<h2>League of Legends 3v3 BYOC - Howling Abyss - draft pick – EUW</h2>
					<p class="tournament-sponsor">Turnauksen sponsoroi Reaktor</p>
					<p>Nyt on aika näyttää taitosi League of Legendsin parissa! Oletteko sinä ja kaverisi lanien parhaita kokkaajia, vai onko mekaniikkanne omaa luokkaansa? Kokoa 3-henkinen joukkueesi ja astu kilpailemaan sillan herruudesta tässä suositussa MOBA-pelissä. Huomioithan, että turnaus pelataan EUW -serverillä. Kyseessä on BYOC -turnaus, joten osallistuminen vaatii oman konepaikan hankkimista laneilta. Kaikki turnauksen matsit pelataan tapahtuman aikana, ja osa niistä striimataan Twitchiin.</p>
				</div>
				<div class="paragraph tournament-paragraph">
					<h2>EA SPORTS™ WRC</h2>
					<p class="tournament-sponsor">Turnauksen sponsoroi Visma Solutions</p>
					<p>Lauantain aikana on myös mahdollisuus päästä näyttämään taitojaan ajosimulaattorin ratissa! Tähän aika-ajokisaan ei tarvitse ilmoittautua erikseen, vaan voit käydä näyttämässä taitosi simulaattorissa silloin, kun itse ehdit. Nopein aika palkitaan! </p>
				</div>
				<div class="paragraph tournament-paragraph">
					<h2>NHL 24 - PS5</h2>
					<p>Tänä vuonna LTKY:n kiltaolympialaisten lajikirjoon on lisätty vanha kunnon änäri! Ilmoittautuminen ja tarkempien lisätietojen kysyminen tapahtuu oman killan liikuntavastaavan kautta.</p>
				</div>

				<div class="paragraph">
					<p>Turnausten tarkemmat aikataulut julkaistaan myöhemmin.</p>
					<p>Haalarilanien turnausvastaavana toimii 
						<span id="tournament-staff">Noora Parkko, noora.parkko@cluster.fi</span>
					</p>
				</div>

				
            `
            break;
            
        case "contact":
            contentHolder.innerHTML = 
            `
                <h1>Yhteystiedot</h1>

                <h2>Pääjärjestäjät</h2>

                <div class="paragraph center">
                    <p>Valtteri Erkkilä</p>
                    <p>045 8689710</p>
                    <p>valtteri.erkkila@cluster.fi</p>
                </div>

                <div class="paragraph center">
                    <p>Miko Mattila</p>
                    <p>044 2105417</p>
                    <p>miko.mattila@ruut.me</p>
                </div>

                <h2>Ensiapu</h2>

                <div class="paragraph center">
                    <p>Tomi Tielinen</p>
                    <p>044 3243154</p>
                    <p>tomitielinen23@gmail.com</p>
                </div>

                <h2>Häirintäyhdyshenkilöt</h2>

                <div class="paragraph center">
                    <p>Tuomas Mustakallio</p>
                    <p>044 2709720</p>
                    <p>hairintayhdyshenkilo@cluster.fi</p>
                </div>

                <div class="paragraph center">
                    <p>Janni Timoskainen</p>
                    <p>044 9926010</p>
                    <p>Janni.timoskainen@cluster.fi</p>
                </div>
            </div>
            `
            break;

        case "pack":
            contentHolder.innerHTML = 
            `
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
            `
            break;

        default:
            contentHolder.innerHTML = `<h2>Sisältöä ei löytynyt.</h2>`
    }
}

const countdownTimer = () => {

    const eventDate = new Date(2024, 9, 18, 15).getTime(); 

    // Initial starting time on page load
    let timeDifference = eventDate - new Date().getTime();
    displayTime(timeDifference);

    // Starting the second-by-second
    setInterval(() => {
        timeDifference = eventDate - new Date().getTime();
        
        
        displayTime(timeDifference)
    }, 1000)
}   

const displayTime = (timeDifference) => {
    

    if (!document.getElementById("event-countdown")) {
        return;
    }

    // If the event has already begun
    if (timeDifference < 0) {
        document.getElementById("event-countdown").innerHTML = "Tapahtuma on alkanut!";
        return;
    } 
    
    let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    let countdown = 
    `${days} päivää, 
    ${hours} tuntia,
    ${minutes} minuuttia,
    ${seconds} sekuntia.`

    // Displaying the time difference
    document.getElementById("event-countdown").innerHTML = countdown;
}
