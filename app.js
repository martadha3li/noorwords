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

// أوقات صلاة تجريبية (لاحقاً نربط API)
const prayerTimes = {
    fajr: "05:00",
    sunrise: "06:15",
    dhuhr: "12:00",
    maghrib: "17:45"
};

document.getElementById("prayerTimes").innerHTML = `
الإمساك: 04:50 <br>
الفجر: ${prayerTimes.fajr} <br>
الشروق: ${prayerTimes.sunrise} <br>
الظهر: ${prayerTimes.dhuhr} <br>
المغرب: ${prayerTimes.maghrib}
`;

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
