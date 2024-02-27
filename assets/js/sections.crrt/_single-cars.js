import {getNumberDate, getDatesRange} from "../helpers.b/dates-helpers.js";
import {getMaxDaysFromString} from "../helpers.b/get-helpers.js";

window.addEventListener("DOMContentLoaded", (event) => {

  const productHero = document.querySelector('.product-hero');
  if (!productHero) return;

  function updateFlatpickrValue(input, flatpickrInput, index) {
      if (!flatpickrInput._flatpickr) {
        setTimeout(() => {
          updateFlatpickrValue(input, flatpickrInput, index)
        }, 300);
        return;
      }

      if (flatpickrInput._flatpickr.selectedDates[index]) {
        input.value = getNumberDate(flatpickrInput._flatpickr.selectedDates[index]);
      } else {
        input.value = '';
      }
  }

  function setTimepickerValues(bookForm) {
    if (!bookForm) return;

    const url = window.location.href;
    const decodedUrl = decodeURIComponent(url);
    const urlSearchParams = new URLSearchParams(decodedUrl.split('?')[1]);

    const flatpickr = bookForm.querySelector('.product-hero__calendar .input__field');


    bookForm.querySelector('[name="cancel_page"]').value = window.location.href;


    let dateStart = '';
    let timeStart = '';
    const searchStart = urlSearchParams.get('date_start');
    if (searchStart) {
      [dateStart, timeStart] = searchStart.split(' ');
      const inputDateStart = document.querySelector('.product-hero__calendar input[name="date_start"]');
      inputDateStart.value = dateStart

      updateFlatpickrValue(inputDateStart, flatpickr, 0)

      const inputTimeStart = document.querySelector('input[name="time_start"]');
      inputTimeStart.value = timeStart;
      inputTimeStart.updateHandler()
      changeTimepickerValue(inputTimeStart, timeStart);
    }

    let dateEnd = '';
    let timeEnd = '';
    const searchEnd = urlSearchParams.get('date_end');
    if (searchEnd) {
      [dateEnd, timeEnd] = searchEnd.split(' ');
      const inputDateEnd = document.querySelector('.product-hero__calendar input[name="date_end"]');
      inputDateEnd.value = dateEnd

      updateFlatpickrValue(inputDateEnd, flatpickr, 1);


      const inputTimeEnd = document.querySelector('input[name="time_end"]');
      inputTimeEnd.value = timeEnd;
      inputTimeEnd.updateHandler()
      changeTimepickerValue(inputTimeEnd, timeEnd);
    }

    function changeTimepickerValue(timepickerInput, timeValue) {
      if (!timepickerInput.inputmask) {
        setTimeout(() => {
          changeTimepickerValue(timepickerInput, timeValue)
        }, 100)
        return;
      }
      if (!timepickerInput.inputmask.isComplete) {
        setTimeout(() => {
          changeTimepickerValue(timepickerInput, timeValue)
        }, 100)
        return;
      }
      timepickerInput.inputmask._valueSet(timeValue);
    }

    const locationStart = urlSearchParams.get('location_start');
    if (locationStart) {
      const locationStartSelect = bookForm.querySelector('[name="location_start"]');
      if (!locationStartSelect) return;

      const select = locationStartSelect.closest('.select')
      const option = [...select.querySelectorAll('option')].find(option => {
        return option.value === locationStart
      });
      select.selectOption(option);
      select.querySelector('select').value = locationStart;
    }

    const flightNumber = urlSearchParams.get('flight_number');
    if (flightNumber) {
      const flightNumberInput = bookForm.querySelector('[name="flight_number"]');
      flightNumberInput.value = flightNumber;
    }
  }

  const DATE_EMPTY = 'NaN-NaN-NaN';
  const bookForm = document.querySelector('.product-hero__bookform')
  setTimepickerValues(bookForm)

  bookForm?.addEventListener('submit-success', (e) => {
    const result = JSON.parse(e.detail.result);

    window.location.href = result.paylink
  })

  updateOrderTotal(bookForm);



  async function fetchOrder(bookForm) {
    const formData = bookForm._formich.getFormData();

    if (formData.get('date_end') === '') return false;
    if (formData.get('date_end') === DATE_EMPTY) return false;

    if (bookForm.dataset.action) {
      formData.append('action', 'get_order_total');
    }

    let response = await fetch(bookForm.dataset.route, {
      method: "POST",
      body: formData,
    });

    let result = await response.text();

    return JSON.parse(result);
  }

  async function updateOrderTotal(bookForm) {
    bookForm.classList.add('product-hero__bookform--loading');
    const order = await fetchOrder(bookForm);
    if (!order) {
      bookForm.classList.remove('product-hero__bookform--loading');
      return false;
    }

    const options = document.querySelectorAll('.product-hero__bookform input[name="options"]');
    options.forEach(option => {
      option = option.closest('.checkbox');
      let pills = [...option.querySelectorAll('.checkbox__pill')];
      pills.forEach((pill, pillIndex) => {
        pill.classList.add('is-opaque');
        if (pillIndex === order.total.price_index) {
          pill.classList.remove('is-opaque');
        }
      })
    })

    const tariffs = document.querySelectorAll('.product-hero__bookform-tariff')
    tariffs.forEach((tariff, tariffIndex) => {
      tariff.classList.add('is-opaque');
      if (tariffIndex === order.total.price_index) {
        tariff.classList.remove('is-opaque');
      }
    })

    let totalMessageText = `<span class="text-bold">${order.total.price}${order.total.currency}</span>, ${order.total.full_days_text}`
    if (order.total.extra_hours_text) {
      totalMessageText += `, ${order.total.extra_hours_text}`;
    }
    const submitButton = document.querySelector('.product-hero__bookform-submit')
    submitButton.innerHTML = `${submitButton.dataset.textInitial } |&nbsp;${totalMessageText}`;
    submitButton.dataset.paylink = order.paylink;

    bookForm.classList.remove('product-hero__bookform--loading');
  }

  if (bookForm) {
    function hideValidityMessage() {
      const message = bookForm.querySelector('.product-hero__bookform-validity-message');
      message.classList.add('is-hidden')
    }
    function showValidityMessage() {
      const message = bookForm.querySelector('.product-hero__bookform-validity-message');
      message.classList.remove('is-hidden')
    }

    let inputsToCallTotalUpdate = [
      'date_end',
      'time_start',
      'time_end',
      'options'
    ];
    let inputsToCallValidate = bookForm.querySelectorAll('input[required]')
    inputsToCallValidate = [
      ...inputsToCallValidate,
      bookForm.querySelector('input[name="date_end"]'),
      bookForm.querySelector('input[name="time_start"]'),
      bookForm.querySelector('input[name="time_end"]'),
      ...bookForm.querySelectorAll('input[name="options"]'),
    ];
    inputsToCallValidate.forEach(input => {
      input.addEventListener('input', async (e) => {
        if (input.name === '') return;
        if (input.value === '') return;
        if (input.value === DATE_EMPTY) return;

        let isValid = bookForm._formich.checkValidity(false);

        if (inputsToCallTotalUpdate.includes(input.name)) {
          await updateOrderTotal(bookForm);
        }

        if (isValid) {
          bookForm._formich.enableSubmit(hideValidityMessage)
        } else {
          bookForm._formich.disableSubmit(showValidityMessage)
        }
      })

      input.addEventListener('change', async (e) => {
        // if (!inputsToCallTotalUpdate.includes(input.name)) return;
        // await updateOrderTotal(bookForm);
      })

    });
    bookForm._formich.disableSubmit();
  }
});
