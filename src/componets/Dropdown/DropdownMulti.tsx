import { useState } from 'react';
import { Img } from '..';
import './Dropdown.css';

export const DropdownMulti = (props: { items: Img[], onChange: (item: Img) => void }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [activeItems, setActiveItems] = useState<string[]>([]);

    const handleChangeItem = (item: Img) => {
        setActiveItems(prev => {
            if (prev.includes(item.name)) {
                return prev.filter(x => x !== item.name);
            } else {
                return prev.concat(item.name);
            }
        });
        props.onChange(item);
    }

    return (
        <div className="dropdown">
            <div className={open ? 'dropdown__active active' : 'dropdown__active'} onClick={() => setOpen(prev => !prev)}>
                <span>{activeItems.join(', ')}</span>
            </div>
            {open && (
                <div className="dropdown__popup">
                    {props.items.map(item => (
                        <div className={activeItems.includes(item.name) ? 'dropdown__item active' : 'dropdown__item'} onClick={() => handleChangeItem(item)}>
                            {item.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
