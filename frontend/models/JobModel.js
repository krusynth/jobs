import Model from './Model';

export default class JobModel extends Model {
  url = 'job';

  read(id) {
    return Model.prototype.read.call(this, id)
    .then(data => {
      return this.getApplied(data);
    });
  }

  list(options) {
    return Model.prototype.list.call(this, options)
    .then(data => {
      return data.map( this.getApplied );
    });
  }

  getApplied(job) {
    job.applied = job.JobEvents.reduce((result, value) => {
      if(value.type === 'Applied') {
        return true;
      }
      return result;
    }, false);
    return job;
  }
}
