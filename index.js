let trueCellCount = document.getElementById("rs-table").childElementCount;
let rowCount = Number("0");
let cellCount = Number("23");
let table = document.getElementById("rs-table");

function addCell() {
    if(cellCount < 23){
        cellCount++;

        let tempCell = document.querySelectorAll('[data-value]');
        tempCell = tempCell[cellCount - 1];
        tempCell.removeAttribute("style");
        setCookie("cellCount", cellCount, 365);
        setTotalPoints();
    }

}
function removeCell() {
    if(cellCount > 0){
        if(cellCount >= 24) cellCount--;

        let tempCell = document.querySelectorAll('[data-value]');
        tempCell = tempCell[cellCount - 1];
        tempCell.setAttribute("style", "display: none");

        cellCount--;
        setCookie("cellCount", cellCount, 365);
        setTotalPoints();
    }
}


function loadTable(){
    if(getCookie("cellCount") >= 24 || getCookie("numerList") == "" || getCookie("t1") != "") {
        resetTable();
    }
    else {
        setTable("cookie");
        let tempCount = +getCookie("cellCount");

        for(let i = 23; i > tempCount; i--) {
            removeCell();
        }
        cellCount = tempCount;
    }
}

function setTable(numerator) {
    let totalCellCount = Number(1);
    while(totalCellCount < 24) {
        let tableCell = document.createElement("div");
        tableCell.setAttribute("data-value", totalCellCount);
        let imgInput = document.createElement("input");
        let skillImg = document.createElement("label");
        let skillFrac = document.createElement("div");
        let numer = document.createElement("input");
        let denom = document.createElement("input");
        let slider = document.createElement("input");
        
        slider.classList.add("lv-slider");
        slider.type = "range";
        slider.min = 0;
        slider.max = 99;
        slider.step = 1;

        tableCell.classList.add("inv-cell");
        skillImg.classList.add("inv-img");
        imgInput.classList.add("img-input");
        skillFrac.classList.add("inv-fraction");      
        numer.classList.add("inv-num");
        denom.classList.add("inv-den");

        numer.type = "text";
        numer.placeholder = 0;
        numer.name = totalCellCount;
        

        denom.type = "text";
        denom.placeholder = 0;
        denom.name = totalCellCount;

        skillImg.alt = "Cell Img";
        skillImg.name = totalCellCount;
        imgInput.type = "file";
        imgInput.id = "imgIn"+ totalCellCount;
        imgInput.name = totalCellCount;
        skillImg.setAttribute("for", "imgIn" + totalCellCount);


        if(numerator == "cookie"){
            let numCookie = getCookie("numerList").split("|")[totalCellCount - 1];
            if(numCookie != "n/a") numer.value = numCookie;

            let denCookie = getCookie("denomList").split("|")[totalCellCount - 1];
            if(denCookie != "n/a") denom.value = denCookie;

            if(getCookie("hideZero") == "true") {
                numer.placeholder = "";
                denom.placeholder = "";
            }
            
            loadImage(skillImg);
        }

        if(getCookie("hideBorder") == "true") {
            numer.setAttribute("style","border: none;");
            denom.setAttribute("style","border: none;");
        }
        else {
            numer.setAttribute("style","border-width: 0.02rem;");
            denom.setAttribute("style","border-width: 0.02rem;"); 
        }

        numer.addEventListener('change', updateCookie);
        denom.addEventListener('change', updateCookie);
        imgInput.addEventListener("change", storeImage);

        skillFrac.appendChild(numer);
        skillFrac.appendChild(denom);
        tableCell.appendChild(imgInput);
        tableCell.appendChild(skillImg);
        tableCell.appendChild(skillFrac);
        tableCell.appendChild(slider);
        table.appendChild(tableCell);
    
        rowCount++;
        totalCellCount++;
    }

    if(totalCellCount == 24){
        let tableCell = document.createElement("div");
        tableCell.setAttribute("data-value", totalCellCount);

        let pointCounter = document.createElement("p");
        let points = document.createElement("p");

        tableCell.id = "total-count";
        tableCell.classList.add("inv-cell");
        pointCounter.textContent = "Total Level:";
        tableCell.appendChild(pointCounter);
        tableCell.appendChild(points);
        table.appendChild(tableCell);
    }
}

function setTotalPoints() {
    let total = Number(0);
    let maxCells = Number(getCookie("cellCount"));
    let numList = getCookie("numerList").split("|");
    for(let i = 0; i < maxCells; i++){
        let tempPoints = numList[i];
        if(tempPoints != "n/a") total += Number(tempPoints);
    }
    
    let totalCell = document.getElementById("total-count");
    totalCell.childNodes[1].textContent = total;
}

// https://stackoverflow.com/questions/20766590/how-to-save-user-text-input-html-input-as-cookie
function setCookie(cname,cvalue,exdays) {
    let d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    let expires = "expires="+d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}

function updateCookie() {
    let cname = "numerList";
    let cvalue = "n/a";
    if(this.classList[0] == "inv-den") cname = "denomList";
    if(this.value != "") cvalue = this.value;

    let list = getCookie(cname).split("|");
    list[Number(this.name) - 1] = cvalue;
    let newList = list.join("|");

    setCookie(cname, newList, 365);
    setTotalPoints();
}

// https://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript
function clearCookies() {
    document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
}

function storeImage() {
    // console.log(this);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        if(reader.result){
            localStorage.setItem("img-" + this.name, reader.result);
            location.reload();
        }
    });
    reader.readAsDataURL(this.files[0]);
    loadImage(this);
}

function loadImage(imgCell) {
    const storedImgURL = localStorage.getItem("img-" + imgCell.name);
    
    if(storedImgURL) {
        imgCell.setAttribute("style","background-image: url("+ storedImgURL + ");");
    }
    
}

function resetTable() {
    clearCookies();
    localStorage.clear();
    location.reload();

    let numerList = Array(23);
    numerList.fill("n/a");
    let denomList = Array(23);
    denomList.fill("n/a");

    setCookie("numerList", numerList.join("|"), 365);
    setCookie("denomList", denomList.join("|"), 365);
    setCookie("cellCount", 23, 365);
    setCookie("hideZero", "false", 365);
    setCookie("hideBorder", "false", 365);

    setTable("new");
}

function zeroOption() {
    let numer = document.getElementsByClassName("inv-num");
    let denom = document.getElementsByClassName("inv-den");
    if(getCookie("hideZero") == "false"){
        for(let i = 0; i < 23; i++){
            numer[i].placeholder = "";
            denom[i].placeholder = ""; 
        }
        setCookie("hideZero", "true", 365);
    }
    else {
        for(let i = 0; i < 23; i++){
            numer[i].placeholder = 0;
            denom[i].placeholder = 0; 
        }
        setCookie("hideZero", "false", 365);
    }
}

function borderOption() {
    let numer = document.getElementsByClassName("inv-num");
    let denom = document.getElementsByClassName("inv-den");

    if(getCookie("hideBorder") == "false"){
        for(let i = 0; i < 23; i++){
            numer[i].setAttribute("style","border: none;");
            denom[i].setAttribute("style","border: none;");
        }
        setCookie("hideBorder", "true", 365);
    }
    else {
        for(let i = 0; i < 23; i++){
            numer[i].setAttribute("style","border-width: 0.02rem;");
            denom[i].setAttribute("style","border-width: 0.02rem;"); 
        }
        setCookie("hideBorder", "false", 365);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadTable();
    setTotalPoints();

    let addButton = document.getElementById("add");
    addButton.onclick = addCell;
    let removeButton = document.getElementById("remove");
    removeButton.onclick = removeCell;

    let resetButton = document.getElementById("reset");
    resetButton.onclick = resetTable;

    let hide0 = document.getElementById("placehold");
    hide0.onclick = zeroOption;

    let hideBorder = document.getElementById("borders");
    hideBorder.onclick = borderOption;

 }, false);