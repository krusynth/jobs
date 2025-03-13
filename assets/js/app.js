'use strict';

async function getUser() {
  return fetch('/api/user/current/')
    .then(response => response.json())
}

async function updateUser(user) {
  if(user.password.length == 0) {
    delete user.password;
  }

  return fetch('/api/user/current/', {
      'method': 'PUT',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify(user)
    })
}

async function createUser(user) {
  return fetch('/api/user/', {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify(user)
    })
}


async function getJob(jobId) {
  return fetch('/api/job/' + jobId)
    .then(response => response.json())
}

async function getEvent(eventId) {
  return fetch('/api/job/event/' + eventId)
    .then(response => response.json())
}

function toggleWatching(jobId) {
  return getJob(jobId).then(job => {
    job.watching = !job.watching;

    return fetch('/api/job/' +  jobId, {
      'method': 'PUT',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify(job)
    }).then(result => {
      return job.watching;
    })

  });
}

function formDataToObject(formData) {
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
  return object;
}

function shortenDate(value) {
  // This is a hack because toLocaleDateString misbehaves when defaulting to midnight.
  let date = new Date(value.substring(0, 10)+'T12:00:00');
  return date.getFullYear() + '-' +
    ("0" + (date.getMonth() + 1)).slice(-2) + '-' +
    ("0" + date.getDate()).slice(-2);
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

function handleErrors(form, errors) {
  if(errors) {
    let ul = document.createElement('ul');
    for(let i = 0; i < errors.length; i++) {
      let li = document.createElement('li');
      li.appendChild(document.createTextNode(errors[i]));
      ul.appendChild(li);
    }
    form.querySelector('#errors').innerHTML = '';
    form.querySelector('#errors').appendChild(ul);
  }
}

function validateUserForm(data) {
  let errors = [];

  if(!data.get('firstName') || data.get('firstName').length == 0) {
    errors.push('Please give your first name.');
  }
  else if(data.get('firstName').length > 100) {
    errors.push('Whoa, that\'s a long name. Do you have a shorter name?');
  }

  if(!data.get('lastName') || data.get('lastName').length == 0) {
    errors.push('Please give your last name.');
  }
  else if(data.get('lastName').length > 100) {
    errors.push('Whoa, that\'s a long name. Do you have a shorter name?');
  }

  if(!data.get('email') || data.get('email').length == 0) {
    errors.push('Please give us your email address.');
  }
  else if(data.get('email').length > 255) {
    errors.push('Whoa, that\'s a long email. Do you have a shorter address?');
  }

  if(data.get('password') && data.get('password').length > 0) {
    if(data.get('password').length < 8) {
      errors.push('Your password is too short.');
    }
    else if(data.get('password').length > 255) {
      errors.push('Your password is too long.');
    }
    else if(data.get('password') !== data.get('confirmPassword')) {
      errors.push('Your password and confirmation do not match.');
    }
  }

  return errors.length ? errors : false;
}

function validateCreateUserForm(data) {
  let errors = validateUserForm(data);

  if(!errors) {
    errors = [];
    if(!data.get('password') || data.get('password').length == 0) {
      errors.push('Please enter a password.');
    }
  }

  return errors.length ? errors : false;
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


  function showJobEvents(container, events) {
    if(events.length) {
      container.classList.remove('hidden');
      container.innerHTML = '';

      for(let j = 0; j < events.length; j++) {
        const event = events[j];

        const eventRow = document.getElementById('template-job-event').content.cloneNode(true);
        const li = eventRow.querySelector('li');

        li.classList.add('event-' + event.type.toLowerCase());
        li.dataset.id = event.id;
        eventRow.querySelector('.type').innerText = event.type;

        // This is a hack because toLocaleDateString misbehaves when defaulting to midnight.
        let date = event.date.substring(0, 10)+'T12:00:00';
        eventRow.querySelector('.datetime').innerText = new Date(date).toLocaleDateString(undefined, {month: "short", day: "numeric"})

        li.addEventListener('click', e => {
          e.preventDefault();
          let eventId = e.target.closest('li').dataset.id;

          getEvent(eventId).then(data => {
            showEventForm(data);
          });

        });

        container.append(eventRow);
      }
    }
    else {
      container.classList.add('hidden');
    }
  }

  function showEventForm(data) {
    let eventForm = document.getElementById('template-job-event-form').content.cloneNode(true);

    if(data.id) {
      eventForm.querySelector('.action-title').innerText = 'Update Milestone';
    }
    else {
      eventForm.querySelector('.action-title').innerText = 'Add a Milestone';
    }

    if(!data.jobId) {
      eventForm.querySelector('.delete-button').classList.add('hidden');
    }
    for(const key in data) {
      let value = data[key];
      let elm = eventForm.querySelector('[name=' + key+']');

      if(elm) {
        if(key == "date") {
          value = shortenDate(value);
        }
        elm.value = value;
      }
    }

    eventForm.querySelector('.delete-button').addEventListener('click', e => {
      const eventId = e.target.closest('form').querySelector('input[name="id"]').value;
      fetch('/api/job/event/' + eventId, {
        'method': 'DELETE'
      }).then(result => {

        let eventNode = document.querySelector('.job-event[data-id="' + eventId + '"]');
        let container = eventNode.parentElement;
        eventNode.remove();
        if(container.children.length == 0) {
          container.classList.add('hidden');
        }
        hideModal();
      });

    });

    eventForm.querySelector('[name=type]').addEventListener('change', e => {
      handleTypeChange(eventForm);
    });
    handleTypeChange(eventForm);

    eventForm.querySelector('.event-form').addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(e.target);

      let method = 'POST';
      let url = '/api/job/event/';
      if(formData.get('id')) {
        method = 'PUT';
        url = '/api/job/event/' + formData.get('id');
      }

      formData.set('jobId', parseInt(formData.get('jobId')));

      let data = formDataToObject(formData);
      data.jobId = parseInt(data.jobId);
      data.duration = parseInt(data.duration);

      if(!parseInt(data.id)) {
        delete data.id;
      }

      fetch(url, {
        'method': method,
        'headers': {
          'Content-Type': 'application/json'
        },
        'body':  JSON.stringify(data)
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        // TODO: error handling;

        getJob(data.jobId).then(job => {
          const container = document.querySelector(`.job-row[data-jobid='${data.jobId}']`);

          showJobEvents(container.querySelector('.job-events'), job.JobEvents);

          hideModal();
        });
      });

    });

    eventForm = showModal(eventForm);

    function handleTypeChange(form) {
      let typeValue = form.querySelector('[name=type]').value;
      let notes = form.querySelector('#notes');

      if(typeValue == 'Interview') {
        form.querySelector('.duration-row').classList.remove('hidden');
        if(notes.value == '') {
          notes.value = defaultNotes;
        }
      }
      else {
        form.querySelector('.duration-row').classList.add('hidden');
        if(notes.value == defaultNotes) {
          notes.value = '';
        }
      }
    }
  }

const defaultNotes = `Notes about this organization:

* What does this organization do?

* Why did I apply?

* Who am I interviewing with? What do they do?



Accomplishments I want to highlight about myself:



Questions I want to ask:

* What would success look like for someone in this role?

* Tell me about your organization's culture.

* Why did the previous person leave this role?

* What sort of continuing education opportunities do you offer?

* What other benefits do you offer?

* What are the next steps here? When will I hear back from you?

`;

window.addEventListener("load", e => {
  // Handle modal closer button.
  document.getElementById('modal-closer').addEventListener('click', e => {
    e.preventDefault();
    hideModal();
  });



  // Jobs list
  let jobsList = document.getElementById('jobs-list');
  if(jobsList) {
    fetch('/api/job/').then(response => {
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      response.json().then( data => {
        if(data.length) {
          for(let i = 0; i < data.length; i++) {
            const job = data[i];

            const row = document.getElementById('template-job-row').content.cloneNode(true);
            row.querySelector('article').dataset.jobid = job.id;

            const url = '/job/' + job.id

            const title = row.querySelector('a.job-title');
            title.href = url;
            title.innerText = `${job.name} at ${job.company}`;

            const eventButton = row.querySelector('.event-add-button');
            eventButton.addEventListener('click', e => {
              const jobId = e.target.closest('.job-row').dataset.jobid;

              showEventForm({jobId: jobId});
            });

            const watchButton = row.querySelector('.watch-button');
            if(job.watching) {
              watchButton.classList.add('active');
            }

            row.querySelector('.delete-button').addEventListener('click', e => {
              const jobId = e.target.closest('.job-row').dataset.jobid;

              fetch('/api/job/' + jobId, {
                'method': 'DELETE',
                'headers': {
                  'Content-Type': 'application/json'
                }
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Response status: ${response.status}`);
                }
                else {
                  e.target.parentElement.parentElement.remove();
                }
              });
            });

            watchButton.addEventListener('click', e => {
              const jobId = e.target.closest('.job-row').dataset.jobid;

              toggleWatching(jobId).then(watching => {
                let button = e.target.closest('.watch-button');
                if(watching) {
                  button.classList.add('active');
                }
                else {
                  button.classList.remove('active');
                }
              });
            });

            const eventContainer = row.querySelector('.job-events');
            showJobEvents(eventContainer, job.JobEvents)

            jobsList.append(row);
          }
        }
      });
    });
  }

  // New job
  if(document.querySelector('.jobs-list')) {
    document.getElementById('new-job-button').addEventListener('click', e => {
      let form = document.getElementById('template-job-form').content.cloneNode(true);

      form.querySelector('.job-create-form').addEventListener('submit', e => {
        return handleNewJobForm(e);
      });

      // Replace the document fragment with a reference to the actual created form.
      form = showModal(form);

      async function handleNewJobForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const errors = validateJobForm(formData);

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
              'body': JSON.stringify(formDataToObject(formData))
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

    // Get a copy of our events to populate the timeline.
    const jobId = form.querySelector('[type=hidden][name=id]').value;
    getJob(jobId).then(job => {
      showJobEvents(form.querySelector('.job-events'), job.JobEvents);
    });

    const eventButton = form.querySelector('.event-add-button');
    eventButton.addEventListener('click', e => {
      e.preventDefault();
      showEventForm({jobId: jobId});
    });


    form.addEventListener('submit', e => {
      return handleEditJobForm(e);
    });

    async function handleEditJobForm(e) {
      e.preventDefault();

      const formData = new FormData(form);
      const errors = validateJobForm(formData);

      if(errors) {
        handleErrors(form, errors);
      }
      else {
        try {
          if(formData.get('watching') == null) {
            formData.set('watching', 0)
          }

          const response = await fetch('/api/job/'+formData.get('id'), {
            'method': 'PUT',
            'headers': {
              'Content-Type': 'application/json'
            },
            'body': JSON.stringify(formDataToObject(formData))
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

  // Update account
  let accountUpdateForm = document.querySelector('.update-account .account-form');
  if(accountUpdateForm) {
    // populate form
    getUser().then(user => {
      for(const key in user) {
        let value = user[key];
        let elm = accountUpdateForm.querySelector('[name=' + key+']');

        if(elm) {
          elm.value = value;
        }
      }
    });

    accountUpdateForm.addEventListener('submit', e => {
      e.preventDefault();
      let formData = new FormData(e.target.closest('.account-form'));
      let errors = validateUserForm(formData);

      if(errors) {
        handleErrors(accountUpdateForm, errors);
      }
      else {
        updateUser(formDataToObject(formData))
          .then(response => response.json())
          .then(response => {
            // TODO: handle errors.
            window.location.href = '/';
          });
      }
    });
  }

  // Create account
  let accountCreateForm = document.querySelector('.create-account .account-form');
  if(accountCreateForm) {
    accountCreateForm.querySelector('.password-message').classList.add('hidden');

    accountCreateForm.addEventListener('submit', e => {
      e.preventDefault();
      let formData = new FormData(e.target.closest('.account-form'));
      let errors = validateCreateUserForm(formData);

      if(errors) {
        handleErrors(accountCreateForm, errors);
      }
      else {
        createUser(formDataToObject(formData))
          .then(result => {

            if(result.status == 201 || result.status == 200 || result.status == 301) {
              window.location.href = '/login/?message=Account%20created.';
            }
            // Handle errors
            else {
              result.json().then(errors => {
                handleErrors(accountCreateForm, Object.values(errors));
              });
            }
          });
      }
    });
  }

  let forgotPasswordForm = document.querySelector('.forgot-password-form');
  if(forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', e => {
      e.preventDefault();
      let formData = new FormData(e.target.closest('.forgot-password-form'));
      fetch('/forgotpassword/', {
        'method': 'post',
        'headers': {
          'Content-Type': 'application/json'
        },
        'body': JSON.stringify(formDataToObject(formData))
      })
      .then(result => {
        if(result.status == 201 || result.status == 200 || result.status == 301) {
          window.location.href = '/?message=Reset%20email%20sent.';
        }
        // Handle errors
        else {
          result.json().then(errors => {
            handleErrors(forgotPasswordForm, Object.values(errors));
          });
        }
      });

    });
  }

  let resetPasswordForm = document.querySelector('.reset-password-form');
  if(resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', e => {
      e.preventDefault();

      // Check errors;
      let formData = new FormData(e.target.closest('.reset-password-form'));

      let errors = [];
      if(formData.get('password') && formData.get('password').length > 0) {
        if(formData.get('password').length < 8) {
          errors.push('Your password is too short.');
        }
        else if(formData.get('password').length > 255) {
          errors.push('Your password is too long.');
        }
        else if(formData.get('password') !== formData.get('confirmPassword')) {
          errors.push('Your password and confirmation do not match.');
        }
      }

      if(errors.length) {
        handleErrors(resetPasswordForm, errors);
      }
      else {

        fetch('/resetpassword/' + formData.get('token'), {
          'method': 'post',
          'headers': {
            'Content-Type': 'application/json'
          },
          'body': JSON.stringify(formDataToObject(formData))
        })
        .then(result => {
          if(result.status == 201 || result.status == 200 || result.status == 301) {
            window.location.href = '/login/?message=Password%20changed.';
          }
          // Handle errors
          else {
            result.json().then(errors => {
              handleErrors(resetPasswordForm, Object.values(errors));
            });
          }
        });

      }
    });
  }
})