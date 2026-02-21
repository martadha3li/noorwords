const prayerNames = {
    Fajr: "الفجر",
    Sunrise: "الشروق",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء",
    Imsak: "الإمساك"
};

async function getPrayerTimes() {
    // يمكنك تغيير المدينة والدولة هنا أو جلبها عبر GPS
    const url = 'https://api.aladhan.com/v1/timingsByCity?city=Riyadh&country=SaudiArabia&method=4';
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const timings = data.data.timings;
        const date = data.data.date.readable;

        document.getElementById('current-date').innerText = date;
        displayPrayers(timings);
    } catch (error) {
        console.error("خطأ في جلب البيانات", error);
    }
}

function displayPrayers(timings) {
    const container = document.getElementById('prayer-times');
    container.innerHTML = ''; // مسح المحتوى القديم

    const keys = ['Imsak', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    keys.forEach(key => {
        const div = document.createElement('div');
        div.className = 'prayer-item';
        div.innerHTML = `
            <span>${prayerNames[key]}</span>
            <span>${timings[key]}</span>
        `;
        container.appendChild(div);
    });
}

getPrayerTimes();
