function ensureUserWallet(usuario) {
    const bKey = userKey(LS.balance, usuario);
    const txKey = userKey(LS.txt, usuario);
    const cKey = userKey(LS.contacts, usuario);

    const legacyBalance = localStorage.getItem(LS.balance);
    const legacyTx = localStorage.getItem(LS.txt);
    const legacyContacts = localStorage.getItem(LS.contacts);

    if (localStorage.getItem(bKey) === null)
        localStorage.setItem(bKey, legacyBalance ?? String(DEFAULT_WALLET.balance));
    if (localStorage.getItem(txKey) === null)
        localStorage.setItem(txKey, legacyTx ?? JSON.stringify([]));
    if (localStorage.getItem(cKey) === null)
        localStorage.setItem(
            cKey,
            legacyContacts ?? JSON.stringify(DEFAULT_WALLET.contacts)
        );
}






function initWallet() {

    if (localStorage.getItem(LS.usuarios) === null) {

        setUsers([{ usuario: "admin", password: "1234" }]);
    }


    if (localStorage.getItem(LS.usuarioLogeado) === null)
        localStorage.setItem(LS.usuarioLogeado, "false");
    if (localStorage.getItem(LS.usuarioLogeado) === null)
        localStorage.setItem(LS.usuarioLogeado, "admin");


    ensureUserWallet(getCurrentUser());
}
initWallet();




function getBalance() {
    const key = userKey(LS.balance);
    return parseInt(localStorage.getItem(key) || "0", 10);
}

function setBalance(v) {
    localStorage.setItem(userKey(LS.balance), String(v));
}

function getTxt() {
    return JSON.parse(localStorage.getItem(userKey(LS.txt)) || "[]");
}

function addTx(tx) {
    const all = getTxt();
    all.unshift(tx);
    localStorage.setItem(userKey(LS.txt), JSON.stringify(all));
}

function renderBalance(selector) {
    const b = getBalance();
    $(selector).text(moneyCLP(b));
}

function deposit(amount) {
    const a = Number(amount);

    if (!Number.isFinite(a) || a <= 0) {
        return { ok: false, msg: "Ingresa un monto válido (mayor a 0)." };
    }

    const newB = getBalance() + a;
    setBalance(newB);

    addTx({
        type: "Depósito",
        amount: a,
        date: nowISO(),
        detail: "Depósito realizado",
    });

    return { ok: true, newBalance: newB };
}

// --- Contactos ---
function getContacts() {
    return JSON.parse(localStorage.getItem(userKey(LS.contacts)) || "[]");
}

function setContacts(list) {
    localStorage.setItem(userKey(LS.contacts), JSON.stringify(list));
}

// --- Transferencia ---
function sendMoney(contactName, amount) {
    const a = Number(amount);

    if (!contactName) {
        return { ok: false, msg: "Selecciona un contacto." };
    }
    if (!Number.isFinite(a) || a <= 0) {
        return { ok: false, msg: "Ingresa un monto válido (mayor a 0)." };
    }

    const b = getBalance();
    if (a > b) {
        return { ok: false, msg: "Saldo insuficiente." };
    }

    const newB = b - a;
    setBalance(newB);

    addTx({
        type: "Transferencia enviada",
        amount: a,
        date: nowISO(),
        detail: `Enviado a ${contactName}`,
    });

    return { ok: true, newBalance: newB };
}
