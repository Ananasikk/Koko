import { useState } from 'react';
import './Dropdown.css';

export const Dropdown = (props: { items: string[] }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [activeItem, setActiveItem] = useState<string>('');

    const handleChangeItem = (item: string) => {
        setOpen(false);
        setActiveItem(item);
    }

    return (
        <div className="dropdown">
            <div className={open ? 'dropdown__active active' : 'dropdown__active'} onClick={() => setOpen(prev => !prev)}>
                <span>{activeItem}</span>
            </div>
            {open && (
                <div className="dropdown__popup">
                    {props.items.map(item => (
                        <div className={activeItem === item ? 'dropdown__item active' : 'dropdown__item'} onClick={() => handleChangeItem(item)}>
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
