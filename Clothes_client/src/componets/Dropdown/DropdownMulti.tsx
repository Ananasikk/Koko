import { Img } from '..';
import './Dropdown.css';

export const DropdownMulti = (props: { items: Img[], activeItems: string[], onChange: (item: Img) => void, open: boolean, onOpen: () => void }) => {

    return (
        <div className="dropdown">
            <div className={props.open ? 'dropdown__active active' : 'dropdown__active'} onClick={props.onOpen}>
                <span>{props.activeItems.join(', ')}</span>
            </div>
            {props.open && (
                <div className="dropdown__popup">
                    {props.items.map(item => (
                        <div key={item.id} className={props.activeItems.includes(item.name) ? 'dropdown__item active' : 'dropdown__item'} onClick={() => props.onChange(item)}>
                            {item.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
