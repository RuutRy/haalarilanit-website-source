let switchStatus = true;
let currentPage = "main";

// Loading the main content for the user from the get-go
document.addEventListener("DOMContentLoaded", () => {
  renderContent("main");
  switchLanguage()
});

const switchLanguage = () => {
  const translationButton = document.getElementById("translation");
  switchStatus = !switchStatus
  const currentLanguage = switchStatus ? english : finnish;
  translationButton.textContent = currentLanguage.translation_button.title; 
  translationButton.textContent = switchStatus ? "EN" : "FI";
  renderContent(currentPage);
}

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
            <p>${currentLanguage.main.main_1}</p>
            <p>${currentLanguage.main.main_2}</p>
            <p>${currentLanguage.main.main_3}</p>
            <p>
              ${currentLanguage.main.main_4.text}
                <a class="embedded-anchor" href="#"
                onclick="renderContent('guide')">
                ${currentLanguage.main.main_4.anchor}
                </a>
              .


            </p>
            <p>
              ${currentLanguage.main.main_5.text}
                <a class="embedded-anchor" href="#"
                onclick="renderContent('contact')">
                ${currentLanguage.main.main_5.anchor}
                </a>.
            </p>
          </div>

          <div class="paragraph">
            <h2>${currentLanguage.main.photos.header}</h2>
            <p>${currentLanguage.main.photos.text}.</p>
            <a href="https://cluster.kuvat.fi/kuvat/2024_014+-+Haalarilanit"/>2024</a>
          </div>

          <div>
            <span class="tournament-join"></span>
          </div>
          `;
      countdownTimer();
      break;

    case "rules":
      contentHolder.innerHTML = `
        <h1>${currentLanguage.rules.header}</h1>
        <div class="paragraph">
          <h2>${currentLanguage.rules.dont_bring.header}</h2>
          <ul>
            <li>${currentLanguage.rules.dont_bring.category_1}</li>
            <li>${currentLanguage.rules.dont_bring.category_2}</li>
            <li>${currentLanguage.rules.dont_bring.category_3}</li>
          </ul>
        </div>

        <div class="paragraph">
          <h2>${currentLanguage.rules.substances.header}</h2>
          <p>${currentLanguage.rules.substances.point_1}<p/>
          <p>${currentLanguage.rules.substances.point_2}</p>
        </div>

        <div class="paragraph">
          <h2>${currentLanguage.rules.power.header}</h2>
          <p>${currentLanguage.rules.power.point_1}</p>
          <p>${currentLanguage.rules.power.point_2}</p>
        </div>

        <div class="paragraph">
          <h2>${currentLanguage.rules.damages.header}</h2>
          <p>${currentLanguage.rules.damages.text}</>
        </div>

        <div class="paragraph">
          <h2>${currentLanguage.rules.network.header}</h2>
          <p>${currentLanguage.rules.network.beginning}</p>
          <ul>
            <li>${currentLanguage.rules.network.category_1}</li>
            <li>${currentLanguage.rules.network.category_2}</li>
            <li>${currentLanguage.rules.network.category_3}</li>
            <li>${currentLanguage.rules.network.category_4}</li>
            <li>${currentLanguage.rules.network.category_5}</li>
          </ul>
        </div>

        <div class="paragraph">
          <h2>${currentLanguage.rules.sleep.header}</h2>
          <p>${currentLanguage.rules.sleep.text}</p>
        </div>

        <div class="paragraph">
          <h2>${currentLanguage.rules.other.header}</h2>
          <ul>
            <li>${currentLanguage.rules.other.point_1}</li>
            <li>${currentLanguage.rules.other.point_2}</li>
            <li>${currentLanguage.rules.other.point_3}</li>
            <li>${currentLanguage.rules.other.point_4}</li>
          </ul
        </div>
        `;
      break;

    case "guide":
      contentHolder.innerHTML = `
        <h1>${currentLanguage.guidance.header}</h1>
        <img src="assets/floorplan.svg" id="floorplan"/>
        <div class="paragraph">
          <p>${currentLanguage.guidance.paragraph_1}</p>
          <p>${currentLanguage.guidance.paragraph_2}</p>
        </div>
        <h1>${currentLanguage.equipment.header}</h1>
        <div class="paragraph">
            <p>${currentLanguage.equipment.descriptor}</p>
            <ul id="pack-list">
                <li>${currentLanguage.equipment.equipment_1}</li>
                <li>${currentLanguage.equipment.equipment_2}</li>
                <li>${currentLanguage.equipment.equipment_3}</li>
                <li>${currentLanguage.equipment.equipment_4}</li>
                <li>${currentLanguage.equipment.equipment_5}</li>
                <li>${currentLanguage.equipment.equipment_6}</li>
                <li>${currentLanguage.equipment.equipment_7}</li>
                <li>${currentLanguage.equipment.equipment_8}</li>
                <li>${currentLanguage.equipment.equipment_9}</li>
            </ul>
        </div>
        `;
      break;

    case "tournament":
      contentHolder.innerHTML = `
          <h1>${currentLanguage.tournaments.header}</h1>
          <div class="paragraph center">
              <p>${currentLanguage.tournaments.text}</p>
          </div>
        `;
      break;

    case "contact":
      contentHolder.innerHTML = `
            <div>
                <h1>${currentLanguage.contacts.header}</h1>
                <div class="paragraph center">
                    <p>${currentLanguage.contacts.contact_1.name}</p>
                    <p>${currentLanguage.contacts.contact_1.responsibilities}</p>
                </div>
                <div class="paragraph center">
                    <p>${currentLanguage.contacts.contact_2.name}</p>
                    <p>${currentLanguage.contacts.contact_2.responsibilities}</p>
                    <p>miko.mattila@ruut.me</p>
                </div>
                <div class="paragraph center">
                    <p>${currentLanguage.contacts.contact_3.name}</p>
                    <p>${currentLanguage.contacts.contact_3.responsibilities}</p>
                </div>
            </div>
            `;
      break;

    default:
      contentHolder.innerHTML = `<h2>Sisältöä ei löytynyt.</h2>`;
  }
};

const countdownTimer = () => {
  const eventDate = new Date(2025, 9, 9, 15).getTime();

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

  const currentLanguage = switchStatus ? english : finnish

  let countdown = `${days} ${currentLanguage.main.time.d},
    ${hours} ${currentLanguage.main.time.h},
    ${minutes} ${currentLanguage.main.time.m},
    ${seconds} ${currentLanguage.main.time.s}`;

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
      d: "päivää",
      h: "tuntia",
      m: "minuuttia",
      s: "sekuntia",
    },
    purchase_button: "Osta lippu",
    header: "Mistä on kyse?",
    main_1: "Haalarilanit on suuri lanitapahtuma, jota on järjestetty LAB-kampuksen liikuntasalissa Lappeenrannassa.",
    main_2: "Luvassa on syksyn eeppisin pelihetki, kun lähes kaksisataa pelaajaa kerääntyy yhteen saliin ja nauttii yhdessä pelaamisen ilosta. Olitpa sitten intohimoinen e-urheilija tai rento viikonlopun pelaaja, peliseuraa riittää varmasti.",
    main_3: "Laneilla järjestetään lukuisia turnauksia, joissa pelaajat pääsevät tavoittelemaan ykköspaikkaa - Onko CS2 sinun lajisi, vai loistatko NHL-jäällä? Entä oletko ralliratojen kuningas ajosimulaattorilla? Nyt on sinun mahdollisuutesi näyttää taitosi niin järjestetyissä turnauksissa kuin ystäviesi kesken kisatessa!",
    main_4: {
      text: "Tuo oma koneesi, liitä se kiinni verkkoon ja oletkin valmis kokemaan mukaansatempaavia pelikokemuksia! Lisäksi paikan päällä on kioski, josta voit hankkia pientä juotavaa ja purtavaa nautittavaksi kesken pelihetkien ",
      anchor: "kts. Tapahtumapaikka",
    },
    main_5: {
      text: "Tapahtuma-alue on päihteetön eikä alueelle saa tuoda alkoholijuomia. Voit osallistua laneille matalalla kynnyksellä ja ilman mitään aikaisempaa kokemusta! Mikäli sinulla herää kysymyksiä Haalarilaneihin liittyen, ota yhteyttä ",
      anchor: "pääjärjestäjiin"
    },
    photos: {
      header: "Kuvapankki",
      text: "Alhaalla on linkki kuvapankkiin. Kuvat on otettu tapahtumapaikalta."
    }
  },
  rules: {
    header: "Säännöt",
    dont_bring: {
      header: "Tapahtuma-alueelle ei saa tuoda",
      category_1: "Toisten ihmisten vahingoittamiseen soveltuvia välineitä",
      category_2: "Alkoholia tai huumausaineita",
      category_3: "Räjähteitä tai muita vaarallisia aineita" 
    },
    substances: {
      header: "Alkoholi ja tupakointi",
      point_1: "Alkoholin tai muiden päihdeaineiden nauttiminen ja hallussapito tapahtuma-alueella on ehdottomasti kiellettyä. Alkoholituotteet ja muut päihteet tulee jättää tapahtuman sisäänkäynnin lähelle niille erikseen osoitettuun paikkaan.",
      point_2: "Tupakoiminen ja sähkötupakointi on sallittua vain sille merkityllä alueella. Paikalla on tumppeja varten astia ja sitä tulee myös käyttää."
    },
    power: {
      header: "Sähköverkko",
      point_1: "Kodinkoneiden ja muiden suuritehoisten sähkölaitteiden kytkeminen konepaikalle on ehdottomasti kiellettyä. Jokaiselle konepaikalle on varattu yksi sähköpistoke, josta riittää kullekin konepaikalle 350 W sähköteho.",
      point_2: "Tapahtuma-alueelta löytyy yleiseen käyttöön tarkoitettu mikro ja vedenkeitin. Mikäli tietokoneesi tai muut sähkölaitteesi tarvitsevat yhteensä enemmän kuin 350 W sähkötehoa, ole ennakkoon yhteydessä järjestäjiin."
    },
    damages: {
      header: "Tapahtuma-alueen vauriot",
      text: "Tapahtuma-alueiden vaurioittaminen ja sotkeminen on ehdottomasti kiellettyä. Esimerkiksi tarrojen liimailu seiniin. Vahingonaiheuttaja on aina korvausvelvollinen."
    },
    network: {
      header: "Verkko",
      beginning: "Tapahtuma-alueen verkossa on kiellettyä:",
      category_1: "DHCP-palvelimet",
      category_2: "Verkkoliikenteen häiritseminen",
      category_3: "Muun liikenteen seuraaminen, kuin sen, jonka pääte- tai lähtöpiste, on oma tietokone",
      category_4: "Ylimääräisten laitteiden, kuten kytkinten tai palomuurin kytkeminen",
      category_5: "Tekijänoikeudella suojatun tai Suomen lain vastaisen materiaalin haku tai levitys",
    },
    sleep: {
      header: "Nukkuminen",
      text: "Turvallisuussyistä nukkuminen on sallittua ainoastaan omalla konepaikalla pystyasennossa (esimerkiksi pää konepaikalla). Nukkuminen lattialla tai muualla tapahtuma-alueella ei ole sallittua.",
    },
    other: {
      header: "Muuta",
      point_1: "Kaikki Suomen lait ovat voimassa tapahtumassa",
      point_2: "Järjestäjät eivät vastaa mahdollisista laiterikoista",
      point_3: "Järjestäjillä on oikeus poistaa henkilö tapahtumapaikalta. Lipun hintaa ei palauteta. Erityistapauksissa on mahdollista, että henkilö poistetaan välittömästi paikalta",
      point_4: "Tekijä on aina vastuussa aiheuttamistaan vahingoista ja mahdollisista korvauksista"
    }
  },
  guidance: {
    header: "Opasteet",
    paragraph_1: "Haalarilaneille on 24h sisäänkäynti, joka tapahtuu parkkipaikan puoleisista ovista. Opastekarttaan on merkitty ovet, mistä tulee kulkea sekä tapahtuma-alueelle, että mm. vessoihin.",
    paragraph_2: "Tapahtuman ajan LAB-ammattikorkeakoulun parkkipaikat ovat vapaita pysäköinnille, eli niissä ei ole tällöin pysäköinninvalvontaa. Sisäänkäynti on esteetön."
  },
  tournaments: {
    header: "Turnaukset",
    text: "Vuoden 2025 turnausten aikataulut julkaistaan myöhemmin. Kiitokset kärsivällisyydestä!"
  },
  contacts: {
    header: "Yhteystiedot",
    contact_1: {
      name: "Jeremias Wahlsten",
      responsibilities: "Markkinointi, Live, Turnaukset"
    },
    contact_2: {
      name: "Miko Mattila",
      responsibilities: "Infra, Logistiikka"
    },
    contact_3: {
      name: "Tapio Wallden",
      responsibilities: "Kioski, Turvallisuus"
    }
  },
  equipment: {
    header: "Pakkauslista",
    descriptor: "Pakkaa mukaan tarvitsemasi laitteet, ottaen huomioon konepaikan rajoitteet",
    equipment_1: "Tietokone/Konsoli",
    equipment_2: "Näyttö",
    equipment_3: "Näppäimistö/Ohjain",
    equipment_4: "Hiiri & Hiirimatto",
    equipment_5: "Kuulokkeet",
    equipment_6: "Jatkojohto",
    equipment_7: "Verkkokaapeli (10m)",
    equipment_8: "Puhelimen / Kuulokkeiden latausjohto",
    equipment_9: "Taskurahaa / Mobilepay"
  }
}

const english = {
  translation_button: {
    title: "in English",
  },
  main: {
    time: {
      time: "Thu 9.10. from 15:00 - Sun 12.10.2025 till 12:00",
      where: "Where: Sports hall of LAB University of Applied Sciences",
      d: "days",
      h: "hours",
      m: "minutes",
      s: "seconds",
    },
    purchase_button: "Buy your ticket",
    header: "What's this all about?",
    main_1: "Haalarilanit is a big LAN-gaming event that has been held at the LAB University's gymnasium in Lappeenranta.",
    main_2: "The most epic gaming event of autumn will start when almost 200 gamers gather to enjoy the joy of gaming together. If you are a passionate eSport gamer or a casual weekend gaming enjoyer, there is definitely enough gamers to play with.",
    main_3: "Different gaming tournaments are held during the event where best of the best compete for the first place in different games like Counter Strike 2 or NHL. This will be your chance show what you are made of while competing agains your friends and foes.",
    main_4: { 
      text: "Bring your own Computer, connect it to the LAN and you are ready to experience the captivating world of LAN-parties. At the event there is a stand where you can buy drinks and something to eat during your gaming moments ",
      anchor: "(check event map)"
    },
    main_5: {
      text: "The event area is alcohol free zone so all alcoholic drinks are prohibited to bring inside. You don't need previous experience from a LAN-party event to attend and feel free to ask about this event from our ",
      anchor: "main organizers"
    },
    photos: {
      header: "Photos",
      text: "Link is under this text. Photos have been taken from the event area.",
    }
  },
  rules: {
    header: "Rules",
    dont_bring: {
      header: "You cannot bring these things to the event area",
      category_1: "Items that can hurt other people (knifes etc)",
      category_2: "Alcohol or drugs",
      category_3: "Explosives or other dangerous substancess" 
    },
    substances: {
      header: "Alcohol and smoking",
      point_1: "Usage and posession of alcohol or other intoxicants is prohibited in the event area. You must leave all alcoholic bewerages and other intoxicants outside of the event area.",
      point_2: "Smoking and vaping is allowed only at the places marked as smoking zones. Trash cans for cigarette butts can be found at the smoking places and must be used."
    },
    power: {
      header: "Electricity Grid",
      point_1: "Connecting household appliances and other high-power electrical devices to your electrical outlet is strictly prohibited. Each gamer gets one electrical outlet  which is sufficient for 350W of power.",
      point_2: "At the event there is a microwave and electric kettle for everyone to use. If your computer needs more then 350W of power, please contact the organizers before the event."
    },
    damages: {
      header: "Event area and damage",
      text: "Damaging and messing up the event area strictly prohibited. For example usage of stickers on walls. If you damage something you are always liable for compensation."
    },
    network: {
      header: "Internet and network",
      beginning: "You cannot do these things on the events network:",
      category_1: "DHCP-servers",
      category_2: "Interfering with network traffic",
      category_3: "Monitoring traffic other than traffic from your own computer",
      category_4: "Connecting additional devices, such as switches or firewalls",
      category_5: "Retrieving or distributing copurighted material or material that violates Finnish law",
    },
    sleep: {
      header: "Sleeping",
      text: "For safety reasons sleeping is only allowed at your own seat. Sleeping on the floor or in other places on the event area is prohibited.",
    },
    other: {
      header: "Other things",
      point_1: "Every Finnish law must be followed during the event",
      point_2: "Organizers are not liable for any broken computers or other devices",
      point_3: "Organizers have the right to remove a person from the event area. No refund of the ticket will be provided in the case of removal. On special occasions a person can be removed immediately from the event area.",
      point_4: "The perpetrator is always responsible for any damage caused and its compensation."
    }
  },
  guidance: {
    header: "Guidance",
    paragraph_1: "Entrance to the event is open for 24h a day and it is located near the LAB-University's parking lot. Entrance and doors to toilets are marked on the event map above.",
    paragraph_2: "During the event the LAB parking lot is free and there will be no parking control. Entrance is barrier-free."
  },
  tournaments: {
    header: "Tournaments",
    text: "2025 Tournaments and their times will be posted later. Thank you for your patience."
  },
  contacts: {
    header: "Contacts",
    contact_1: {
      name: "Jeremias Wahlsten",
      responsibilities: "Marketing, Live, Tournaments"
    },
    contact_2: {
      name: "Miko Mattila",
      responsibilities: "Infrastructure, Logistics"
    },
    contact_3: {
      name: "Tapio Wallden",
      responsibilities: "Stand, Security"
    }
  },
  equipment: {
    header: "Packing list",
    descriptor: "Bring all your needed gaming gear but be mindful of the restrictions of your seat",
    equipment_1: "Computer/Console",
    equipment_2: "Monitor",
    equipment_3: "Keyboard/Controller",
    equipment_4: "Moutse & Mousepad",
    equipment_5: "Headphones",
    equipment_6: "Extension cord",
    equipment_7: "Network cable (10m)",
    equipment_8: "Phone / Headphone charger",
    equipment_9: "Cash / Mobilepay"
  }
}
