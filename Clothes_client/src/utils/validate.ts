
export function validMail(mail: string): boolean {
    var re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    var valid = re.test(mail);
    return valid;
  }
  
  /*
  требования регулярки - почта должна содержать:
    Название почтового ящика (primer1) — один или много символов
    Знак собаки (@)
    Доменное имя почтового сервера (mail) — один или много символов
    Точка (.)
    Доменное имя первого уровня (ru) от двух до пяти букв
  */


export function validPass(pass: string): boolean {
    const minLength = 8;
    return pass.length >= minLength
}
    
    /*
    требования регулярки - пароль должен:
        иметь длину не менее 8 символов :)
    */
    

export function validPhone(phone: string): boolean {
    var re = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
    var valid = re.test(phone);
    return valid;
}

/*
требования регулярки - телефон должен:
    быть похожим на телефон :)
*/
        