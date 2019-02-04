import React from 'react';
import DatePicker from 'react-datepicker';

export default function DatePick({name, value, onChange, onBlur}) {
  let setProps = {
    name: name,
    id: name,
    className: "form-control"
  };


  if(value) {
    setProps.selected = new Date(value);
  }

  if(onChange) {
    setProps.onChange = (value) => { onChange({target:{name:name, value:value}}) }
  }

  if(onBlur) {
    setProps.onBlur = (value) => onBlur({target:{name:name, value:value}})
  }

  return (<DatePicker { ...setProps } />)
}
