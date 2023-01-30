export const withTestId = (testId: string): { 'data-testid': string } => {
    return {
        'data-testid': testId
    }
}