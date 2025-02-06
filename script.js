function getCurrentDay() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('day') || 'saturday'; // مقدار پیش‌فرض: شنبه
}

function saveWorkout() {
    const name = document.getElementById('name').value;
    const reps = document.getElementById('reps').value;
    const sets = document.getElementById('sets').value;
    const weight = document.getElementById('weight').value;

    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index'); // گرفتن ایندکس حرکت ویرایش شده
    const day = getCurrentDay(); // روز فعلی را از URL بگیر

    if (name && reps && sets && weight) {
        const workout = `${name} - ${reps} تکرار - ${sets} ست - ${weight} کیلوگرم`;

        let workouts = JSON.parse(localStorage.getItem(`workouts-${day}`)) || [];

        if (index !== null) {
            workouts[index] = workout;
        } else {
            workouts.push(workout);
        }

        localStorage.setItem(`workouts-${day}`, JSON.stringify(workouts));

        // بازگشت به همان روز پس از ذخیره
        window.location.href = `${day}.html?day=${day}`;
    } else {
        alert("لطفاً تمام فیلدها را پر کنید.");
    }
}

function deleteWorkout() {
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index');
    const day = getCurrentDay();
    let workouts = JSON.parse(localStorage.getItem(`workouts-${day}`)) || [];

    if (index !== null) {
        workouts.splice(index, 1);
        localStorage.setItem(`workouts-${day}`, JSON.stringify(workouts));
    }

    window.location.href = `${day}.html?day=${day}`;
}

function displayWorkouts() {
    const day = getCurrentDay();
    const workouts = JSON.parse(localStorage.getItem(`workouts-${day}`)) || [];
    const list = document.getElementById('list');
    list.innerHTML = ''; // پاک کردن لیست قبلی

    workouts.forEach((workout, index) => {
        const li = document.createElement('li');
        li.textContent = workout;

        // اضافه کردن لینک ویرایش با ارسال `day` در URL
        li.onclick = function() {
            window.location.href = `edit_workout.html?index=${index}&day=${day}`;
        };

        list.appendChild(li);
    });
}

if (document.getElementById('list')) {
    displayWorkouts();
}

if (window.location.href.includes('edit_workout.html')) {
    loadWorkoutForEdit();
}

function loadWorkoutForEdit() {
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index');
    const day = getCurrentDay();
    const workouts = JSON.parse(localStorage.getItem(`workouts-${day}`)) || [];

    if (index !== null && workouts[index]) {
        const workout = workouts[index].split(' - ');
        document.getElementById('name').value = workout[0];
        document.getElementById('reps').value = workout[1].split(' ')[0];
        document.getElementById('sets').value = workout[2].split(' ')[0];
        document.getElementById('weight').value = workout[3].split(' ')[0];
    }
}

function cancelEdit() {
    const day = getCurrentDay();
    window.location.href = `${day}.html?day=${day}`;
}

// Check if the browser supports service workers
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker Registered:', registration);
            })
            .catch((error) => {
                console.error('Service Worker Registration Failed:', error);
            });
    });
}

// جلوگیری از رفتار پیش‌فرض لینک‌ها
document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const href = this.getAttribute('href');
            window.location.href = href;
        });
    });
});
