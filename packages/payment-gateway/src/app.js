/* Import statements */
import React from 'react';
import './assets/stylesheets/app.scss';
import { MemoryRouter } from 'react-router-dom';
import { 
  TransitionGroup,
  CSSTransition 
} from 'react-transition-group';
import Container from './components/container';
import SimpleModalLauncher from './components/modal-launcher';
import UserStore from './store/user';

/* App component */
class App extends React.Component {
  constructor() {
    super();

    let userStore = new UserStore(); 
  }

  render() {
    return (
      <div>
        <SimpleModalLauncher buttonLabel='click-here'>
          <MemoryRouter>
            <Container/>
          </MemoryRouter>
        </SimpleModalLauncher>
      </div>
      
    );
  }
};

export default App;

