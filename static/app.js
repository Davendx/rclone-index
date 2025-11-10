var filterEl = document.getElementById('filter');
filterEl.focus();
function filter() {
    var q = filterEl.value.trim().toLowerCase();
    var elems = document.querySelectorAll('tr.file');
    elems.forEach(function(el) {
        if (!q) {
            el.style.display = '';
            return;
        }
        var nameEl = el.querySelector('.name');
        var nameVal = nameEl.textContent.trim().toLowerCase();
        if (nameVal.indexOf(q) !== -1) {
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    });
}
function localizeDatetime(e, index, ar) {
    if (e.textContent === undefined) {
        return;
    }
    var d = new Date(e.getAttribute('datetime'));
    if (isNaN(d)) {
        d = new Date(e.textContent);
        if (isNaN(d)) {
            return;
        }
    }
    e.textContent = d.toLocaleString([], {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"});
}
var timeList = Array.prototype.slice.call(document.getElementsByTagName("time"));
timeList.forEach(localizeDatetime);
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};
function toggle(className){
    var order = getUrlParameter('order');
    var elements = document.getElementsByClassName(className);
    for(var i = 0, length = elements.length; i < length; i++) {
        var currHref = elements[i].href;
        if(order=='desc'){
            var chg = currHref.replace('desc', 'asc');
            elements[i].href = chg;
        }
        if(order=='asc'){
            var chg = currHref.replace('asc', 'desc');
            elements[i].href = chg;
        }
    }
};
function readableFileSize(size) {
    var units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var i = 0;
    while(size >= 1024) {
        size /= 1024;
        ++i;
    }
    return parseFloat(size).toFixed(2) + ' ' + units[i];
}
function changeSize() {
    var sizes = document.getElementsByTagName("size");
    for (var i = 0; i < sizes.length; i++) {
        humanSize = readableFileSize(sizes[i].innerHTML);
        sizes[i].innerHTML = humanSize
    }
}
function colorHeader() {
    const h1 = document.querySelector('h1');
    if (!h1) return;
    const links = h1.querySelectorAll('a');
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#4285F4', '#34A853', '#EA4335'];

    links.forEach((link, linkIndex) => {
        link.style.color = colors[linkIndex % colors.length];
    });
}

document.getElementById('jdownloader').addEventListener('click', function() {
    var fileLinks = [];
    var linkElements = document.querySelectorAll('tr.file a');
    linkElements.forEach(function(el) {
        // only add links that don't go up a directory
        if (el.getAttribute('href') !== '..') {
            fileLinks.push(el.href);
        }
    });

    var breadcrumbs = document.querySelectorAll('h1 a');
    var packageName = breadcrumbs[breadcrumbs.length - 1].textContent.trim();

    sendToJDownloader(fileLinks, packageName);
});

function sendToJDownloader(links, packageName) {
    var key = CryptoJS.enc.Utf8.parse('1234567890987654');
    var iv = key;

    var data = {
        "packageName": packageName,
        "urls": links.join('\r\n')
    };

    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    var params = new URLSearchParams({
        passwords: '',
        source: window.location.href,
        jk: "function f(){ return '31323334353637383930393837363534';}",
        crypted: encrypted.toString()
    });

    fetch('http://1227.0.0.1:9666/flash/addcrypted2', {
        method: 'POST',
        body: params,
        mode: 'no-cors'
    }).then(response => {
        // We can't actually read the response in no-cors mode,
        // but a successful dispatch means JDownloader is likely running.
        // A failed dispatch will be caught in the .catch block.
    }).catch(err => {
        alert('Could not connect to JDownloader. Please make sure it is running and the Click\'n\'Load extension is enabled.');
        console.error('Error sending to JDownloader:', err);
    });
}

// Theme switcher logic
document.addEventListener('DOMContentLoaded', () => {
    const settingsButton = document.getElementById('settings-button');
    const settingsPanel = document.getElementById('settings-panel');
    const themeButtons = document.querySelectorAll('.theme-button');
    const body = document.body;

    // Toggle settings panel
    settingsButton.addEventListener('click', () => {
        settingsPanel.classList.toggle('hidden');
    });

    // Function to set the theme
    const setTheme = (theme) => {
        // Remove all theme classes
        body.classList.remove('theme-light', 'theme-blue');

        // Add the selected theme class if it's not the default dark theme
        if (theme !== 'dark') {
            body.classList.add(`theme-${theme}`);
        }

        // Update active state on buttons
        themeButtons.forEach(button => {
            if (button.dataset.theme === theme) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Save theme to local storage
        localStorage.setItem('theme', theme);
    };

    // Add click event listeners to theme buttons
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedTheme = button.dataset.theme;
            setTheme(selectedTheme);
        });
    });

    // Load saved theme from local storage
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark theme
    setTheme(savedTheme);
});
