// تسجيل Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}

// عرض التاريخ
const today = new Date();
document.getElementById("todayDate").innerText =
    today.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// مناسبات مخزنة محلياً
function getEvents() {
    return JSON.parse(localStorage.getItem("events") || "{}");
}

function addEvent() {
    const date = document.getElementById("eventDate").value;
    const text = document.getElementById("eventText").value;
    let events = getEvents();
    events[date] = text;
    localStorage.setItem("events", JSON.stringify(events));
    alert("تم الحفظ");
}

// عرض المناسبات
function checkEvents() {
    let events = getEvents();
    let todayStr = today.toISOString().split('T')[0];

    let tomorrow = new Date();
    tomorrow.setDate(today.getDate()+1);
    let tomorrowStr = tomorrow.toISOString().split('T')[0];

    if(events[todayStr]){
        document.getElementById("todayEventCard").style.display="block";
        document.getElementById("todayEvent").innerText=events[todayStr];
    }

    if(events[tomorrowStr]){
        document.getElementById("tomorrowEventCard").style.display="block";
        document.getElementById("tomorrowEvent").innerText=events[tomorrowStr];
    }
}

checkEvents();
// ===============================
// أوقات الأحساء (تقويم الزهراء 1447 - مثال تجريبي)
// لاحقاً نربطه بجدول شهري كامل
// ===============================
const ahsaPrayerTimes = {
    imsak: "04:40",
    fajr: "04:50",
    sunrise: "06:05",
    dhuhr: "11:45",
    asr: "15:10",
    maghrib: "17:30",
    isha: "18:50"
};

// ===============================
// حفظ الفوارق
// ===============================
function saveOffsets(){
    const dammam = parseInt(document.getElementById("dammamOffset").value) || 0;
    const riyadh = parseInt(document.getElementById("riyadhOffset").value) || 0;

    localStorage.setItem("dammamOffset", dammam);
    localStorage.setItem("riyadhOffset", riyadh);

    alert("تم حفظ الفوارق");
}

// ===============================
// جلب الفوارق
// ===============================
function getOffsets(){
    return {
        dammam: parseInt(localStorage.getItem("dammamOffset")) || 0,
        riyadh: parseInt(localStorage.getItem("riyadhOffset")) || 0
    };
}

// ===============================
// إضافة دقائق على الوقت
// ===============================
function addMinutes(time, minutes){
    let [h,m] = time.split(":").map(Number);
    let date = new Date();
    date.setHours(h);
    date.setMinutes(m + minutes);
    return date.getHours().toString().padStart(2,'0') + ":" +
           date.getMinutes().toString().padStart(2,'0');
}

// ===============================
// عرض الصلوات
// ===============================
function displayPrayerTimes(){

    const offsets = getOffsets();

    let html = `
    <h4>📍 الأحساء</h4>
    الفجر: ${ahsaPrayerTimes.fajr}<br>
    الظهر: ${ahsaPrayerTimes.dhuhr}<br>
    المغرب: ${ahsaPrayerTimes.maghrib}<br><br>

    <h4>📍 الدمام</h4>
    الفجر: ${addMinutes(ahsaPrayerTimes.fajr, offsets.dammam)}<br>
    الظهر: ${addMinutes(ahsaPrayerTimes.dhuhr, offsets.dammam)}<br>
    المغرب: ${addMinutes(ahsaPrayerTimes.maghrib, offsets.dammam)}<br><br>

    <h4>📍 الرياض</h4>
    الفجر: ${addMinutes(ahsaPrayerTimes.fajr, offsets.riyadh)}<br>
    الظهر: ${addMinutes(ahsaPrayerTimes.dhuhr, offsets.riyadh)}<br>
    المغرب: ${addMinutes(ahsaPrayerTimes.maghrib, offsets.riyadh)}<br>
    `;

    document.getElementById("prayerTimes").innerHTML = html;
}

displayPrayerTimes();
// التعقيب
function checkPrayerTime() {
    let now = new Date();
    let current = now.getHours().toString().padStart(2,'0') + ":" +
                  now.getMinutes().toString().padStart(2,'0');

    if(current === prayerTimes.maghrib){
        document.getElementById("taqibCard").style.display="block";
        document.getElementById("taqibText").innerText="تعقيب المغرب والعشاء";
    }
}

setInterval(checkPrayerTime, 60000);


// طلب إنشاء اختصار
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installBtn = document.createElement("button");
    installBtn.innerText = "📲 تثبيت التطبيق على الجهاز";
    installBtn.onclick = () => {
        deferredPrompt.prompt();
    };

    document.body.appendChild(installBtn);
});
