import { filterType } from "../Style";

describe('filterType', () => {
    const cases = [
        {
          input: { gender: 'Мужчинам', type: { name: 'Платье' } },
          expected: false
        },
        {
          input: { gender: 'Мужчинам', type: { name: 'Футболка/топ' } },
          expected: true
        },
        {
          input: { gender: 'Женщинам', type: { name: 'Платье' } },
          expected: true
        },
        {
          input: { gender: 'Мальчикам', type: { name: 'Сумка' } },
          expected: false
        },
        {
          input: { gender: 'Девочкам', type: { name: 'Пуловер' }},
          expected: false
        },
        {
          input: { gender: 'Мальчикам', type: { name: 'Кроссовки'}},
          expected: true
        }
      ]
    
    cases.forEach(({ input, expected }) => {
        test(`Значение для гендера ${input.gender} и типа ${input.type.name}`, () => {
            //@ts-ignore
            expect(filterType(input.type, input.gender)).toEqual(expected)
        })
    })
});