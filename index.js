
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
                <img src="assets/logotext.svg" class="logo"/>
                <div id="text-holder">
                    <div class="split">
                        <div class="img-text-split">
                            <p>Haalarilanit järjestetään 18.10.–20.10. LAB-kampuksen liikuntasalissa Lappeenrannassa.</p>
                            <p>Luvassa on syksyn eeppisin pelihetki, kun lähes kaksisataa pelaajaa kerääntyy yhteen saliin ja nauttii yhdessä pelaamisen ilosta. Olitpa sitten intohimoinen e-urheilija tai rento viikonlopun pelaaja, peliseuraa riittää varmasti.</p>
                            <p>Laneilla järjestään lukuisia turnauksia, joissa pelaajat pääsevät tavoittelemaan ykköspaikkaa - Onko CS2 sinun lajisi, vai loistatko NHL-jäällä? Entä oletko ralliratojen kuningas ajosimulaattorilla? Nyt on sinun mahdollisuutesi näyttää taitosi niin järjestetyissä turnauksissa kuin ystäviesi kesken kisatessa!</p>
                        </div>
                    </div>
                
                    <div class="link-span-container">
                        <span class="span-replace">Tuo oma koneesi, liitä se kiinni verkkoon ja oletkin valmis kokemaan mukaansatempaavia pelikokemuksia! Lue lisää konepaikkojen tiedoista alempaa ja hanki lippusi. Lisäksi paikan päällä on kioski, josta voit hankkia pientä juotavaa ja purtavaa nautittavaksi kesken pelihetkien 
                            <a class="embedded-anchor" href="#"
                            onclick="renderContent('guide')">
                            (kts. Tapahtumakartta).
                            </a>
                        </span>    
                    </div>
                    <div class="link-span-container">
                        <span class="span-replace">Tapahtuma-alue on päihteetön eikä alueelle saa tuoda alkoholijuomia. Voit osallistua laneille matalalla kynnyksellä ja ilman mitään aikaisempaa kokemusta! Mikäli sinulla herää kysymyksiä Haalarilaneihin liittyen, ota yhteyttä                     
                            <a class="embedded-anchor" href="#"
                            onclick="renderContent('contact')">
                            pääjärjestäjiin.
                            </a>
                        </span>
                    </div>
                
                    <p class="boldened-p">Aika: pe 18.10. Klo 15:00 - su 20.10.2024 klo 12:00</p>
                    <p class="boldened-p">Paikka: LAB-kampuksen liikuntasali</p>
                    <div>
                    <p id="event-countdown"></p>
                    </div>
                </div>
                <div id="button-holder">
                    <form action="https://ruut.eventiolive.fi/events/669e13533633f9012f8b456c/">
                    <input id="ticket-button" type="submit" value="Osta lippu"/>
                    </form>
                </div>
                <div id="computer-info-holder">
                    <ul>
                        <h3>Konepaikkaan sisältyy</h3>
                        <li>80–100 cm leveä konepaikka</li>
                        <li>yksi sähköpistoke</li>
                        <li>yksi Ethernet –verkkoportti</li>
                        <li>yksi Haalarilani -haalarimerkki</li>
                        <li>Ilmainen osallistuminen kaikkiin virallisiin turnauksiin</li>
                    </ul>
                </div>
                
                <div class="link-span-container">
                    span>Tapahtuman virallinen tiedotuskanava on Haalarilanien Discord.</span>
                </div>
                
                <div id="button-holder">
                    <form action="https://discord.gg/KmzPVjnAWE">
                        <input id="ticket-button" type="submit" value="Liity Discord-palvelimelle"/>
                    </form>
                </div>
                <div id="sponsors-desktop">
                    <img src="assets/Sponssien logot/LOAS-logo-vihr.png" class="sponsor-logo"/>
                    <img src="assets/Sponssien logot/Lappeenranta, logo png valkoinen.png" class="sponsor-logo"/>
                </div>
                `
            countdownTimer();
            break;

        case "rules":
            contentHolder.innerHTML = 
            `
            <h1>Säännöt</h1>
            <div class="rule-category">
            <h3>Tapahtuma-alueelle ei saa tuoda</h3>
            <p>Toisten ihmisten vahingoittamiseen soveltuvia välineitä</p>
            <p>Alkoholia tai huumausaineita</p>
                    <p>Räjähteitä tai muita vaarallisia aineita</p>
                </div>

                <div class="rule-category">
                    <h3>Alkoholi ja tupakointi</h3>
                    <p>Alkoholin tai muiden päihdeaineiden nauttiminen ja hallussapito tapahtuma-alueella on ehdottomasti kiellettyä. Alkoholituotteet ja muut päihteet tulee jättää tapahtuman sisäänkäynnin lähelle niille erikseen osoitettuun paikkaan.<p/>
                    <p>Tupakoiminen ja sähkötupakointi on sallittua vain sille merkityllä alueella. Paikalla on tumppeja varten astia ja sitä tulee myös käyttää.</p>
                </div>

                <div class="rule-category">
                    <h3>Sähköverkko</h3>
                    <p>Kodinkoneiden ja muiden suuritehoisten sähkölaitteiden kytkeminen konepaikalle on ehdottomasti kiellettyä. Jokaiselle konepaikalle on varattu yksi sähköpistoke, josta riittää kullekin konepaikalle 350 W sähköteho.</p>
                    <p>Tapahtuma-alueelta löytyy yleiseen käyttöön tarkoitettu mikro ja vedenkeitin. Mikäli tietokoneesi tai muut sähkölaitteesi tarvitsevat yhteensä enemmän kuin 350 W sähkötehoa, ole ennakkoon yhteydessä järjestäjiin.</p>
                </div>

                <div class="rule-category">
                    <h3>Tapahtuma-alueen vauriot</h3>
                    <p>Tapahtuma-alueiden vaurioittaminen ja sotkeminen on ehdottomasti kiellettyä. Esimerkiksi tarrojen liimailu seiniin. Vahingonaiheuttaja on aina korvausvelvollinen.</p>
                </div>

                <div class="rule-category">
                    <h3>Verkko</h3>
                    <p>Tapahtuma-alueen verkossa on kiellettyä:</p>
                    <ul>
                        <li>
                            DHCP-palvelimet 
                        </li>
                        <li>
                            Verkkoliikenteen häiritseminen 
                        </li>
                        <li>
                            Muun liikenteen seuraaminen, kuin sen, jonka pääte- tai lähtöpiste, on oma tietokone 
                        </li>
                        <li>
                            Ylimääräisten laitteiden, kuten kytkinten tai palomuurin kytkeminen 
                        </li>
                        <li>
                            Tekijänoikeudella suojatun tai Suomen lain vastaisen materiaalin haku tai levitys. 
                        </li>
                    </ul>
                </div>

                <div class="rule-category">
                    <h3>Nukkuminen</h3>
                    <p>Turvallisuussyistä nukkuminen on sallittua ainoastaan omalla konepaikalla pystyasennossa (esimerkiksi pää konepaikalla). Nukkuminen lattialla tai muualla tapahtuma-alueella ei ole sallittua.</p>
                </div>

                <div class="rule-category">
                    <h3>Muuta</h3>
                    <ul>
                        <li>Kaikki Suomen lait ovat voimassa tapahtumassa.</li>
                        <li>Järjestäjät eivät vastaa mahdollisista laiterikoista. </li>
                        <li>Järjestäjillä on oikeus poistaa henkilö tapahtumapaikalta. Lipun hintaa ei palauteta. Erityistapauksissa on mahdollista, että henkilö poistetaan välittömästi paikalta.</li>
                        <li>Tekijä on aina vastuussa aiheuttamistaan vahingoista ja mahdollisista korvauksista.</li>
                    </ul
                </div>
            `
            break;

        case "guide":
            contentHolder.innerHTML =
            `
                <h1>Opasteet</h1>
                <img src="assets/floorplan.svg" class="floorplan"/>
            `
            break;
        
        case "tournament":
            contentHolder.innerHTML = 
            `
                <h1>Turnaukset</h1>
            `
            break;
            
        case "contact":
            contentHolder.innerHTML = 
            `
                <h1>Yhteystiedot</h1>
                <div class="contact-holder">
                    <ul class="organizer-list">
                        <h4>Pääjärjestäjät</h4>
                        <li class="contact-individual">
                            <span>Valtteri Erkkilä</span>
                            <span>045 8689710</span>
                            <span>valtteri.erkkila@cluster.fi</span>

                        </li>
                        <li class="contact-individual">
                            <span>Miko Mattila</span>
                            <span>044 2105417</span>
                            <span>miko.mattila@ruut.me</span>
                        </li>
                    </ul>
                    <ul class="organizer-list">
                        <h4>Ensiapu</h4>
                        <li class="contact-individual">
                            <span>Ei vielä tiedossa</span>
                        </li>
                    </ul>
                    <ul class="organizer-list">
                        <h4>Häirintäyhdyshenkilöt</h4>
                        <li class="contact-individual">
                            <span>Tuomas Mustakallio</span>
                            <span>044 2709720</span>
                            <span>hairintayhdyshenkilo@cluster.fi</span>   
                        </li>
                        <li class="contact-individual">
                            <span>Janni Timoskainen</span>
                            <span>044 9926010</span>
                            <span>Janni.timoskainen@cluster.fi</span>
                        </li>
                    </ul>
                </div>

            `
            break;

        case "pack":
            contentHolder.innerHTML = 
            `
                <h1>Pakkauslista</h1>
                <ul id="pack-list">
                    <p>
                        Pakkaa mukaan tarvitsemasi laitteet, ottaen huomioon konepaikan rajoitteet. 
                    </p>
                    <li>Tietokone/Konsoli</li>
                    <li>Näyttö</li>
                    <li>Näppäimistö/Ohjain</li>
                    <li>Hiiri & Hiirimatto</li>
                    <li>Kuulokkeet</li>
                    <li>Jatkojohto</li>
                    <li>Verkkokaapeli</li>
                    <li>Puhelimen / Kuulokkeiden latausjohto </li>
                    <li>Taskurahaa / Mobilepay</li>
                </ul>
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
