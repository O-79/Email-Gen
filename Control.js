const puppeteer = require('puppeteer');
const readline = require('readline');
const { _F_, _L_ } = require('./Names');

let __LOOP__ = true;
let __i__ = 1;

function inc()
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

function r(X, Y)
{
    if(X > Y)
        [X, Y] = [Y, X];
    return Math.floor(Math.random() * (Y + 1 - X)) + X;
}

async function email()
{
    const F_X = r(0, _F_.length - 1);
    const L_X = r(0, _L_.length - 1);
    let F = _F_[F_X];
    let L = _L_[L_X];

    const _X_ = [ ".", "_", "" ]
    const X_X = r(0, _X_.length - 1);
    let X = _X_[X_X];

    let N = "";
    if(r(0, 1) > 0)
        N = ((r(0, 3) == 0) ? "0" : "") + r(0, 99)

    const _D_ = [ "@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com", "@live.com", "@icloud.com", "@aol.com", "@protonmail.com", "@zoho.com", "@yandex.com", "@mail.com", "@yahoo.co.uk" ];
    let D_X = Math.floor(r(0, _D_.length - 1) / (r(0, (_D_.length / 2) - 1) + 1));
    let D = _D_[D_X];

    if(r(0, 3) == 0)
        [F, L] = [L, F];

    // first (seldom last)
    // optional separator
    // last (seldom first)
    // optional number
    // weighted domain
    return `${F}${X}${L}${N}${D}`;
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
            E = await email()
            await page.type('input[type="email"]', E);
            await page.click('input[type="submit"][value="subscribe"]')

            inc();
        }
        catch (error)
        {
            console.error('\n* ERROR > ', error);
            process.exit(0);
        }
    }

    await browser.close();
})();
