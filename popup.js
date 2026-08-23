const siteInput = document.getElementById("siteInput");
const addButton = document.getElementById("addButton");
const siteList = document.getElementById("siteList");


async function getSites() {
    const result = await chrome.storage.sync.get({
        sites: []
    });

    return result.sites;
}


async function saveSites(sites) {
    await chrome.storage.sync.set({
        sites: sites
    });
}


async function renderSites() {

    const sites = await getSites();

    siteList.innerHTML = "";


    if (sites.length === 0) {

        siteList.innerHTML = `
            <div style="
                text-align:center;
                color:#999;
                padding:20px;
                font-size:13px;
            ">
                Henüz site eklenmedi.
            </div>
        `;

        return;
    }


    sites.forEach(site => {

        const item = document.createElement("div");
        item.className = "site-item";


        const name = document.createElement("span");
        name.className = "site-name";
        name.textContent = site;


        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "✕";


        deleteButton.addEventListener("click", async () => {

            const currentSites = await getSites();

            const updatedSites = currentSites.filter(
                s => s !== site
            );

            await saveSites(updatedSites);

            renderSites();

        });


        item.appendChild(name);
        item.appendChild(deleteButton);

        siteList.appendChild(item);

    });

}


async function addSite() {

    let site = siteInput.value.trim().toLowerCase();


    // Boşsa hiçbir şey yapma
    if (!site) {
        return;
    }


    // https:// kaldır
    site = site.replace(/^https?:\/\//, "");

    // www. kaldır
    site = site.replace(/^www\./, "");

    // / sonrası varsa kaldır
    site = site.split("/")[0];


    const sites = await getSites();


    // Zaten ekliyse
    if (sites.includes(site)) {

        siteInput.value = "";

        alert("Bu site zaten listede.");

        return;

    }


    sites.push(site);

    await saveSites(sites);


    siteInput.value = "";


    await renderSites();

}


addButton.addEventListener("click", addSite);


siteInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addSite();

    }

});


renderSites();