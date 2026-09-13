async function loadGames(){
    try{
        const response=await fetch("games.json");

        if(!response.ok)
            throw new Error("Could not load games.json");

        renderFeatured(await response.json());

    }catch(error){
        console.error("Game loading error:",error);
    }
}

function renderFeatured(games){

    const container=document.getElementById("featuredGames");

    if(!container)return;

    const featured=games.filter(game=>game.featured);

    container.innerHTML=featured.map(game=>{

        const playURL=
            game.type==="emulator" && game.file
            ? "emulator.html?rom="+
              encodeURIComponent(game.file)+
              "&core="+
              encodeURIComponent(game.core||"")
            : game.url||"#";

        const image=game.image
            ? `<img class="game-image"
                 src="${escapeHTML(game.image)}"
                 alt="${escapeHTML(game.title)}"
                 onerror="this.style.display='none'">`
            : "";

        return `
            <article class="game-card">
                ${image}

                <div class="game-card-content">
                    <h3>${escapeHTML(game.title)}</h3>

                    <p>${escapeHTML(
                        game.description||""
                    )}</p>

                    <p>${escapeHTML(
                        game.category||""
                    )}</p>

                    <a
                        class="play-button"
                        href="${escapeHTML(playURL)}"
                        ${game.type==="web" && /^https?:\/\//i.test(playURL)
                            ? 'target="_blank" rel="noopener noreferrer"'
                            : ""}
                    >
                        ▶ Play
                    </a>
                </div>
            </article>
        `;

    }).join("");
}

function escapeHTML(value){
    return String(value)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

loadGames();