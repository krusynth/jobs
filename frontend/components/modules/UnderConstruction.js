import React from 'react';

export default function UnderConstruction(props) {
  return (
    <div className={ props.children ? 'under-construction contained' : 'under-construction'}>
      <header className="under-construction-header">
        <div className="message">
          <span className="icon"></span>
          Under Construction
        </div>
      </header>
      <section {...props}>
        {props.children}
      </section>
    </div>
  );
}

export function wip() {
  alert('This element has not been implemented yet');
}
