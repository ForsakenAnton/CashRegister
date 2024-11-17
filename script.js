
const changeDueDiv = document.getElementById("change-due");
const cashDiv = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const totalPriceP = document.getElementById("total-price");
const cashChangeP = document.getElementById("cash-change");
const changeInDrawerDiv = document.getElementById("change-in-drawer");

let price = 1.87;
let cid = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
];

let monetaryUnits = [
    ["PENNY", 0.01],
    ["NICKEL", 0.05],
    ["DIME", 0.1],
    ["QUARTER", 0.25],
    ["ONE", 1],
    ["FIVE", 5],
    ["TEN", 10],
    ["TWENTY", 20],
    ["ONE HUNDRED", 100]
];

totalPriceP.textContent = `Total price: ${price}`;

const numberToFixed = (numb) => {
    return Number(numb.toFixed(2));
}

const calculateTotalCid = () => {
    const totalCashInDrawer = cid.reduce((acc, value) => acc + value[1], 0);

    return numberToFixed(totalCashInDrawer);
}

const drawCid = () => {
    changeInDrawerDiv.innerHTML = "";
    changeInDrawerDiv.insertAdjacentHTML("beforeend", "<h3>Change in drawer:</h3>")

    for (const el of cid) {
        const div = document.createElement("div");
        div.textContent = `${el[0]}: $${el[1]}`;
        changeInDrawerDiv.insertAdjacentElement("beforeend", div);
    }

    const totalCashInDrawer = calculateTotalCid();
    // console.log(totalCashInDrawer.toFixed(2));

    const div = document.createElement("div");
    div.textContent = `Total cash: $${totalCashInDrawer}`;
    div.classList.add("fw-bold");
    div.classList.add("fs-5");
    changeInDrawerDiv.insertAdjacentElement("beforeend", div);
}

const purchase = (cash) => {
    cash = numberToFixed(cash);
    console.log(cash);

    if (cash === price) {
        changeDueDiv.textContent = "No change due - customer paid with exact cash";
        return;
    } else if (numberToFixed(cash - price) > calculateTotalCid()) {
        changeDueDiv.textContent = "Status: INSUFFICIENT_FUNDS";
        return;
    }

    let cashChange = numberToFixed(cash - price);
    let changeDueMessage = "Status: OPEN";

    const cloneCid = structuredClone(cid);

    for (let index = cloneCid.length - 1; index >= 0; index--) {
        let changeFromDrawer = 0;

        while (true) {
            if (cloneCid[index][1] < monetaryUnits[index][1] ||
                cashChange < monetaryUnits[index][1]
            ) {
                if (changeFromDrawer > 0) {
                    changeDueMessage += ` ${cloneCid[index][0]}: $${changeFromDrawer}`;
                }
                break;
            }

            cloneCid[index][1] -= monetaryUnits[index][1];
            cashChange -= monetaryUnits[index][1];
            changeFromDrawer += monetaryUnits[index][1];

            cloneCid[index][1] = numberToFixed(cloneCid[index][1]);
            cashChange = numberToFixed(cashChange);
            changeFromDrawer = numberToFixed(changeFromDrawer);
        }
    }

    if (changeDueMessage === "Status: OPEN" ||
        cashChange !== 0
    ) {
        changeDueDiv.textContent = "Status: INSUFFICIENT_FUNDS";
        return;
    } else if (cloneCid.every(m => m[1] === 0)) {
        changeDueMessage = changeDueMessage.replace(/OPEN/ig, "CLOSED");
    }

    cid = cloneCid;

    changeDueDiv.textContent = changeDueMessage;

    drawCid();
}

const validateNumberInput = (value) => {
    if (isNaN(parseFloat(value))) {
        alert("Enter a valid sum");
        return false;
    }

    value = parseFloat(value);

    if (value < price) {
        alert("Customer does not have enough money to purchase the item");
        return false;
    }

    return true;
}


cashDiv.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && validateNumberInput(e.target.value)) {
        purchase(parseFloat(e.target.value));
    }
});

purchaseBtn.addEventListener("click", () => {
    if (validateNumberInput(cashDiv.value)) {
        purchase(parseFloat(cashDiv.value));
    }
});

cashDiv.addEventListener("input", (e) => {
    const value = e.target.value;

    if (isNaN(parseFloat(value))) {
        return;
    }

    const difference = numberToFixed(value - price);
    // cashChangeP.textContent = `Cash change: ${difference.toFixed(2)}`;
    cashChangeP.textContent = `Cash change: ${difference}`;

    if (difference < 0) {
        cashChangeP.classList.remove("text-info");
        cashChangeP.classList.add("text-warning");
    } else if (difference > 0) {
        cashChangeP.classList.remove("text-warning");
        cashChangeP.classList.add("text-info");
    } else {
        cashChangeP.classList.remove("text-warning");
        cashChangeP.classList.remove("text-info");
        cashChangeP.classList.add("text-secondary");
    }
});


drawCid();