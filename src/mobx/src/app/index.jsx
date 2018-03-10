import React, { PureComponent } from 'react';
import {
  inject,
  // action,
  observer,
} from 'mobx-react';
import PropTypes from 'prop-types';

const {
  number,
  object,
} = PropTypes;

@inject('store')
@observer
class App extends PureComponent {
  static propTypes = {
    inited: number,
    store: object,
  };

  static defaultProps = {
    inited: 0,
    store: {},
  };

  constructor(props) {
    super(props);
    this.counter = this.counter.bind(this);
  }

  componentDidMount() {
  }

  async getData() {
    const {
      inited,
    } = this.props;
    const result = await fetch('https://takeaway.dianping.com/waimai/ajax/wxwallet/getweixinjsconfig');
    console.log(inited, result);
  }

  counter() {
    const {
      store,
    } = this.props;
    store.color.push('green');
  }

  render() {
    const {
      inited,
      store,
    } = this.props;

    this.getData();

    if (inited) {
      return (
        <div>inted</div>
      );
    }

    return (
      <div>
        {
          store.color.map(color => (<div key="hello" onClick={this.counter} onKeyDown={() => {}} >{color}</div>))
        }
      </div>
    );
  }
}

export default App;
