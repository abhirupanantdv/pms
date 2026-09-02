async function tryLogin(usr, pwd) {
    const baseUrl = 'http://192.168.101.180:8980';
    try {
        console.log(`Trying login for ${usr}...`);
        const loginRes = await fetch(`${baseUrl}/api/method/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usr, pwd })
        });
        if (loginRes.status === 200) {
            console.log(`Success! Logged in as ${usr}`);
            const cookie = loginRes.headers.get('set-cookie');

            console.log("Fetching workflow actions...");
            const actionsRes = await fetch(`${baseUrl}/api/method/get_quotation_workflow_actions?docname=QTN-00009`, {
                headers: { 'Cookie': cookie }
            });
            const text = await actionsRes.text();
            console.log("Actions Response:", text);
            return true;
        } else {
            console.log(`Failed for ${usr} (status ${loginRes.status})`);
        }
    } catch (err) {
        console.error("Error for", usr, err.message);
    }
    return false;
}

async function run() {
    const creds = [
        { usr: 'admin', pwd: 'Pms@ADV2026!@#' },
        { usr: 'Administrator', pwd: 'Pms@ADV2026!@#' },
        { usr: 'Administrator', pwd: 'admin' },
        { usr: 'admin', pwd: 'admin' }
    ];
    for (const c of creds) {
        if (await tryLogin(c.usr, c.pwd)) break;
    }
}

run();
