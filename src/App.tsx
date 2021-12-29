import { Route } from 'react-router-dom';
import './App.css';
import { ForEvent, Page, LeftSideBar, Style, Button } from './componets';

export const menu = [
  { name: 'Подходящая одежда', path: '/style', Component: Style },
  { name: 'Образ по случаю', path: '/forevent', Component: ForEvent },
];

function App() {

  return (
    <>
      <LeftSideBar />
      <div className="core">
        {menu.map(({ name, path, Component }) => (
          <Route key={path} exact path={path}>
            <Page title={name}>
              <Component />
            </Page>
          </Route>
        ))}
        <Route key='/' exact path='/'>
          <Page title='Выбери одежду для себя'>
            <div className='mainPage'>
              <div className='mainPage__content'> 
                  <p> <b>Сервис для подбора стильной одежды. </b> <br/>
                  Система подскажет, как подобрать подходящие предметы одежды к вашему образу, 
                  а также вы можете собрать стильный образ с нуля для определенного случая. </p>
                  <img src={'/images/673272.png'} alt="pict" />
              </div>
              <div className='mainPage__bottom'>
                  <Button title='Подобрать образ к вашей одежде' path='/style'></Button>
                  <Button title='Подобрать одежду для определенного случая' path='/forevent'></Button>
              </div>
            </div>
          </Page>
        </Route>
      </div>
    </>
  );
}

export default App;
