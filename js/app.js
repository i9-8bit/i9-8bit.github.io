async function loadGames(){

    try{

        const response =
            await fetch(
                "games.json",
                {
                    cache:"no-store"
                }
            );


        if(!response.ok){

            throw new Error(
                "Could not load games.json"
            );

        }


        const games =
            await response.json();


        renderFeatured(games);

        renderRecentlyPlayed();

    }catch(error){

        console.error(
            "Game loading error:",
            error
        );

    }

}


/*
    FEATURED GAMES
*/

function renderFeatured(games){

    const container =
        document.getElementById(
            "featuredGames"
        );


    if(!container){
        return;
    }


    const featured =
        games.filter(
            game => game.featured
        );


    container.innerHTML =
        featured.map(
            game => {

                const playURL =
                    getPlayURL(game);


                const image =
                    game.image

                    ? `

                        <img
                            class="game-image"
                            src="${escapeHTML(
                                game.image
                            )}"
                            alt="${escapeHTML(
                                game.title ||
                                "Game"
                            )}"
                            onerror="
                                this.style.display='none'
                            "
                        >

                    `

                    : "";


                const external =
                    game.type === "web" &&
                    /^https?:\/\//i.test(
                        playURL
                    );


                return `

                    <article class="game-card">

                        ${image}

                        <div class="game-card-content">

                            <h3>
                                ${escapeHTML(
                                    game.title ||
                                    "Untitled"
                                )}
                            </h3>


                            <p>
                                ${escapeHTML(
                                    game.description ||
                                    ""
                                )}
                            </p>


                            <p>
                                ${escapeHTML(
                                    game.category ||
                                    ""
                                )}
                            </p>


                            <a
                                class="play-button"
                                href="${escapeHTML(
                                    playURL
                                )}"

                                ${
                                    external

                                    ? 'target="_blank" rel="noopener noreferrer"'

                                    : ""
                                }

                                onclick="saveRecentlyPlayed(
                                    ${escapeJS(game)}
                                )"
                            >
                                ▶ Play
                            </a>

                        </div>

                    </article>

                `;

            }
        )
        .join("");

}


/*
    RECENTLY PLAYED
*/

function getRecentlyPlayed(){

    try{

        return JSON.parse(
            localStorage.getItem(
                "incrwd-recently-played"
            ) || "[]"
        );

    }catch{

        return [];

    }

}


function saveRecentlyPlayed(game){

    let recent =
        getRecentlyPlayed();


    recent =
        recent.filter(
            item =>
                item.title !== game.title
        );


    recent.unshift({

        title:
            game.title || "Untitled",

        description:
            game.description || "",

        category:
            game.category || "",

        platform:
            game.platform || "",

        type:
            game.type || "",

        file:
            game.file || "",

        core:
            game.core || "",

        url:
            game.url || "",

        image:
            game.image || ""

    });


    recent =
        recent.slice(0,6);


    localStorage.setItem(
        "incrwd-recently-played",
        JSON.stringify(recent)
    );

}


function renderRecentlyPlayed(){

    const section =
        document.getElementById(
            "recentSection"
        );


    const container =
        document.getElementById(
            "recentGames"
        );


    if(!section || !container){
        return;
    }


    const recent =
        getRecentlyPlayed();


    if(!recent.length){

        section.style.display =
            "none";

        return;

    }


    section.style.display =
        "block";


    container.innerHTML =
        recent.map(
            game => {

                const playURL =
                    getPlayURL(game);


                const external =
                    game.type === "web" &&
                    /^https?:\/\//i.test(
                        playURL
                    );


                const image =
                    game.image

                    ? `

                        <img
                            class="game-image"
                            src="${escapeHTML(
                                game.image
                            )}"
                            alt="${escapeHTML(
                                game.title ||
                                "Game"
                            )}"
                            onerror="
                                this.style.display='none'
                            "
                        >

                    `

                    : `

                        <div class="recent-placeholder">
                            🎮
                        </div>

                    `;


                return `

                    <article class="game-card">

                        ${image}

                        <div class="game-card-content">

                            <h3>
                                ${escapeHTML(
                                    game.title ||
                                    "Untitled"
                                )}
                            </h3>


                            <p>
                                ${escapeHTML(
                                    game.description ||
                                    ""
                                )}
                            </p>


                            <p>
                                ${escapeHTML(
                                    game.platform ||
                                    ""
                                )}
                            </p>


                            <a
                                class="play-button"
                                href="${escapeHTML(
                                    playURL
                                )}"

                                ${
                                    external

                                    ? 'target="_blank" rel="noopener noreferrer"'

                                    : ""
                                }

                                onclick="saveRecentlyPlayed(
                                    ${escapeJS(game)}
                                )"
                            >
                                ▶ Play Again
                            </a>

                        </div>

                    </article>

                `;

            }
        )
        .join("");

}


/*
    PLAY URL
*/

function getPlayURL(game){

    if(
        game.type === "emulator" &&
        game.file
    ){

        return (

            "emulator.html?rom=" +
            encodeURIComponent(
                game.file
            ) +
            "&core=" +
            encodeURIComponent(
                game.core || ""
            )

        );

    }


    return game.url || "#";

}


/*
    CLEAR RECENT
*/

const clearRecent =
    document.getElementById(
        "clearRecent"
    );


if(clearRecent){

    clearRecent.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "incrwd-recently-played"
            );

            renderRecentlyPlayed();

        }
    );

}


/*
    ESCAPE HTML
*/

function escapeHTML(value){

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/*
    SAFELY EMBED GAME OBJECT
    INTO onclick
*/

function escapeJS(game){

    const clean = {

        title:
            game.title || "",

        description:
            game.description || "",

        category:
            game.category || "",

        platform:
            game.platform || "",

        type:
            game.type || "",

        file:
            game.file || "",

        core:
            game.core || "",

        url:
            game.url || "",

        image:
            game.image || ""

    };


    return JSON.stringify(
        clean
    )
    .replaceAll(
        "\\",
        "\\\\"
    )
    .replaceAll(
        "'",
        "\\'"
    );

}


loadGames();