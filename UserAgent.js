const { userAgent } = navigator;
const regExp = /\(([^)]+)\)/;
const matches = regExp.exec(userAgent);

const getOS = () => {
    const result = {
        isIos: false,
        isAndroid: false,
        isOthers: false, // all the desktop
        isMac: false, // only macintosh
        name: '',
        version: '-',
        majorVersion: 0,
    };
    const matchesString = matches[1].split(';');

    if (/iP(ad|hone|od)/i.test(userAgent)) {
        let version = ''; let 
            majorVersion = '';
        for (let i = 0; i < matchesString.length; i += 1) {
            if (/ OS /i.test(matchesString[i])) {
                version = matchesString[i].replace(/[^0-9_]/g, '');
                majorVersion = matchesString[i].replace(/[^0-9_]/g, '').split('_')[0];
            }
        }
        result.version = version;
        result.majorVersion = parseInt(majorVersion);
        result.isIos = true;
        result.name = 'iPhone/iPad';
    } else if (/Android/i.test(userAgent)) {
        let version = ''; let 
            majorVersion = '';
        for (let j = 0; j < matchesString.length; j += 1) {
            if (/Android/i.test(matchesString[j])) {
                version = matchesString[j].replace(/[^0-9.]/g, '');
                majorVersion = matchesString[j].replace(/[^0-9]/g, '')[0];
            }
        }
        result.version = version;
        result.majorVersion = parseInt(majorVersion);
        result.isAndroid = true;
        result.name = 'Andriod';
    } else {
        result.isOthers = true;
        result.name = 'desktop';

        if (/Macintosh/i.test(userAgent)) {
            result.isMac = true;
            result.name = 'Macintosh';
        }
    }

    return result;
};

const getBrowser = () => {
    const detectBrowsers = /(Opera|Chrome|CriOS|SamsungBrowser|Safari|Firefox|FxiOS|Msie|Whale|Trident(?=\/))\/?\s*(\d+)/i;

    // detectVenders is detect for Chromium(but not chrome) browsers
    const detectVenders = /OPR|Whale|Electron|Crosswalk|Firefox|FxiOS|Edg|UCBrowser|ACHEETAHI|KAKAOTALK|Daum|Naver|FBAV|Instagram|LinkedInApp/i;

    /* inAppBrowsers is detect for inApp browsers
        - Crosswalk is Chromium on Android
        - UCBrowser is working like webview, so it can be considered as inApp browser
     */
    const inAppBrowsers = /UCBrowser|KAKAOTALK|Daum|Naver|FBAV|Instagram|LinkedInApp/i;

    const getNameVer = () => {
        let temp;
        let m = userAgent.match(detectBrowsers) || [];

        // detect ie
        if (/trident/i.test(m[1])) {
            temp = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
            return {
                name: 'IE',
                majorVersion: temp[1] || '',
            };
        }

        // android chrome or iOS safari agent name, but not chrome or safari
        if (m[1] === 'Chrome' || m[1] === 'Safari') {
            temp = userAgent.match(detectVenders);

            if (temp != null)
                return {
                    name: temp[1],
                    majorVersion: temp[2],
                };
        }

        m = m[2] ? [m[1], m[2]] : [navigator.appName, navigator.appVersion, '-?'];

        if ((temp = userAgent.match(/version\/(\d+)/i)) != null)
            m.splice(1, 1, temp[1]);

        return {
            name: m[0],
            majorVersion: m[1],
        };
    };

    const result = {
        isChrome: false,
        isSafari: false,
        isSamsung: false,
        isOthers: false,
        isInApp: false,
        name: '',
        majorVersion: 0,
    };

    if (detectVenders.test(userAgent)) {
        // Chromium browser include inApp browser
        result.isOthers = true;
    } else if (/SamsungBrowser/i.test(userAgent)) {
        result.isSamsung = true;
    } else if (/Chrome|CriOS/i.test(userAgent)) {
        result.isChrome = true;
    } else if (/Safari/i.test(userAgent)) {
        result.isSafari = true;
    } else {
        result.isOthers = true;
    }

    if (inAppBrowsers.test(userAgent)) {
        result.isInApp = true;
    }

    result.name = getNameVer().name;
    result.majorVersion = getNameVer().majorVersion;

    return result;
};

const getDevice = () => {
    let result = {};

    if (/iP(ad|hone|od)/i.test(userAgent)) {
        result = {
            name: matches[1],
        };
    } else {
        result = {
            name: matches[1].split(';').pop().split('/')[0],
        };
    }

    return result;
};

const os = getOS();
const browser = getBrowser();
const device = getDevice();

export { os, browser, device };
