/* eslint-disable jsx-a11y/alt-text */
import { useState } from 'react';
import { DropdownMulti } from '../Dropdown/DropdownMulti';
import { Products } from '../Products/Products';
import './Style.css';

export interface Img {
    name: string;
    path: string;
}

const images = [
    { name: 'пуловер', path: 'pullover' },
    { name: 'платье', path: 'dress' },
    { name: 'юбка', path: 'skirt' }
];

export const Style = () => {

  const [img, setImg] = useState<string>();
  const [nameImg, setNameImg] = useState<string>('');

  const handleChangeImage = (e: any) => {
    const file = e.target.files[0];
    const loadName = file.name;

    if (loadName.length > 20) {
      setNameImg(loadName.substring(0, 20) + '...');
    } else {
      setNameImg(loadName);
    }

    const reader = new FileReader();
    reader.onloadend = _ => {
        setImg(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // сброс value для срабатывания onChange на тот же файл
  }

  const [openModal, setOpenModal] = useState(true);
  const [activeType, setActiveType] = useState<null | string>(null);

  const [activePaths, setActivePaths] = useState<string[]>([]);
  const handleChangeDropdownTypes = (item: Img) => {
    setActivePaths(prev => {
        if (prev.includes(item.path)) {
            return prev.filter(x => x !== item.path);
        } else {
            return prev.concat(item.path);
        }
    });
  }

    return (
        <>
        <div className="style">
            <div className="style__left">
                <div className="style__title">
                  Категория: {activeType}
                </div>
                <div className="style__file">
                    <div className="style__name">
                      {nameImg}
                    </div>
                    <label className="button">
                        Открыть
                        <input
                            className="style__input"
                            type="file"
                            accept="image/*,image/jpeg,image/png"
                            onChange={(e) => handleChangeImage(e)} 
                        />
                    </label>
                </div>
                {img && (
                    <>
                    <div className="style__answers">
                        <div className="styles__item">
                            <span>На изображении:</span>
                            <span>Свитер</span>
                            <span>Сумка</span>
                        </div>
                        <div className="styles__item">
                            <span>Стиль:</span>
                            <span>Повседневный</span>
                        </div>
                    </div>
                        <div className="style__dropdown">
                        <div className="style__title">
                            Что вы хотите подобрать
                        </div>
                        <DropdownMulti items={images} onChange={handleChangeDropdownTypes} />
                    </div>
                    </>
                )}
            </div>
            <div className="style__right">
              <img src={img} />
            </div>
            {openModal && <Modal setActiveType={setActiveType} setOpenModal={setOpenModal} />}
        </div>
        {!!activePaths.length && <Products paths={activePaths} />}
        </>
    );
};

const Modal = (props: { setActiveType: (type: string) => void, setOpenModal: (value: boolean) => void; } ) => {
    const types = [
        'Мужчинам', 'Женщинам', 'Мальчикам', 'Девочкам'
    ];

    const handleClick = (type: string) => {
        props.setOpenModal(false);
        props.setActiveType(type);
    };

    return (
        <div className="modal">
            <div className="modal__content">
                <div className="modal__title">Выберите категорию</div>
                <div className="modal__types">
                    {types.map(x => (
                        <div key={x} className="modal__button" onClick={() => handleClick(x)}>
                            {x}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
