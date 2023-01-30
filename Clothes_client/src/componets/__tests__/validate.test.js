import { validMail, validPhone, validPass } from "../../utils";

describe('validate', () => {
    test('Валидация email', () => {
        const cases = [
            { input: 'dsad', expected: false },
            { input: 'dsad@mail.ru', expected: true }
        ]

        cases.forEach(({ input, expected }) => {
            expect(validMail(input)).toEqual(expected)
        })
    })

    test('Валидация phone', () => {
        const cases = [
            { input: 'dsad', expected: false },
            { input: '7999999999', expected: true }
        ]

        cases.forEach(({ input, expected }) => {
            expect(validPhone(input)).toEqual(expected)
        })
    })

    test('Валидация password', () => {
        const cases = [
            { input: 'qwerty', expected: false },
            { input: 'qwerty123', expected: true }
        ]

        cases.forEach(({ input, expected }) => {
            expect(validPass(input)).toEqual(expected)
        })
    })
});