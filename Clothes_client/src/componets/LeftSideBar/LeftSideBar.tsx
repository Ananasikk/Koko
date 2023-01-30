import './LeftSideBar.css';
import blouse from './icons/blouse.svg';
import { menu } from '../../App';

export const LeftSideBar = () => {

    return (
        <div className="leftSideBar">
            <div className="logo">
                {/* <img src="https://e7.pngegg.com/pngimages/64/380/png-clipart-nike-logo-fred-perry-clothing-male-nike-emblem-leaf.png" /> */}
            </div>
            <div className="menu">
                <a href="/" className="menu__title menu__link">Главная</a>
                {menu.map(x => 
                    <a key={x.path} href={x.path} className="menu__item">
                        <div className="menu__icon">
                          <img alt='Icon' src={blouse} />
                        </div>
                        <div className="menu__name">
                            {x.name}
                        </div>
                    </a>
                )}
            </div>
        </div>
    );
};
