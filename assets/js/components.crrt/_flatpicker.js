
/**
 * Calendars
 */
import flatpickr from "flatpickr";
import { Russian } from "flatpickr/dist/l10n/ru.js"
import { Portuguese } from "flatpickr/dist/l10n/pt.js"

import {getNumberDate} from "../helpers.b/dates-helpers.js";
// import { English } from "flatpickr/dist/l10n/en.js"
// import {getShortHumanDate} from "../utils/helpers.js"
// import {getTodayPlus} from "../utils/helpers.js"

const locales = {
  'ru': Russian,
  'pt': Portuguese,
}

window.addEventListener('DOMContentLoaded', (event) => {

  const rangepickers = document.querySelectorAll('.b_rangepicker');
  rangepickers.forEach((rangepicker) => {
    const input = rangepicker.querySelector('.input__field');
    if (!input) return

    let disabledDates = [];
    if (rangepicker.dataset.disabled) {
      disabledDates = JSON.parse(rangepicker.dataset.disabled).map(date => {
        const currentDate = new Date(date)
        return `${currentDate.getDate()} ${currentDate.getMonth()} ${currentDate.getFullYear()}`;
      });
    }
    rangepicker.removeAttribute('data-disabled');
    let hourGap = 2;
    if (rangepicker.dataset.hourGap) {
      hourGap = rangepicker.dataset.hourGap;
    }

    let config = {
      altInput: true,
      altFormat: "j F", // "число полный месяц"
      dateFormat: "d-m-Y", // "DD-MM-YYYY"
      // locale: Russian,
      time_24hr: true,
      disableMobile: "true",
      minDate: "today",
      mode: "range",
      disable: [
        function(date) {
          let currentDate = new Date(date);

          if (rangepicker.classList.contains('b_rangepicker--inline')) {
            const timepickerStart = document.querySelector('.timepicker input[name="time_start"]')
            const timepickerEnd = document.querySelector('.timepicker input[name="time_start"]')
            const [startHours, startMinutes] = timepickerStart.value.split(':');
            const [endHours, endMinutes] = timepickerEnd.value.split(':');
            currentDate.setHours(startHours);
            currentDate.setHours(endHours);
          }

          currentDate = `${currentDate.getDate()} ${currentDate.getMonth()} ${currentDate.getFullYear()}`;
          return disabledDates.includes(currentDate);
        }
      ],
      onChange: function(selectedDates, dateStr, instance) {
        const dateStart = rangepicker.querySelector('input[name="date_start"]')
        const dateEnd = rangepicker.querySelector('input[name="date_end"]')
        if (selectedDates[0]) {
          const evt = new Event("input", { bubbles: true, cancelable: false });
          dateStart.value = getNumberDate(selectedDates[0]);
          dateEnd.value = getNumberDate(selectedDates[1]);
          dateEnd.dispatchEvent(evt);
        }
        // console.log(dateStart.value)
        // console.log(dateEnd.value)
      },
    }
    if (rangepicker.classList.contains('b_rangepicker--inline')) {
      config['inline'] = true;
    }

    let currentLocale = rangepicker.dataset.lang;
    if (currentLocale && currentLocale != 'en') {
      config['locale'] = locales[currentLocale];
    }

    let defaultDate = rangepicker.dataset.defaultDate;
    if (defaultDate) {
      config['defaultDate'] = rangepicker.dataset.defaultDate.split(',');
    }


    const datepickerInstance = flatpickr(input, config);
  });

  const datepickers = document.querySelectorAll('.b_datepicker')
  datepickers.forEach(datepicker => {
    if (datepicker.closest('.b_rangepicker')) return;
    const input = datepicker.querySelector('.input__field');

    let config = {
      altInput: true,
      altFormat: "j F Y", // "число полный месяц"
      dateFormat: "d-m-Y", // "DD-MM-YYYY"
      // locale: Russian,
      time_24hr: true,
      disableMobile: "true",
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() - 19)),
    }

    let currentLocale = datepicker.dataset.lang;
    if (currentLocale && currentLocale != 'en') {
      config['locale'] = locales[currentLocale];
    }

    let defaultDate = datepicker.dataset.defaultDate;

    const datepickerInstance = flatpickr(input, config);
  })
});
