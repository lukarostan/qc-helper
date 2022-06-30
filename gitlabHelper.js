
(   async () => {
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

    const fetchDescription = async () => {
        return fetch( `${ROOT_LINK}${id.join('')}/cached_widget.json` ).then( async (res) =>{
            if(res.ok){
                const data = await res.json();
                return data.description;
            }
    })
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

    const description = await fetchDescription();
    const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;

    const getTasks = () => {
        const links = description.match(urlRegex)
        return links.filter(l => l.includes("teamwork") && l.includes("tasks"))
    }

    const tasks = getTasks();
    // init button
    const openAllButton = document.createElement("div");
    openAllButton.innerHTML = "Open all commits ↗️";
    // match to default gitlab classes for style
    openAllButton.classList.add("btn","gl-button","btn-default","open-commits")
    openAllButton.addEventListener("click", onOpenLinks)

    const teamworkButton = document.createElement("div");
    const teamworkDropdown = `<div id="teamwork-dropdown" class="tw-dropdown dropdown-menu" style="display: none">
        <div class="button-group">
            <button id="mark-qa-ready" class="gl-button btn-default">Mark all ready for QA</button>
            <button id="mark-qc-done" class="gl-button btn-default">Mark all QC done</button>
        </div>
        <ul>
        </ul>
    </div>`
    teamworkButton.append(teamworkDropdown);
    teamworkButton.innerHTML = "Teamwork ↓" + teamworkDropdown;
    // match to default gitlab classes for style
    teamworkButton.classList.add("btn","gl-button","btn-default","teamwork")
    const onOpenTeamwork = (e) => {
        window.open( `https://www.teamwork.com/launchpad/login?redirect_uri=${"/"}&client_id=12f8070d8c495601f348043ebdf55a9182a31d60`, "_blank", 'location=yes,height=570,width=520,scrollbars=yes,status=yes')
        const dropdownEl = document.getElementById("teamwork-dropdown")
        e.preventDefault();
        e.stopPropagation();
        if(dropdownEl.style.display === "none"){
            dropdownEl.style.display = "flex"
            return;
        }
        dropdownEl.style.display = "none"

    }
    teamworkButton.addEventListener("click", onOpenTeamwork)

    const editBtn = document.querySelector("div.detail-page-header-actions .gl-new-dropdown");
    editBtn.prepend(openAllButton)
    editBtn.prepend(teamworkButton)

    const fetchTaskInfo = async (id) => {
        return fetch( `https://async.eu.teamwork.com/projects/api/v2/tasks/${id}.json` , {"mode" : "no-cors"}, ).then( async (res) =>{
            if(res.ok){
                const data = await res.json();
                return data;
            }
        })
    }

    tasks.map(async (t) => {
        // const taskInfo = await fetchTaskInfo(t.split("tasks/")[1])
        const item = document.createElement("li")
        item.innerHTML = t
        document.querySelector("#teamwork-dropdown ul").append(item)
    })

} )()
