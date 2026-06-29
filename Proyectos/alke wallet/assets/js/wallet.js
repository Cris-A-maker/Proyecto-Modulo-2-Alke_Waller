function ensureUserWallet(email) {
    const bKey = userKey(LS.balance, email);
    const txKey = userKey(LS.tx, email);
    const cKey = userKey(LS.contacts, email);

    const legacyBalance = localStorage.getItem(LS.balance);
    const legacyTx = localStorage.getItem(LS.tx);
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

    if (localStorage.getItem(LS.users) === null) {

        setUsers([{ email: "admin@wallet.com", pass: "1234" }]);
    }


    if (localStorage.getItem(LS.logged) === null)
        localStorage.setItem(LS.logged, "false");
    if (localStorage.getItem(LS.user) === null)
        localStorage.setItem(LS.user, "admin@wallet.com");


    ensureUserWallet(getCurrentUser());
}
initWallet();