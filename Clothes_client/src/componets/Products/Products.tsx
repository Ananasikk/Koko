import { Img } from '../Style';
import './Products.css';

const shownItems = 1; // количество отображаемых картинок

export const Products = (props: { items: Img[] }) => {

    const items = new Array(shownItems).fill(1);

    return (
        <div className="products">
            {props.items.map(item => {
                return <div key={item.id} className='products__block'>
                    {items.map((_x, index) => {
                        return <img key={item.id} src={`/images/${item.path}/${index+1}.jpeg`} alt="pict" />;
                    })}
                </div>
            })}
        </div>
    );
};
