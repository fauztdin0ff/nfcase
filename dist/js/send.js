/*==========================================================================
Input focus
============================================================================*/
function initFields() {

   function setFieldState(input) {
      const field = input.closest('.field');
      if (!field) return;

      if (input.value.trim() !== '') {
         field.classList.add('is-focus');
      }
   }

   document.addEventListener('focusin', (e) => {
      const input = e.target.closest('input, textarea');
      if (!input) return;

      const field = input.closest('.field');
      if (!field) return;

      field.classList.add('is-focus');
      field.classList.remove('warning');
      field.querySelector('.warning-image')?.remove();

      requestAnimationFrame(() => {
         setFieldState(input);
      });
   });

   document.addEventListener('focusout', (e) => {
      const input = e.target.closest('input, textarea');
      if (!input) return;

      const field = input.closest('.field');
      if (!field) return;

      if (input.value.trim() === '') {
         field.classList.remove('is-focus');
      }
   });

   document.addEventListener('input', (e) => {
      const input = e.target.closest('input, textarea');
      if (!input) return;

      setFieldState(input);
   });

   document
      .querySelectorAll('.field input, .field textarea')
      .forEach(setFieldState);
}


/*==========================================================================
Validate fields
============================================================================*/
function validateForm(form) {
   let isValid = true;
   const fields = form.querySelectorAll('.field.required');

   fields.forEach(field => {
      const input = getFieldInput(field);
      if (!input) return;

      let warningImage = field.querySelector('.warning-image');
      if (!input.value.trim()) {

         field.classList.add('warning');
         isValid = false;

         if (!warningImage) {
            warningImage = document.createElement('img');
            warningImage.src = 'img/warning-1.svg';
            warningImage.className = 'warning-image';
            warningImage.alt = '';
            field.appendChild(warningImage);
         }

      } else {
         field.classList.remove('warning');
         warningImage?.remove();
      }
   });

   return isValid;
}


function getFieldInput(field) {
   return [...field.querySelectorAll('input, textarea')]
      .find(input => getComputedStyle(input).display !== 'none');
}


/*==========================================================================
Отправка формы
============================================================================*/

async function sendForm(form) {
   const formData = new FormData(form);

   try {
      const response = await fetch(form.action || 'send.php', {
         method: 'POST',
         body: formData
      });

      if (!response.ok) {
         throw new Error(`Error ${response.status}. Не удалось отправить форму. Попробуйте ещё раз.`);
      }
      return true;
   } catch (error) {
      alert(error.message);
      return false;
   }
}


/*==========================================================================
Обработка отправки формы
============================================================================*/
function initForms() {

   document.addEventListener('submit', async (e) => {
      const form = e.target;
      if (!form.matches('form')) return;
      e.preventDefault();

      const submitButton = form.querySelector('[type="submit"]');
      const wrapper = form.closest('.form-wrapper');
      submitButton?.classList.add('disabled');

      if (!validateForm(form)) {
         submitButton?.classList.remove('disabled');
         return;
      }

      wrapper?.classList.add('sending');

      const timer = new Promise(resolve => {
         setTimeout(resolve, 1000);
      });

      const request = sendForm(form);
      const [, success] = await Promise.all([
         timer,
         request
      ]);

      wrapper?.classList.remove('sending');

      if (success) {

         const currentPopup = form.closest('.popup');

         form.reset();

         form.querySelectorAll('.field').forEach(field => {
            field.classList.remove('is-focus', 'warning');
            field.querySelector('.warning-image')?.remove();
         });

         if (currentPopup) {
            closePopup(currentPopup);
         }

         const thanksPopup = document.getElementById('thanks-popup');

         if (thanksPopup) {
            thanksPopup.classList.add('show');
            document.body.style.overflow = 'hidden';
         }

      }

      submitButton?.classList.remove('disabled');
   });
}



/*==========================================================================
initForms
============================================================================*/
document.addEventListener("DOMContentLoaded", () => {
   initFields();
   initForms();
})