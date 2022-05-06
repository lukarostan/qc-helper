(  () => {
    // get current MR link
    const linkArr = Array.from(window.location.href.split("merge_requests/"));
    const ROOT_LINK = `${linkArr[0]}merge_requests/`

    // get MR id
    const id = [];
    const tempArr = Array.from(linkArr[1]);
    tempArr.some(a => (/^\d$/.test(a) && id.push(a), (a === "?" || a === "/")))

    const fetchCommits =  () => {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", `${ROOT_LINK}${id.join('')}/commits.json`, false );
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }

    const response =  fetchCommits()

    const raw = response.split("commit-row-message");
    const commits = raw.filter(s => s.includes("js-onboarding-commit-item"))

    const links = [];

    commits.map(c => {
        const newArr = c.split('"')
        links.push(newArr[2].substring(0, newArr[2].length - 1));
    })

    const onOpenLinks = (e) => {
        e.preventDefault();
        e.stopPropagation();
        links.map(l => {
            window.open(`https://gitlab.com${l}`, '_blank');
        })
    }
    // init button
    const newButton = document.createElement("div");
    newButton.innerHTML = "Open all commits ↗️";
    // match to default gitlab classes for style
    newButton.classList.add("btn","gl-button","btn-default","open-commits")
    newButton.addEventListener("click", onOpenLinks)

    const editBtn = document.querySelector("div.detail-page-header-actions .gl-new-dropdown");
    editBtn.prepend(newButton)
} )()
