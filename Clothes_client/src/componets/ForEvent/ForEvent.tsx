import { Dropdown } from '../Dropdown/Dropdown';
import './ForEvent.css';

const events = [
    'для зимней прогулки',
    'для офиса (не строгий стиль)',
    'для офиса (строгий стиль)',
    'для дома',
    'светское мероприятие'
];

export const ForEvent = () => {

    return (
        <div className="forEvent">
            <div className="forEvent__content">
                <div className="forEvent__dropdown">
                  <Dropdown items={events} />
                </div>
            </div>
        </div>
    );
};
