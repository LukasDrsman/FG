console.log("===== SOURCED =====");

const MAX_IDX = 4;
const MIN_IDX = 1;
const TIMEOUT = 2000;

let dead = false;
let next = 1;

const killEvent = new Event("kill");
const resurrectEvent = new Event("resurrect");

const interactions = [
    {
        start: "touchstart",
        end: "touchend"
    },
    {
        start: "focusin",
        end: "focusout"
    },
    {
        start: "kill",
        end: "resurrect"
    }
]


const getCurrentSlide = () => Math.floor(window.scrollY / window.innerHeight) + 1;

// kill scrolling
const kill = (eventType, reject) => {
    reject();
    console.log(`----- REJECTED: ${eventType} event -----`)
    dead = true;
};


const scroll = (ms, idx) => {
    let scrollingTimeout = new Promise((resolve, reject) => {
        // resolves scrolling if no interaction occurs during `ms` timeout
        setTimeout(() => {
            resolve();
            console.log("----- RESOLVED -----");
        }, ms);

        // kills scrolling if interaction occurs during `ms` timeout
        interactions.forEach(interaction=> { 
            addEventListener(interaction.start, () => { kill(interaction.start, reject) })
        });
    });

    scrollingTimeout
    .then(() => {
        switch (idx) {
            case MAX_IDX:
                next = -1;
                break;
            
            case MIN_IDX:
                next = 1;
                break;
        }

        idx += next;
        
        document.getElementById(`slide${idx}`).scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        scroll(ms, idx);
    })
    .catch(() => {
        console.log("----- DEAD -----");
    });
}

scroll(TIMEOUT, getCurrentSlide());

// resurrect scrolling
const resurrect = eventType => {
    if (dead) {
        console.log(`----- RESURRECT: ${eventType} event -----`)
        setTimeout(scroll(TIMEOUT, getCurrentSlide()), TIMEOUT)

        dead = false;
    }
};

// attach event resurrector to event completion
interactions.forEach(interaction => {
    addEventListener(interaction.end, () => { resurrect(interaction.end) })
});


// async function populate() {
//     const requestURL = 'static/profesia.json';
//     const request = new Request(requestURL);
//     const response = await fetch(request);
//     const profesia = await response.text();
//     const obj = JSON.parse(profesia);

//     const ul = document.getElementById("profesia_embed");

//     obj.forEach(item => {
//         let li = document.createElement("div");
//         let h = document.createElement("div");
//         let p_loc = document.createElement("div");
//         let p_pay = document.createElement("div");

//         h.innerHTML = item.title;
//         p_loc.innerHTML = item.loc;
//         p_pay.innerHTML = item.pay;

//         h.classList.add("list_title");
//         h.classList.add("h2");
//         p_loc.classList.add("list_loc");
//         p_pay.classList.add("list_money");

//         li.classList.add("grey");
//         li.classList.add("embed_card")

//         li.append(h);
//         li.append(p_loc);
//         li.append(p_pay);

//         li.addEventListener("click", () => { 
//             fetch("/click").then(() => window.open(item.url));
//         });

//         ul.append(li);
//     });
// }

// populate();

document.querySelectorAll(".polls").forEach(item => {
    item.addEventListener("click", event => {
        fetch("/poll?num=" + encodeURIComponent(item.getAttribute("num")));
        //document.getElementById("slide1").scrollIntoView({ behavior: 'auto', block: 'center' });
        dispatchEvent(kill);
        var bublinka = document.getElementById("voted");
        var nadpis = document.getElementById("nadpisslide4");
        var tlacitko1 = document.getElementById("name1");
        var tlacitko2 = document.getElementById("name2");
        var tlacitko3 = document.getElementById("name3");
        bublinka.className = "snackbar show";
        nadpis.className = "h1 hide";
        tlacitko1.className = "list_names polls hide";
        tlacitko2.className = "list_names polls hide";
        tlacitko3.className = "list_names polls hide";
        setTimeout(() => {
                bublinka.className = bublinka.className.replace(" show", "");
                nadpis.className = nadpis.className.replace(" hide", "");
                tlacitko1.className = tlacitko1.className.replace(" hide", "");
                tlacitko2.className = tlacitko2.className.replace(" hide", "");
                tlacitko3.className = tlacitko3.className.replace(" hide", "");
                if (dead == 1) {
                    setTimeout(scroll(TIMEOUT, getCurrentSlide(), "resurrected-" + getCurrentSlide()), TIMEOUT_LONG);
                    dead = 0;
                }
            }, 3000);
    });
});