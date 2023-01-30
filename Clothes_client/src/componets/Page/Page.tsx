import React from 'react';
import { ReactNode, useCallback, useContext, useState } from 'react';
import { UserContext, User } from '../../hocs';
import { validMail, validPass, validPhone, withTestId } from '../../utils';
import './Page.css';

export const Page = (props: { title: string, children: ReactNode }) => {
    const [opened, setOpen] = useState(false);

    const userContext = useContext(UserContext);

    const close = useCallback(() => {
        setOpen(false);
    }, [setOpen])

    const exit = useCallback(() => {
        userContext?.setUser(null);
    }, [userContext])

    return (
        <>
        <div className="page">
            <div className="page__container">
                <div className="page__title">{props.title}</div>
                {userContext?.isLogged ? (
                    <div className='account'>
                        <span className='account__label'>{userContext.user?.name}</span>
                        <span className='account__exit' onClick={exit}>Выход</span>
                    </div>
                ) : (
                    <div className="page__register" onClick={() => setOpen(true)} {...withTestId('RegistrationLabel')}>Регистрация</div>
                )}
            </div>
            <div className="page__content">
                {props.children}
            </div>
        </div>
        {opened && (
            <Modal
                opened={opened}
                close={close}
                component={<Register close={close} />}
                testId={'RegistrationModal'}
            />
        )}
        </>
    );
};

const Modal = (props: { opened: boolean, close: () => void, component: ReactNode, testId: string } ) => {
    const { opened, close, testId } = props;

    return (
        <div className="modal" {...withTestId(testId)}>
            <div className="modal__content--register">
                <div onClick={close} className="modal__close">x</div>
                {props.component}
            </div>
        </div>
    );
}

interface FormError {
    nameError?: boolean;
    emailError?: boolean;
    phoneError?: boolean;
    pswError?: boolean;
    againError?: boolean;
}

const errorMessages = {
    email: 'Введите корректный email. Пример: ivanov@mail.ru',
    name: 'Имя пользователя не может быть пустым',
    psw: 'Пароль должен содержать не менее 8 символов',
    phone: 'Введите корректный телефон. Пример: +79990003288',
    againPsw: 'Пароли не совпадают'
}

const Register = (props: { close: () => void }) => {
    
    const [name, setName] = useState<string>('');
    const [psw, setPsw] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [againPsw, setAgainPsw] = useState<string>('');

    const [error, setError] = useState<FormError>({})

    const userContext = useContext(UserContext)

    const handleRegister = async () => {
        const error: FormError = {
            nameError: !name,
            emailError: !validMail(email),
            phoneError: !validPhone(phone),
            pswError: !validPass(psw),
            againError: psw !== againPsw
        }
        setError(error);

        if (error.nameError || error.emailError || error.phoneError || error.pswError || error.againError) {
            return
        }
        
        const body = {
            name, psw, email, phone
        }

        fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        })
        .then(response => response.json())
        .then((data: { status: number }) => {
            if (data.status === 200) {
                const user: User = {
                    name, phone, email
                }

                userContext?.setUser(user);
                console.log(user)
                setTimeout(() => {
                    props.close()
                }, 2000)
            } else {
                console.log('Registration failed!');
                props.close()
            }
        })
        .catch((e) => {
            console.log('status 400: ', e);
            props.close()
        })
    }

    return (
        <div className='wrapper'>
            {userContext?.isLogged ? (
                <span {...withTestId('RegistrationDone')}>Регистрация прошла успешно!</span>
            ) : (
                <>
                <div className='auth__title'>Регистрация: </div>
                <CustomInput 
                    title='Имя пользователя'
                    type='text'
                    value={name}
                    setValue={setName}
                    error={error.nameError}
                    errorText={errorMessages.name}
                    testId='NameInput'
                />
                <CustomInput 
                    title='Email'
                    type='text'
                    value={email}
                    setValue={setEmail}
                    error={error.emailError}
                    errorText={errorMessages.email}
                    testId='EmailInput'
                />
                <CustomInput 
                    title='Телефон'
                    type='text'
                    value={phone}
                    setValue={setPhone}
                    error={error.phoneError}
                    errorText={errorMessages.phone}
                    testId='PhoneInput'
                />
                <CustomInput 
                    title='Пароль'
                    type='password'
                    value={psw}
                    setValue={setPsw}
                    error={error.pswError}
                    errorText={errorMessages.psw}
                    testId='PswInput'
                />
                <CustomInput 
                    title='Подтверждение пароля'
                    type='password'
                    value={againPsw}
                    setValue={setAgainPsw}
                    error={error.againError}
                    errorText={errorMessages.againPsw}
                    testId='AgainPswInput'
                />
                <div onClick={handleRegister} className='auth__on' {...withTestId('RegistrationButton')}>Зарегистрироваться</div>
                </>
            )}
        </div>
    );
}

const CustomInput = (props: { title: string, type: string, value: string, setValue: (v: string) => void, error?: boolean, errorText: string, testId: string }) => {
    const { title, type, value, setValue, error, errorText, testId } = props;

    const handleChange = React.useCallback((e) => {
        setValue(e.target.value)
    }, [setValue])

    return (
        <div className='auth__container'>
            <span className='auth__label'>{title}: </span>
            <input style={{ border: error ? '1px solid red' : '' }} className='auth__input' type={type} value={value} onChange={handleChange} 
            {...withTestId(testId)} />
            {error && <span className='auth__error'>{errorText}</span>}
        </div>
    );
}
