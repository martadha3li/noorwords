// =======================
// Service Worker
// =======================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}

// =======================
// التاريخ الميلادي والهجري
// =======================
const today = new Date();

document.getElementById("todayDate").innerText =
today.toLocaleDateString('ar-SA',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic',{
day:'numeric',month:'long',year:'numeric'
}).format(today);

document.getElementById("hijriDate").innerText = hijri;

// =======================
// أوقات الأحساء (أساس)
// =======================
const ahsaPrayerTimes = {
    fajr: "04:50",
    dhuhr: "11:45",
    asr: "15:10",
    maghrib: "17:30",
    isha: "18:50"
};

// =======================
// حفظ المدينة
// =======================
function saveCity(){
    const city = document.getElementById("citySelect").value;
    localStorage.setItem("selectedCity", city);
    alert("تم حفظ المدينة");
    displayPrayerTimes();
}

function getCity(){
    return localStorage.getItem("selectedCity") || "ahsa";
}

// =======================
// الفوارق
// =======================
function saveOffsets(){
    localStorage.setItem("dammamOffset",
        parseInt(document.getElementById("dammamOffset").value) || 0);

    localStorage.setItem("riyadhOffset",
        parseInt(document.getElementById("riyadhOffset").value) || 0);

    alert("تم الحفظ");
}

function getOffset(city){
    if(city==="dammam") return parseInt(localStorage.getItem("dammamOffset")) || 0;
    if(city==="riyadh") return parseInt(localStorage.getItem("riyadhOffset")) || 0;
    return 0;
}

// =======================
// إضافة دقائق
// =======================
function addMinutes(time, minutes){
    let [h,m]=time.split(":").map(Number);
    let d=new Date();
    d.setHours(h);
    d.setMinutes(m+minutes);
    return d.getHours().toString().padStart(2,'0')+":"+
           d.getMinutes().toString().padStart(2,'0');
}

// =======================
// عرض الصلوات
// =======================
function displayPrayerTimes(){
    const city=getCity();
    const offset=getOffset(city);

    let html="";
    for(let key in ahsaPrayerTimes){
        html+= key+" : "+ addMinutes(ahsaPrayerTimes[key],offset)+"<br>";
    }

    document.getElementById("prayerTimes").innerHTML=html;
}

displayPrayerTimes();

// =======================
// إشعارات
// =======================
if("Notification" in window){
    Notification.requestPermission();
}

function notify(title){
    if(Notification.permission==="granted"){
        new Notification(title);
    }
}

// =======================
// التعقيب الذكي
// =======================
function checkPrayer(){
    const city=getCity();
    const offset=getOffset(city);

    const now=new Date();
    const current=now.getHours().toString().padStart(2,'0')+":"+
                  now.getMinutes().toString().padStart(2,'0');

    const dhuhr=addMinutes(ahsaPrayerTimes.dhuhr,offset);
    const maghrib=addMinutes(ahsaPrayerTimes.maghrib,offset);

    if(current===dhuhr){
        document.getElementById("taqibCard").style.display="block";
        document.getElementById("taqibText").innerText="تعقيب الظهر والعصر";
        notify("حان وقت تعقيب الظهر والعصر");
    }

    if(current===maghrib){
        document.getElementById("taqibCard").style.display="block";
        document.getElementById("taqibText").innerText="تعقيب المغرب والعشاء";
        notify("حان وقت تعقيب المغرب والعشاء");
    }
}

setInterval(checkPrayer,60000);
