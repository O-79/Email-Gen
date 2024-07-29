const puppeteer = require('puppeteer');
const readline = require('readline');
const { LST_FIR, LST_SUR } = require('./Names');

let __LOOP__ = true;
let __i__ = 1;

function INC()
{
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`* ${__i__}`);
    __i__++;
}

const rl = readline.createInterface(
{
    input: process.stdin,
    output: process.stdout
});

rl.on('close', () =>
{
    console.log('\n* QUITTING . . .');
    __LOOP__ = false;
});

function RDM(MIN, MAX)
{
    if(MIN > MAX)
        [MIN, MAX] = [MAX, MIN];
    return Math.floor(Math.random() * (MAX + 1 - MIN)) + MIN;
}

async function EMAIL()
{
    const IDX_FIR = RDM(0, LST_FIR.length - 1);
    const IDX_SUR = RDM(0, LST_SUR.length - 1);
    let FIR = LST_FIR[IDX_FIR];
    let SUR = LST_SUR[IDX_SUR];

    const LST_SEP = [ ".", "_", "" ]
    const IDX_SEP = RDM(0, LST_SEP.length - 1);
    let SEP = LST_SEP[IDX_SEP];

    let NUM = "";
    if(RDM(0, 1) > 0)
        NUM = ((RDM(0, 3) == 0) ? "0" : "") + RDM(0, 99)

    const LST_DOM = [ "@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com", "@live.com", "@icloud.com", "@aol.com", "@protonmail.com", "@zoho.com", "@yandex.com", "@mail.com", "@yahoo.co.uk" ];
    let IDX_DOM = Math.floor(RDM(0, LST_DOM.length - 1) / (RDM(0, (LST_DOM.length / 2) - 1) + 1));
    let DOM = LST_DOM[IDX_DOM];

    if(RDM(0, 3) == 0)
        [FIR, SUR] = [SUR, FIR];

    // first (seldom last)
    // optional separator
    // last (seldom first)
    // optional number
    // weighted domain
    return `${FIR}${SEP}${SUR}${NUM}${DOM}`;
}

let __HIDE__ = false;

(async () =>
{
    const browser = await puppeteer.launch({ headless: __HIDE__ });
    const page = await browser.newPage();
    if(!__HIDE__)
        await page.setViewport({ width: 800, height: 600 });

    while (__LOOP__)
    {
        try
        {
            await page.goto('https://xkcd.com/newsletter/', { waitUntil: 'networkidle2' });

            await page.waitForSelector('input[type="email"]');
            E = await EMAIL()
            await page.type('input[type="email"]', E);
            await page.click('input[type="submit"][value="subscribe"]')

            INC();
        }
        catch (ERR)
        {
            console.error('\n* ERROR > ', ERR);
            process.exit(0);
        }
    }

    await browser.close();
})();
