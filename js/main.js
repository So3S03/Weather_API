let navLinks = document.querySelectorAll('.nav-link');
let locationSearch = document.querySelector("#search");
let findLoc = document.querySelector("#finding");
let daysList = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
let monthsList = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
let forecastPre = [];
let forecastHtml = document.querySelector("#forecastDisplay");
let currentHtml = document.querySelector("#currentDisplay");
navLinks.forEach(element => {
    element.addEventListener('click', () => {
        navLinks.forEach(item => item.classList.remove('active'));
        element.classList.add('active');
    });
});
async function forecastData(location = "cairo"){
    let request = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=9f10672ebd2e4530889174653240401&q=${location}&days=7`)
    let data = await request.json();
    //*Current temp
    let locName = data.location.name;
    let time = data.location.localtime;
    let date = new Date(time)
    let arr = date.toString().split(" ")
    let day = daysList.find((e)=>{
        return e.startsWith(arr[0]);
    })
    let month = monthsList.find((e)=>{
        return e.startsWith(arr[1]);
    })
    let numDay = arr[2]
    let temperature = data.current.temp_c;
    let conditionText = data.current.condition.text;
    let conditionIcon = data.current.condition.icon
    displayCurrentForecast(day,numDay,month,temperature,locName,conditionText,conditionIcon)
    //*forecast for 7 days
    forecastPre = [];
    let forecast = data.forecast.forecastday;
    forecast.forEach( e => {
        forecastPre.push(e)
    })
    displayForecast();
}
async function data(x) { 
    await forecastData(x)
}
data();
findLoc.addEventListener("click", ()=>{
    let value = locationSearch.value;
    data(value)
})
function displayForecast(){
    let maxTemp = ``;
    let minTemp = ``;
    let condText = ``;
    let codIcon = ``;
    let day = ``;
    let temp =``
    for(let i = 1; i<forecastPre.length; i++){ 
        maxTemp = forecastPre[i].day.maxtemp_c;
        minTemp = forecastPre[i].day.mintemp_c;
        condText = forecastPre[i].day.condition.text;
        codIcon = forecastPre[i].day.condition.icon;
        day = forecastPre[i].date;
        let date2 = new Date(day)
        dayRes = daysList.find( e =>{
            return e.startsWith(date2.toString().split(" ")[0])
        })
        temp +=`<div class="col-lg-4 rounded-2">
                    <div class="w-100">
                        <div class="text-gray bg-darkBlue4 w-100 px-2 text-center rounded-top-2"> 
                            <p class="py-2 mb-0">${dayRes}</p>
                        </div>
                        <div class="bg-darkBlue5 d-flex text-gray justify-content-center align-items-center flex-column p-2 rounded-bottom-2">
                            <img class="mt-3 pt-4" src= "${codIcon}" alt="condition">
                            <h4 class="pt-3 pb-3 text-light fw-bold">${maxTemp}<sup>o</sup>C</h4>
                            <p>${minTemp}<sup>o</sup>C</p>
                            <p class="text-info fw-lighter pt-1 pb-3 mb-3">${condText}</p>
                        </div>
                    </div>
                </div>`
    }
    forecastHtml.innerHTML = temp
}
function displayCurrentForecast(day,numDay,month,Temp,loc,cond,icon){
    let temp = `<div class="col-lg-12 rounded-2  d-flex justify-content-center">
                    <div class="w-50 w-r-100 rounded-2">
                        <div class="d-flex justify-content-between text-gray bg-darkBlue2 w-100 px-2 rounded-top-2"> 
                            <p class="my-2">${day}</p>
                            <p class="my-2">${(numDay < 10) ? numDay[1] : numDay} ${month}</p>
                        </div>
                        <div class="rounded-bottom-2 bg-darkBlue3 p-3 text-gray">
                            <p class="mt-3">${loc}</p>
                            <div class="d-flex justify-content-between mb-3 align-items-center">
                            <h1 class="fw-bolder text-light fs-r-4">${Temp}<sup>o</sup>C</h1>
                            <img class="me-4" src="${icon}" alt="condition">
                            </div>
                            <p class="text-info fw-lighter">${cond}</p>
                            <div class="d-flex justify-content-start">
                                <p class="me-4"><i class="fa-solid fa-umbrella"></i> 20%</p>
                                <p class="me-4"><i class="fa-solid fa-wind"></i> 18km/h</p>
                                <p class="me-4"><i class="fa-regular fa-compass"></i> East</p>
                            </div>
                        </div>
                    </div>
                </div>`
    currentHtml.innerHTML = temp
}
