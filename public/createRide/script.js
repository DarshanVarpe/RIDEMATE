const seatsOfferRide = document.getElementById('seatsOfferRide');
const dateInputOfferRide = document.getElementById('dateInputOfferRide');
const timeInputOfferRide = document.getElementById('timeInputOfferRide');
const vehicleOfferRide = document.getElementById('vehicleOfferRide');
const fareOfferRide = document.getElementById('fareOfferRide');

function validateInput(inputElement, limit, min) {
    inputElement.dataset.maxLimit = limit;
    inputElement.dataset.minLimit = min;
    
    if (!inputElement.hasAttribute('data-validation-bound')) {
        inputElement.setAttribute('data-validation-bound', 'true');
        inputElement.addEventListener("input", function (event) {
            let value = this.value;
            value = value.replace(/\D/g, "");

            const currentLimit = parseInt(this.dataset.maxLimit, 10);
            const currentMin = parseInt(this.dataset.minLimit, 10);

            if (value !== "") {
                const numValue = parseInt(value, 10);
                if (numValue > currentLimit) {
                    value = currentLimit.toString();
                } else if (numValue < currentMin) {
                    value = currentMin;
                }
            }
            this.value = value;
        });
    }
}

document.getElementById('backPage').href = 'javascript:void(0);';
document.getElementById('backPage').onclick = () => {
    if (window.history.length <= 1) {
        window.location.href = '/home';
    } else {
        window.history.back();
    }
}

function setDateTime() {
  let now = new Date();
  now.setMinutes(now.getMinutes() + 10);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;  

  const formattedTime = now.toLocaleTimeString([], { //format date 
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  dateInputOfferRide.value = formattedDate;
  dateInputOfferRide.setAttribute('min', formattedDate);

  timeInputOfferRide.value = formattedTime;
}


function saveFormState() {
    const state = {
        from: document.getElementById('fromOfferRide').value,
        to: document.getElementById('toOfferRide').value,
        date: document.getElementById('dateInputOfferRide').value,
        time: document.getElementById('timeInputOfferRide').value,
        seats: document.getElementById('seatsOfferRide').value,
        fare: document.getElementById('fareOfferRide').value
    };
    sessionStorage.setItem('offerRideState', JSON.stringify(state));
}

function handleVehicleSelection(select) {
  const selectedValue = select.value;

  if (selectedValue === "") {
    select.value = "";
    saveFormState();
    window.location.href = "/vehicle/manageVehicles?returnTo=/offer_Ride";
  } else {
    fareOfferRide.readOnly = false;
    seatsOfferRide.readOnly = false;
    fareOfferRide.value = "";
    seatsOfferRide.value = "";

    const selectedOption = select.options[select.selectedIndex];

    const vehicleType = selectedOption.getAttribute("data-vehicletype");

    if (vehicleType === "car") {
      validateInput(seatsOfferRide, 4, 1);
      validateInput(fareOfferRide, 2000, 0);

    } else if (vehicleType === "bike") {

      validateInput(seatsOfferRide, 2, 1);
      validateInput(fareOfferRide, 1000, 0);

    }
  }
}

function restoreFormState() {
    const savedStateStr = sessionStorage.getItem('offerRideState');
    if (savedStateStr) {
        try {
            const state = JSON.parse(savedStateStr);
            if(state.from) document.getElementById('fromOfferRide').value = state.from;
            if(state.to) document.getElementById('toOfferRide').value = state.to;
            if(state.date) document.getElementById('dateInputOfferRide').value = state.date;
            if(state.time) document.getElementById('timeInputOfferRide').value = state.time;
            if(state.seats) document.getElementById('seatsOfferRide').value = state.seats;
            if(state.fare) document.getElementById('fareOfferRide').value = state.fare;
        } catch(e) {
            console.error(e);
        }
        sessionStorage.removeItem('offerRideState');
    }
}

function fetchVehicles() {
  fetch(`/vehicle/getVehicles?t=${new Date().getTime()}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // Clear existing options except placeholder
      vehicleOfferRide.innerHTML = '<option value="" class="text-gray-500" disabled selected>Select a vehicle...</option>';
      for (let i = 0; i < data.length; i++) {
        let option = document.createElement("option");
        option.value = data[i]._id;
        option.textContent = data[i].model + " - " + data[i].numberPlate;

        option.setAttribute("data-vehicletype", data[i].vehicleType);

        vehicleOfferRide.appendChild(option);
      }
      let option = document.createElement("option");
      option.value = "";
      option.className = "font-sm";
      option.textContent = "➕ Add New Vehicle";
      vehicleOfferRide.appendChild(option);
    }).catch(error => {
      console.log(error);
    })
}

document.addEventListener('DOMContentLoaded', function () {
  setDateTime();
  restoreFormState();
  fetchVehicles();
});

document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible') {
    fetchVehicles();
  }
});


document.getElementById('OfferRideSubmitBtn').addEventListener('click', (e) => {
  document.getElementById('OfferRideSubmitBtn').disabled = true;
  const form = document.getElementById('offerRidesOption');
  let vehicleOfferRide = form.querySelector('#vehicleOfferRide');

  if (form.checkValidity()) {
    e.preventDefault();

    let fromFindRideValue = form.querySelector('#fromOfferRide');
    let toFindRideValue = form.querySelector('#toOfferRide');
    let dateInputOfferRide = form.querySelector('#dateInputOfferRide');
    let timeInputOfferRide = form.querySelector('#timeInputOfferRide');
    let seatsOfferRide = form.querySelector('#seatsOfferRide');
    let fareOfferRide = form.querySelector('#fareOfferRide');

    const dateValue = dateInputOfferRide.value;
    const timeValue = timeInputOfferRide.value;

    const localDateTime = `${dateValue}T${timeValue}`;

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; //convert local date time to UTC

    const utcDateTime = new Date(
      new Date(localDateTime).toLocaleString('en-US', { timeZone: userTimeZone })
    ).toISOString();

    fetch('/ride', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        from: fromFindRideValue.value,
        to: toFindRideValue.value,
        datetime: utcDateTime,
        fare: Number(fareOfferRide.value),
        seats: Number(seatsOfferRide.value),
        vehicleDetails: vehicleOfferRide.value
      })
    }).then(response => {

      if (!response.ok) {
        return response.json().then(errorData => {
          console.log(errorData.message)
          throw new Error(errorData.message || 'Something went wrong');
        });
      }
      return response.json();
    })
      .then(data => {
        fromFindRideValue.value = "";
        toFindRideValue.value = "";
        dateInputOfferRide.value = "";
        timeInputOfferRide.value = "";
        fareOfferRide.value = "";
        seatsOfferRide.value = "";
        vehicleOfferRide.value = "";

        window.location.href = "/ride/created"
      })
      .catch((error) => {
        let errorspan = document.querySelector('div[role="alert"]');
        errorspan.classList.remove('hidden');
        document.querySelector('div[role="success"]').classList.add('hidden');
        errorspan.querySelector('span').innerHTML = error.message;

        errorspan.scrollIntoView({
          behavior: 'smooth', 
          block: 'center',
        });
      }).finally(() => {
        document.getElementById('OfferRideSubmitBtn').disabled = false;
      });
  } else {
    form.reportValidity();
  }
})





function showError(message) {
  const errorDiv = document.getElementById("readOnlyerror");
  errorDiv.textContent = message; 
  errorDiv.classList.remove("opacity-0", "pointer-events-none"); 
  errorDiv.classList.add("-translate-y-10", "opacity-100"); 

  setTimeout(() => {
    errorDiv.classList.remove("-translate-y-10", "opacity-100");
    errorDiv.classList.add("-translate-y-20", "opacity-0", "pointer-events-none");

    setTimeout(() => {
      errorDiv.classList.remove("-translate-y-20"); 
    }, 500);
  }, 2500);

}

document.getElementById("seatsOfferRide").addEventListener("click", () => {
  if (document.getElementById("seatsOfferRide").readOnly) {
    showError("Please select the vehicle first");
  }
});

document.getElementById("fareOfferRide").addEventListener("click", () => {
  if (document.getElementById("fareOfferRide").readOnly) {
    showError("Please select the vehicle first");
  }
});