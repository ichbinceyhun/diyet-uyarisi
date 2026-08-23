(async function () {

    if (window.top !== window.self) return;

    // Site adını al
    const hostname = window.location.hostname
        .replace(/^www\./, "")
        .toLowerCase();


    // Eklenti ayarlarından site listesini al
    const result = await chrome.storage.sync.get({
        sites: []
    });

    const sites = result.sites;


    // Bu site listede mi?
    const siteAllowed = sites.some(site => {

        site = site
            .replace(/^www\./, "")
            .toLowerCase();

        return (
            hostname === site ||
            hostname.endsWith("." + site)
        );

    });


    // Listede değilse hiçbir şey yapma
    if (!siteAllowed) return;


    // ==========================================
    // BU SEKMEDE BU SİTE İÇİN UYARI GÖSTERİLDİ Mİ?
    // ==========================================

    const storageKey = `diyet_uyari_${hostname}`;

    const alreadyConfirmed =
        sessionStorage.getItem(storageKey);


    // Daha önce "biliyorum" yazıldıysa tekrar gösterme
    if (alreadyConfirmed === "true") {
        return;
    }


    function createWarning() {

        if (document.getElementById("diyet-uyari-ekrani")) {
            return;
        }


        const overlay = document.createElement("div");

        overlay.id = "diyet-uyari-ekrani";


        overlay.innerHTML = `
            <div id="diyet-kutu">

                <div class="emoji">🥗</div>

                <h1>DİYETTESİN!</h1>

                <p class="ana-mesaj">
                    HABERİN OLSUN. AKILLI OL.
                </p>

                <p class="alt-mesaj">
                    Bu siteye girmeden önce hedefini hatırla.
                    <br><br>
                    Devam etmek için:
                    <strong>biliyorum</strong>
                    yaz.
                </p>

                <input
                    type="text"
                    id="diyet-input"
                    placeholder="biliyorum"
                    autocomplete="off"
                >

                <button
                    id="diyet-devam"
                    disabled
                >
                    BİLİYORUM, DEVAM ET
                </button>

            </div>
        `;


        document.documentElement.appendChild(overlay);


        const input =
            document.getElementById("diyet-input");

        const button =
            document.getElementById("diyet-devam");


        // Input hazır olduğunda odaklan
        setTimeout(() => {
            input.focus();
        }, 100);


        input.addEventListener("input", () => {

            const value = input.value
                .trim()
                .toLocaleLowerCase("tr-TR");

            button.disabled =
                value !== "biliyorum";

        });


        function continueSite() {

            const value = input.value
                .trim()
                .toLocaleLowerCase("tr-TR");


            if (value === "biliyorum") {

                // Bu sekmede bu site için tekrar sorma
                sessionStorage.setItem(
                    storageKey,
                    "true"
                );


                overlay.remove();

            }

        }


        button.addEventListener(
            "click",
            continueSite
        );


        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    !button.disabled
                ) {

                    continueSite();

                }

            }
        );

    }


    createWarning();

})();