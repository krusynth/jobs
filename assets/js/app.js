'use strict';

function formDataToJSON(formData) {
  let object = {};
  formData.forEach((value, key) => {
    if(!Reflect.has(object, key)){
      object[key] = value;
      return;
    }
    if(!Array.isArray(object[key])){
      object[key] = [object[key]];
    }
    object[key].push(value);
  });
  return JSON.stringify(object);
}

function showModal(content) {
  let modal = document.getElementById('modal');

  document.getElementById('modal-content').appendChild(content);
  modal.classList.remove('hidden');

  return document.getElementById('modal-content').children[0];
}

function hideModal() {
  let modal = document.getElementById('modal');

  document.getElementById('modal-content').innerHTML = '';
  modal.classList.add('hidden');
}

function validateJobForm(data) {
  let errors = [];

  if(!data.get('name') || data.get('name').length == 0) {
    errors.push('Please enter the position title.');
  }
  else if(data.get('name').length > 100) {
    errors.push('Whoa, that\'s a long position title. Is there a shorter title?');
  }

  if(!data.get('company') || data.get('company').length == 0) {
    errors.push('Please enter the company name.');
  }
  else if(data.get('company').length > 100) {
    errors.push('Whoa, that\'s a long company name. Is there a shorter company name?');
  }

  if(data.get('description') && data.get('description').length > 10000) {
    errors.push('The job description is a bit too long, please keep it under 10000 characters.');
  }

  if(data.get('contacts') && data.get('contacts').length > 10000) {
    errors.push('The list of contacts is a bit too long, please keep it under 2048 characters.');
  }

  if(data.get('url') && data.get('url').length > 255) {
    errors.push('Whoa, that\'s a long url. Is there a shorter url?');
  }

  return errors.length ? errors : false;
}

function handleErrors(form, errors) {
  if(errors) {
    let ul = document.createElement('ul');
    for(let i = 0; i < errors.length; i++) {
      ul.appendChild(
        document.createElement('li').appendChild(
          document.createTextNode(errors[i])
        )
      );
    }
    form.querySelector('#errors').innerHTML = '';
    form.querySelector('#errors').appendChild(ul);
  }
}

window.addEventListener("load", e => {
  // Handle modal closer button.
  document.getElementById('modal-closer').addEventListener('click', e => {
    e.preventDefault();
    hideModal();
  });

  // Jobs list

  let jobsList = document.getElementById('jobs-list-container');
  if(jobsList) {
    fetch('/api/job/').then(response => {
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      response.json().then( data => {
        if(data.length) {
          let ul = document.createElement('ul').classList.add('jobs-list');
          for(let i = 0; i < data.length; i++) {
            let job = data[i];


          }
        }
      });
    });
  }

  // New job
  if(document.getElementById('template-job-form')) {
    document.getElementById('new-job-button').addEventListener('click', e => {
      let form = document.getElementById('template-job-form').content.cloneNode(true);

      form.querySelector('.submit').addEventListener('click', e => {
        return handleNewJobForm(e);
      });

      // Replace the document fragment with a reference to the actual created form.
      form = showModal(form);

      async function handleNewJobForm(e) {
        const formData = new FormData(form);
        const errors = validateJobForm(formData);
        e.preventDefault();

        if(errors) {
          handleErrors(form, errors);
        }
        else {
          try {
            const response = await fetch('/api/job/', {
              'method': 'POST',
              'headers': {
                'Content-Type': 'application/json'
              },
              'body': formDataToJSON(formData)
            });
            if (!response.ok) {
              throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();

            // TODO: error handling;

            window.location.href = '/job/' + json.id;
          } catch (error) {
            handleErrors(form, ['Error from server: ' + error.message]);
          }
        }

        return false;
      }
    });
  }

  // Update job
  let jobEditForm = document.getElementById('job-edit-form');
  if(jobEditForm) {
    let form = jobEditForm;

    form.querySelector('.submit').addEventListener('click', e => {
      return handleEditJobForm(e);
    });

    async function handleEditJobForm(e) {
      const formData = new FormData(form);
      const errors = validateJobForm(formData);
      e.preventDefault();

      if(errors) {
        handleErrors(form, errors);
      }
      else {
        try {

          const response = await fetch('/api/job/'+formData.get('id'), {
            'method': 'PUT',
            'headers': {
              'Content-Type': 'application/json'
            },
            'body': formDataToJSON(formData)
          });
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }

          const json = await response.json();

          // TODO: error handling;

          window.location.href = '/';
        } catch (error) {
          handleErrors(form, ['Error from server: ' + error.message]);
        }
      }

      return false;
    }
  }

})