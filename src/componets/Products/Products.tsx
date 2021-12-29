import './Products.css';

const shownItems = 1;

export const Products = (props: { paths: string[] }) => {

    const items = new Array(shownItems).fill(1);

    return (
        <div className="products">
            {items.map((_x, index) => {
                if (props.paths.length === 1) {
                    return (
                        <img src={`/images/${props.paths[0]}/${index+1}.jpeg`} alt="pict" />
                    );
                } else if (props.paths.length === 2) {
                    return (
                        <>
                        <img src={`/images/${props.paths[0]}/${index+1}.jpeg`} alt="pict" />
                        <img src={`/images/${props.paths[1]}/${index+1}.jpeg`} alt="pict" />
                        </>
                    );
                } else {
                    return (
                        <>
                        <img src={`/images/${props.paths[0]}/${index+1}.jpeg`} alt="pict" />
                        <img src={`/images/${props.paths[1]}/${index+1}.jpeg`} alt="pict" />
                        <img src={`/images/${props.paths[2]}/${index+1}.jpeg`} alt="pict" />
                        </>
                    );
                }
            })}
        </div>
    );
};
