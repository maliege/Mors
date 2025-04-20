// Morse Kodu Eşleşmeleri (Mors'tan Karaktere)
var morseToChar = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
    '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
    '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
    '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
    '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
    '--..': 'Z',
    '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
    '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9',
    '.-.-.-': '.', '--..--': ',', '..--..': '?', '-.-.--': '!', '-....-': '-',
    '-..-.': '/', '.--.-.': '@', '-.--.': '(', '-.--.-': ')', ' ': ' ' // Boşluk için boşluk karakteri
};
// Karakterden Mors'a eşleşmeleri de oluşturalım (Tablo için)
var charToMorse = {};
for (var morse in morseToChar) {
    var char = morseToChar[morse];
    if (char !== ' ') { // Tabloda boşluğu göstermeyelim
        charToMorse[char] = morse;
    }
}
// DOM Elementleri
var dotBtn = document.getElementById('dotBtn');
var dashBtn = document.getElementById('dashBtn');
var translateBtn = document.getElementById('translateBtn');
var clearBtn = document.getElementById('clearBtn');
var morseInputDisplay = document.getElementById('morseInputDisplay');
var resultDisplay = document.getElementById('resultDisplay');
var morseTableBody = document.querySelector('#morseTable tbody');
var audioToggle = document.getElementById('audioToggle');
// Durum (State)
var currentMorseInput = '';
// Ses için AudioContext (İsteğe Bağlı)
var audioContext = null;
var dotDuration = 0.08; // saniye
var dashDuration = dotDuration * 3;
var frequency = 700; // Hz
function initAudioContext() {
    if (window.AudioContext || window.webkitAudioContext) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        // Kullanıcı etkileşimi sonrası 'suspended' durumu çözme
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }
    else {
        console.warn("Web Audio API bu tarayıcıda desteklenmiyor.");
        audioToggle.disabled = true; // Checkbox'ı devre dışı bırak
        audioToggle.checked = false;
    }
}
function playTone(duration) {
    if (!audioContext || !audioToggle.checked || audioContext.state !== 'running')
        return;
    var oscillator = audioContext.createOscillator();
    var gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine'; // Ton tipi
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    // Sesin aniden başlayıp bitmesini engellemek için küçük bir envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01); // Yavaşça başla
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration - 0.01); // Yavaşça bitir
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}
// Yardımcı Fonksiyon: Giriş ve Sonuç Alanlarını Güncelle
function updateDisplays(morse, result) {
    if (morse === void 0) { morse = currentMorseInput; }
    if (result === void 0) { result = '-'; }
    morseInputDisplay.textContent = morse || '-'; // Boşsa tire göster
    resultDisplay.textContent = result;
}
// Yardımcı Fonksiyon: Mors Tablosunu Doldur
function populateMorseTable() {
    if (!morseTableBody)
        return;
    morseTableBody.innerHTML = ''; // Mevcut içeriği temizle
    // Harfleri ve rakamları sıralı göstermek için
    var sortedChars = Object.keys(charToMorse).sort(function (a, b) {
        // Önce harfler, sonra rakamlar, sonra diğerleri
        var typeA = a.match(/[A-Z]/) ? 1 : (a.match(/[0-9]/) ? 2 : 3);
        var typeB = b.match(/[A-Z]/) ? 1 : (b.match(/[0-9]/) ? 2 : 3);
        if (typeA !== typeB)
            return typeA - typeB;
        return a.localeCompare(b); // Aynı tip içinde alfabetik/sayısal sırala
    });
    for (var _i = 0, sortedChars_1 = sortedChars; _i < sortedChars_1.length; _i++) {
        var char = sortedChars_1[_i];
        var morse = charToMorse[char];
        var row = morseTableBody.insertRow();
        var cellChar = row.insertCell();
        var cellMorse = row.insertCell();
        cellChar.textContent = char;
        cellMorse.textContent = morse;
    }
}
// Olay Dinleyicileri (Event Listeners)
dotBtn.addEventListener('click', function () {
    initAudioContext(); // Ses context'ini başlat (gerekirse)
    currentMorseInput += '.';
    updateDisplays();
    playTone(dotDuration); // Nokta sesi çal
});
dashBtn.addEventListener('click', function () {
    initAudioContext(); // Ses context'ini başlat (gerekirse)
    currentMorseInput += '-';
    updateDisplays();
    playTone(dashDuration); // Çizgi sesi çal
});
translateBtn.addEventListener('click', function () {
    var character = morseToChar[currentMorseInput];
    if (character) {
        updateDisplays(currentMorseInput, character);
    }
    else if (currentMorseInput === '') {
        updateDisplays('', '-'); // Boş giriş için tire
    }
    else {
        updateDisplays(currentMorseInput, '???'); // Bilinmeyen kod
    }
});
clearBtn.addEventListener('click', function () {
    currentMorseInput = '';
    updateDisplays('', '-'); // Her şeyi temizle
});
// Sayfa yüklendiğinde tabloyu doldur
document.addEventListener('DOMContentLoaded', function () {
    populateMorseTable();
    updateDisplays('', '-'); // Başlangıç durumunu ayarla
});
