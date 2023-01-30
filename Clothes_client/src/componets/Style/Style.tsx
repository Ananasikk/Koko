
import { useState, useCallback } from 'react';
import { DropdownMulti } from '../Dropdown/DropdownMulti';
import './Style.css';

export interface Img {
    id: number,
    name: TType
}

interface DataResponse {
    type: string;
    style: string;
}

interface ICard {
    link: string;
    path: string;
    price: number;
}

type TGender = 'Мужчинам' | 'Женщинам' | 'Мальчикам' | 'Девочкам'
type TType = 'Футболка/топ' | 'Штаны' | 'Пуловер' | 'Платье' | 'Верхняя одежда' | 'Босоножки' | 'Рубашка' | 'Кроссовки' | 'Сумка' | 'Ботинки'

const defaultCards = null;
const defaultDropdown: Img[] = []

const messages = {
    empty: 'К сожалению ничего не найдено',
    cardsTitle: 'Вам подойдет: '
}

export const Style = () => {

    const [types, setTypes] = useState<Img[] | undefined>(undefined);

    const [activeType, setActiveType] = useState<null | TGender>(null);
  const getTypes = async () => {
    return await fetch('http://localhost:8080/upload', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
  }

  const [img, setImg] = useState<string>();
  const [fileName, setFileName] = useState<string>('');

  const handleChangeImage = async (e: any) => {
    if (!activeType) throw new Error('Gender must be defined!')

    setActiveItems(defaultDropdown);
    setCards(defaultCards)

    const file = e.target.files[0];
    const loadName = file.name;
    const fileNameSize = 27;

    if (loadName.length > fileNameSize) {
      setFileName(loadName.substring(0, fileNameSize) + '...');
    } else {
      setFileName(loadName);
    }

    const reader = new FileReader();
    reader.onloadend = _ => {
        setImg(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // сброс value для срабатывания onChange на тот же файл

    const data: DataResponse = await uploadImage(file);
    setData(data);

    const types: Img[] = await getTypes()
    const filteredTypes = types.filter(x => filterType(x, activeType) && x.name !== data.type)
    setTypes(filteredTypes)

    setIsLoaded(false);
  }

  const [data, setData] = useState<DataResponse | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isCardsLoaded, setIsCardsLoaded] = useState(false);

  const uploadImage = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);

    setIsLoaded(true);
    return await fetch('http://localhost:8080/upload', {
        // mode: 'no-cors',
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
  }

  const [cards, setCards] = useState<ICard[] | null>(null); 
  const getCard = () => {
    if (!activeType) throw new Error('Gender must be defined!');

    setIsDropdownOpen(false)
    setIsCardsLoaded(true)

    const path = 'recomendation' // имя ручки на бэке, которая принимает данные
    const body = { 
        gender: mapGender(activeType), 
        style: data?.style, 
        type: data?.type, 
        userTypes: activeItems.map(x => x.id) 
    }

    fetch(`http://localhost:8080/${path}`, {
        // mode: 'no-cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    })
    .then(response => response.json())
    .then((data: ICard[]) => {
        setCards(data)
        setIsCardsLoaded(false)
    })
    .catch((e) => {
        console.log('status 400: ', e);
    })
  }

  const [openModal, setOpenModal] = useState(true);

  const [activeItems, setActiveItems] = useState<Img[]>([]);
  const handleChangeDropdownTypes = (item: Img) => {
    setActiveItems(prev => {
        if (prev.includes(item)) {
            return prev.filter(x => x.id !== item.id);
        } else {
            return prev.concat(item);
        }
    });
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const handleDropdownOpen = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, [setIsDropdownOpen])

    return (
        <>
        <div className="style">
            <div className="style__left">
                <div className="style__title">
                  Категория: {activeType}
                </div>
                <div className="style__file">
                    <div className="style__name">
                      {fileName}
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
                {isLoaded ? (
                    <div className='loader'>
                        <div className='loader__content' />
                    </div>
                ) : img && data && (
                <div className='style__block'>
                    <div className="style__answers">
                        <div className="styles__item">
                            <span>На изображении:</span>
                            <span>{data.type}</span>
                        </div>
                        <div className="styles__item">
                            <span>Стиль:</span>
                            <span>{data.style}</span>
                        </div>
                    </div>
                        <div className="style__dropdown">
                            <div className='style__container'>
                                <div className="style__title">
                                    Что вы хотите подобрать
                                </div>
                                {types && <DropdownMulti open={isDropdownOpen} onOpen={handleDropdownOpen} items={types} activeItems={activeItems.map(x => x.name)} onChange={handleChangeDropdownTypes} />}
                            </div>
                            <div onClick={getCard} className="button">Отправить</div>
                        </div>
                </div>
                )}
            </div>
            <div className="style__right">
              <img src={img} />
            </div>
            {openModal && <Modal setActiveType={setActiveType} setOpenModal={setOpenModal} />}
        </div>
        {data && <Cards isLoaded={isCardsLoaded} cards={cards} />}
        </>
    );
};

const Modal = (props: { setActiveType: (type: TGender) => void, setOpenModal: (value: boolean) => void; } ) => {
    const types: TGender[] = [
        'Мужчинам', 'Женщинам', 'Мальчикам', 'Девочкам'
    ];

    const handleClick = (type: TGender) => {
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

const Cards = ({ cards, isLoaded }: { cards: ICard[] | null, isLoaded: boolean }) => {
    if (cards === null) {
        return null;
    }

    if (isLoaded) {
        return (
            <div className='loader'>
                <div className='loader__content' />
            </div>
        )
    }

    if (cards.length === 0) {
        return <span>{messages.empty}</span>
    }

    return (
       <div className='cards'>
            <span className='cards__title'>{messages.cardsTitle}</span>
            <div className='cards__container'>
                {cards.map(x => <Card card={x} />)}
            </div>
       </div>
    )
}

const Card = ({ card }: { card: ICard }) => {
    return (
        <div className='card'>
            <img alt='Card' src={card.link} className='card__img' />
            <div className='card__container'>
                <span className='card__available'>В наличии</span>
                <span className='card__price'> {card.price} ₽ </span>
                <a target='_blank' rel="noreferrer" href={card.link} className='card__gotoshop'>Перейти в магазин</a>
            </div>
        </div>
    );
}

function mapGender(gender: TGender) {
    if (gender === 'Мужчинам') return 'Men';
    if (gender === 'Женщинам') return 'Women';
    if (gender === 'Мальчикам') return 'Boys';
    if (gender === 'Девочкам') return 'Girls';
}

// n
export function filterType(type: Img, gender: TGender): boolean {
    const notAvailable: Record<TGender, TType[]> = {
        'Мужчинам': ['Платье'],
        'Женщинам': [],
        'Мальчикам': ['Платье', 'Сумка'],
        'Девочкам': ['Пуловер', 'Верхняя одежда', 'Кроссовки']
    }
    if (notAvailable[gender].includes(type.name)) return false;

    return true;
}

/*
что недоступно
Мальчики:
    стили: классический, романтический
    в повседневном: платье, сумка
    в спортивном: Пуловер, Платье, Верхняя одежда, Босоножки, Рубашка, Сумка, Ботинки
Девочки:
    стили: классический, романтический
    в повседневном: 'Пуловер', 'Верхняя одежда', 'Кроссовки',
    в спортивном: 'Футболка/топ', 'Штаны', 'Пуловер', 'Платье', 'Верхняя одежда', 'Босоножки', 'Рубашка', 'Кроссовки', 'Ботинки'
Мужчины:
    в повседневном: 'Платье'
    в классическом: 'Пуловер', 'Платье', 'Кроссовки', 'Сумка'
    в романтическом: 'Футболка/топ', 'Штаны', 'Пуловер', 'Платье', 'Верхняя одежда', 'Босоножки', 'Кроссовки', 'Сумка', 'Ботинки'
    в спортивном: 'Платье', 'Рубашка'
Женщины:
    в классическом: 'Пуловер', 'Кроссовки'
    в романтическом: 'Штаны', 'Пуловер', 'Верхняя одежда', 'Босоножки', 'Рубашка', 'Кроссовки'
    в спортивном: 'Платье', 'Рубашка'
*/ 