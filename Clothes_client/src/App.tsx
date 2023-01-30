import { Route } from 'react-router-dom';
import './App.css';
import { Page, LeftSideBar, Style, Button } from './componets';
import { withUser } from './hocs';

export const menu = [
  { name: 'Подходящая одежда', path: '/style', Component: Style }
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
                  Приложение подскажет, как подобрать подходящие предметы одежды к вашему образу. 
                  Просто загрузите фотографию одежды и выберите, что бы вы хотели подобрать. </p>
                  <img src={'/images/673272.png'} alt="pict" />
              </div>
              <div className='mainPage__bottom'>
                  <Button title='Подобрать образ к вашей одежде' path='/style'></Button>
              </div>
            </div>
          </Page>
        </Route>
      </div>
    </>
  );
}

export default withUser(App);
