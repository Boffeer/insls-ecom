import "../libs/inputmask.js";

function formatTime(hours, minutes) {
  let formattedHours = hours.toString();
  let formattedMinutes = minutes.toString();

  if (formattedHours.length < 2) {
    formattedHours = '0' + formattedHours;
  }

  if (formattedMinutes.length < 2) {
    formattedMinutes = '0' + formattedMinutes;
  }

  return formattedHours + ':' + formattedMinutes;
}

function updateSliderTime(timepicker, hours, minutes) {
  const handle = timepicker.querySelector('.timepicker__value');
  // handle.textContent = formatTime(hours, minutes);
  handle.value = formatTime(hours, minutes);
}

function calculateNearestStep(minutes, step) {
  const remainder = minutes % step;
  if (remainder < step / 2) {
    return minutes - remainder;
  } else {
    return minutes + (step - remainder);
  }
}

function calculateHandlePosition(minHours, minMinutes, maxHours, maxMinutes, currentHours, currentMinutes) {
  const totalMinutes = (maxHours - minHours) * 60 + (maxMinutes - minMinutes);
  const selectedMinutes = (currentHours - minHours) * 60 + (currentMinutes - minMinutes);
  return (selectedMinutes / totalMinutes) * 100;
}

function updateHandlePosition(slider, position) {
  const handle = slider.querySelector('.timepicker__drag');
  handle.style.left = Math.max(2, Math.min(position, 100)) + '%';
}

function getNearestToStep(number, step) {
  const remainder = number % step;
  if (remainder <= step / 2) {
    return number - remainder;
  } else {
    return number + (step - remainder);
  }
}

function addLayout(timepickerControl, minTime, maxTime) {
  const minTimeIndicator = document.createElement('span');
  minTimeIndicator.classList.add('js_created');
  minTimeIndicator.classList.add('timepicker__min');
  minTimeIndicator.innerText = minTime
  timepickerControl.appendChild(minTimeIndicator);

  const maxTimeIndicator = document.createElement('span');
  maxTimeIndicator.classList.add('js_created');
  maxTimeIndicator.classList.add('timepicker__max');
  maxTimeIndicator.innerText = maxTime
  timepickerControl.appendChild(maxTimeIndicator);

  const lines = document.createElement('span');
  lines.classList.add('js_created');
  lines.classList.add('timepicker__lines');
  timepickerControl.appendChild(lines);
  for (let i = 0; i < 5; i++) {
    const dash = document.createElement('span');
    dash.classList.add('js_created');
    dash.classList.add('timepicker__lines-dash');
    lines.append(dash);
  }
}

function initSlider(slider) {
  let dragging = false;

  const timepickerControl = slider.querySelector('.timepicker__control');
  const timepickerInput = slider.querySelector('.timepicker__value');

  const minTime = slider.getAttribute('data-min');
  const maxTime = slider.getAttribute('data-max');

  addLayout(timepickerControl, minTime, maxTime);

  const step = parseInt(slider.getAttribute('data-step')) || 15;

  const [minHours, minMinutes] = minTime.split(':').map(val => parseInt(val));
  const [maxHours, maxMinutes] = maxTime.split(':').map(val => parseInt(val));

  let currentHours =  minHours;
  let currentMinutes = minMinutes;

  let timepickerInputHours;
  let timepickerInputMinutes;
  if (timepickerInput.value.includes(':')) {
    [timepickerInputHours, timepickerInputMinutes] = timepickerInput.value.split(':').map(val => parseInt(val))
    timepickerInputMinutes = getNearestToStep(timepickerInputMinutes, step)

    if (timepickerInputHours > 23) {
      timepickerInputHours = 23
    }
    if (timepickerInputHours < 0) {
      timepickerInputHours = 0
    }

    currentHours = timepickerInputHours;
    currentMinutes = timepickerInputMinutes;
  }

  updateSliderTime(slider, currentHours, currentMinutes);
  updateHandlePosition(slider, calculateHandlePosition(minHours, minMinutes, maxHours, maxMinutes, currentHours, currentMinutes));

  function handleSliderMove(event) {
    if (!dragging) return;

    const sliderRect = timepickerControl.getBoundingClientRect();
    const position = (event.clientX - sliderRect.left) / sliderRect.width;

    const totalMinutes = (maxHours - minHours) * 60 + (maxMinutes - minMinutes);
    const selectedMinutes = Math.round(position * totalMinutes);

    const steppedMinutes = calculateNearestStep(selectedMinutes, step);

    currentHours = Math.floor((steppedMinutes / 60) % 24) + minHours;
    currentMinutes = steppedMinutes % 60 + minMinutes;

    if (currentHours < minHours) {
      currentHours = minHours;
      currentMinutes = minMinutes;
    }

    if (currentHours > maxHours || (currentHours === maxHours && currentMinutes > maxMinutes)) {
      currentHours = maxHours;
      currentMinutes = maxMinutes;
    }

    updateSliderTime(slider, currentHours, currentMinutes);
    updateHandlePosition(slider, calculateHandlePosition(minHours, minMinutes, maxHours, maxMinutes, currentHours, currentMinutes));
  }

  timepickerControl.addEventListener('mousedown', function(event) {
    dragging = true;
    handleSliderMove(event);
    document.addEventListener('mousemove', handleSliderMove);
  });

  timepickerControl.addEventListener('touchstart', function(event) {
    dragging = true;
    handleSliderMove(event.touches[0]);
    document.addEventListener('touchmove', function(event) {
      handleSliderMove(event.touches[0]);
    });
  });

  timepickerControl.addEventListener('mouseup', function() {
    if (dragging) {
      dragging = false;
      document.removeEventListener('mousemove', handleSliderMove);
      timepickerInput.dispatchEvent(new Event('input'));
    }
  });

  timepickerControl.addEventListener('touchend', function() {
    if (dragging) {
      dragging = false;
      document.removeEventListener('touchmove', handleSliderMove);
      timepickerInput.dispatchEvent(new Event('input'));
    }
  });
}

const timepickers = document.querySelectorAll('.timepicker');
timepickers.forEach(timepicker => {
  // console.log(timepicker)
  initSlider(timepicker);

  const timepickerValue = timepicker.querySelector('.timepicker__value');
  const maskOptions = {
    mask: '99:99',
    inputmode: 'numeric',
  };
  new Inputmask(maskOptions).mask(timepickerValue);

  function updateHandler() {
    let [currentHours, currentMinutes] = timepickerValue.value.split(':').map(val=> val)
    if (timepickerValue.value.includes('_')) return;
    const timepicker = timepickerValue.closest('.timepicker');

    const minTime = timepicker.getAttribute('data-min');
    const maxTime = timepicker.getAttribute('data-max');
    const [minHours, minMinutes] = minTime.split(':').map(val => parseInt(val));
    const [maxHours, maxMinutes] = maxTime.split(':').map(val => parseInt(val));
    const step = parseInt(timepicker.getAttribute('data-step')) || 15;

    updateHandlePosition(timepicker, calculateHandlePosition(minHours, minMinutes, maxHours, maxMinutes, currentHours, currentMinutes));
  }
  timepickerValue.updateHandler = updateHandler
  timepicker.updateHandler = updateHandler

  timepickerValue.addEventListener('input', (e) => {
    e.stopPropagation();
    // let value = e.target.value;
    let value = timepickerValue.value;

    let [currentHours, currentMinutes] = value.split(':').map(val=> val)
    if (value.includes('_')) return;

    const minTime = timepicker.getAttribute('data-min');
    const maxTime = timepicker.getAttribute('data-max');
    const [minHours, minMinutes] = minTime.split(':').map(val => parseInt(val));
    const [maxHours, maxMinutes] = maxTime.split(':').map(val => parseInt(val));
    const step = parseInt(timepicker.getAttribute('data-step')) || 15;

    updateHandlePosition(timepicker, calculateHandlePosition(minHours, minMinutes, maxHours, maxMinutes, currentHours, currentMinutes));
  })

});

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('timepicker__control')) return;

  document.querySelectorAll('.timepicker__control').forEach(control => {
    // новый ивент тачэнд
  })

})
