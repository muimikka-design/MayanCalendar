
const glyphs = ["Imox", "Iq'", "Aq'ab'al", "K'at", "Kan", "Kame", "Kej", "Q'anil", "Toj", "Tz'i'", "B'atz'", "E'", "Aj", "I'x", "Tz'ikin", "Ajmaq", "No'j", "Tijax", "Kawoq", "Ajpu"];
const tones = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];

const haabMonths = ["POP", "WO", "SIP", "SOTZ'", "TZ'EK", "XUL", "YAXKIN", "MOL", "CHEN", "YAX", "SAK", "SEJ", "MAK", "KANKIN", "NWAN", "PAX", "KAYAB", "KUMKU", "WAYEB"];
const haabGlyphs = ["Kan(K'at)", "Chik Chan(Kan)", "Kimil (Kame)", "Manik (Kej)", "Lamat (Q'anil)", "Muluk (Toj)", "Ok (Tz'i')", "Chuen (B'atz')", "Eb (E')", "Ben (Aj)", "IX (I'x)", "MEN (Tz'ikin)", "Kib (Ajmaq)", "Kaban (No'j)", "Edznah (Tijax)", "Kauak (Kawoq)", "Ahau (Ajpu)", "Imix (Imox)", "Ik (Iq')", "AK'BAL (Aq'ab'al)"];

const USE_LOCAL_IMAGES = true; 
const LOCAL_IMAGE_FOLDER = "images";

function calculateMayan() {
    const yStr = document.getElementById('birthYear').value;
    const mStr = document.getElementById('birthMonth').value;
    const dStr = document.getElementById('birthDay').value;
    const errorMsg = document.getElementById('error-msg');
    const resultSection = document.getElementById('result-section');
    const initialState = document.getElementById('initial-state');
    
    if (!yStr || !mStr || !dStr) {
        errorMsg.innerText = "請填寫完整的年、月、日！";
        errorMsg.classList.remove('hidden'); resultSection.classList.add('hidden'); initialState.classList.remove('hidden');
        return;
    }

    const y = parseInt(yStr), m = parseInt(mStr), d = parseInt(dStr);
    const dateInput = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const targetDate = new Date(dateInput + "T12:00:00Z");

    if (isNaN(targetDate.getTime()) || targetDate.getUTCMonth() + 1 !== m || targetDate.getUTCDate() !== d) {
        errorMsg.innerText = "請輸入有效的日期 (例如該月份沒有這一天)！";
        errorMsg.classList.remove('hidden'); resultSection.classList.add('hidden'); initialState.classList.remove('hidden');
        return;
    }

    errorMsg.classList.add('hidden');
    const refDate = new Date("2012-12-21T12:00:00Z"); 
    const diffDays = Math.round((targetDate - refDate) / (1000 * 60 * 60 * 24));

    const tzolkinTotal = ((159 + diffDays) % 260 + 260) % 260;
    const glyphIndex = tzolkinTotal % 20, toneIndex = tzolkinTotal % 13;

    const haabTotal = ((166 + diffDays) % 365 + 365) % 365;
    const haabMonthIndex = Math.floor(haabTotal / 20), haabDay = haabTotal % 20;
    const haabGlyphIndex = (haabDay === 0) ? 19 : haabDay - 1;

    const tzGlyphName = glyphs[glyphIndex].trim();
    document.getElementById('tz-glyph-img').src = USE_LOCAL_IMAGES ? `${LOCAL_IMAGE_FOLDER}/${tzGlyphName}.png` : `https://placehold.co/200x200/fafaf9/78716c?text=${encodeURIComponent(tzGlyphName)}`;
    
    const haabMonthName = haabMonths[haabMonthIndex].split(' ')[0]; 
    document.getElementById('haab-month-img').src = USE_LOCAL_IMAGES ? `${LOCAL_IMAGE_FOLDER}/${haabMonthName}.jpg` : `https://placehold.co/200x200/fafaf9/b45309?text=${encodeURIComponent(haabMonthName)}`;

    const haabGlyphName = haabGlyphs[haabGlyphIndex];
    document.getElementById('haab-glyph-img').src = USE_LOCAL_IMAGES ? `${LOCAL_IMAGE_FOLDER}/${haabGlyphName}.jpg` : `https://placehold.co/200x200/fafaf9/b45309?text=${encodeURIComponent(haabGlyphName)}`;

    document.getElementById('tz-glyph').innerText = tzGlyphName;
    document.getElementById('tz-tone').innerText = tones[toneIndex];
    document.getElementById('tz-summary').innerText = ` ${tones[toneIndex]}  ${tzGlyphName}`;

    document.getElementById('haab-month').innerText = `第 ${haabMonthIndex + 1} 個月 (${haabMonths[haabMonthIndex]})`;
    document.getElementById('haab-day').innerText = `第 ${haabDay} 天`;
    document.getElementById('haab-glyph').innerText = haabGlyphs[haabGlyphIndex];
    document.getElementById('haab-summary').innerText = `${haabMonths[haabMonthIndex]} ${haabDay} ${haabGlyphs[haabGlyphIndex]}`;

    initialState.classList.add('hidden'); resultSection.classList.remove('hidden');
    resultSection.classList.remove('fade-in'); void resultSection.offsetWidth; resultSection.classList.add('fade-in');
}

// 網頁載入完成後，自動填入今天日期並進行一次計算
window.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    // 填入當前設備的年、月、日
    document.getElementById('birthYear').value = today.getFullYear();
    document.getElementById('birthMonth').value = today.getMonth() + 1; // JavaScript 的月份是 0-11，所以要 +1
    document.getElementById('birthDay').value = today.getDate();
    
    // 自動觸發計算函數
    calculateMayan();
});


// ==========================================
// PWA Service Worker 註冊
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('ServiceWorker 註冊成功！範圍：', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker 註冊失敗：', error);
      });
  });
}