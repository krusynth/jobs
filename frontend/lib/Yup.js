import * as Yup from 'yup';

Yup.addMethod(Yup.mixed, 'equalTo', function(ref, message) {
    const msg = message || '${path} should match ${ref.path}';
    return this.test('equalTo', msg, function (value) {
      let refValue = this.resolve(ref);
      return value === refValue;
    })
})

export default Yup;
