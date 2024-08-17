
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
                <div id="text-holder">
                    <h1>Tervetuloa Haalarilaneille!</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
                <div id="button-holder">
                    <button>Varaa lippusi</button>
                </div>
                <div>
                    <p>Lanit alkaa klo 15 pe 18.10.2024</p>
                    <p id="event-countdown"></p>
                </div>
            `
            countdownTimer();
            break;

        case "rules":
            contentHolder.innerHTML = 
            `
                <h1>Säännöt</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            `
            break;

        case "guide":
            contentHolder.innerHTML =
            `
                <h1>Opasteet</h1>
                <img src="eif" alt="**Sisätilojen kartta**" />
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