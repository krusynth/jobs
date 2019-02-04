import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import UserHome from './UserHome';

export default class Home extends Component {
  renderHome() {
    return (<div>
      <h1>Welcome to Jobs</h1>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et diam in erat congue aliquam. Nulla eu mollis quam, sed dictum sem. Donec justo augue, scelerisque ut nulla ut, sollicitudin aliquam quam. Sed vitae auctor augue, at cursus velit. Quisque dignissim nisi vitae urna scelerisque, eleifend ultricies justo dapibus. Mauris venenatis erat aliquam nisl eleifend, eu pharetra neque pellentesque. Pellentesque dolor tellus, eleifend sed nulla sollicitudin, commodo placerat tellus. Aliquam porttitor diam felis, eu facilisis urna faucibus at. Integer tincidunt, orci in vulputate pretium, ligula metus condimentum purus, sed egestas nisl mi at dui. Aenean vulputate dictum laoreet. Donec sed molestie massa. Ut mollis nisl nec erat tempus, nec posuere nunc laoreet. Nam aliquam orci vel ullamcorper pellentesque. Maecenas consequat hendrerit turpis, at consequat mi. Donec imperdiet libero turpis, vitae volutpat nibh ullamcorper quis.
      </p>
      <p className="button-group">
        <Link to="/signup/" className="btn btn-lg btn-primary">Sign Up!</Link>
        <Link to="/login/"  className="btn btn-lg btn-success">Login!</Link>
      </p>
      <p>
        Morbi nec tellus dictum, cursus dui id, tempor eros. Suspendisse aliquam elit sit amet diam vulputate aliquet. Vestibulum laoreet cursus pellentesque. Curabitur interdum feugiat rutrum. Cras nec porta nunc. Cras aliquet, purus vel tincidunt porttitor, lectus est sagittis nisl, in imperdiet libero elit non augue. Aliquam vestibulum posuere turpis id congue. Aliquam porttitor venenatis vulputate.
      </p>
      <p>
        Curabitur id vehicula metus. In sit amet ipsum at metus fringilla scelerisque sed a nibh. Suspendisse a nunc non libero pretium luctus. Sed mollis scelerisque dolor nec ornare. Vivamus vel nisl in orci bibendum euismod. Integer at sagittis dolor. Fusce sed vulputate diam, vitae fermentum ante. Donec urna elit, pulvinar quis arcu eu, pulvinar hendrerit dui. Nulla vitae fermentum purus, et aliquet quam. Nam eu enim lorem. Morbi tincidunt fermentum arcu, porta posuere tellus condimentum sed. Vestibulum ut bibendum orci, et facilisis lorem. Sed in mauris cursus ex bibendum congue nec at eros.
      </p>
      <p>
        Aenean interdum mauris nec dolor lobortis, a venenatis enim mollis. Curabitur ut massa faucibus, euismod diam quis, ullamcorper arcu. Curabitur sed semper erat. Mauris non massa viverra, ullamcorper metus in, elementum dui. Phasellus vulputate arcu ut dui cursus, vitae malesuada diam dictum. Mauris vitae nulla luctus, fringilla massa vel, hendrerit tellus. Vestibulum in convallis eros. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
      </p>
      <p>
        Pellentesque eget lacus dui. Pellentesque eu diam et mauris vestibulum hendrerit at vel erat. Proin nec consectetur nunc, in facilisis elit. Vestibulum in turpis sit amet nisi fermentum finibus. Vestibulum laoreet, massa nec pulvinar vehicula, quam felis hendrerit urna, sit amet vulputate metus odio et ligula. Duis suscipit diam eget tellus vulputate, ut fringilla neque pulvinar. Vestibulum vehicula lorem vitae dolor tempor euismod. Nullam sit amet tortor vestibulum metus pretium sagittis. Maecenas nec odio at eros pulvinar elementum nec ac diam. Donec sollicitudin vel est nec facilisis. Fusce nibh metus, lacinia consectetur fermentum ac, vestibulum non ipsum. Nulla facilisi.
      </p>
    </div>);
  }

  render() {
    if(this.props.user && this.props.user.userLevelId) {
      return (
        <UserHome user={this.props.user} />
      );
    }
    else {
      return this.renderHome();
    }
  }
}
