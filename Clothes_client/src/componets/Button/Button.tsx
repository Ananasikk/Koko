import './Button.css'

export const Button = (props: {title: string, path: string }) => {
    return(
        <a className="mainpage_button" href={props.path}>
            {props.title}
        </a>
    );   
};
