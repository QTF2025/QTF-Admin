export interface ISearchFilter{
    fields: any[],
    onSubmit: (queryString: string) => void,
    clearSearch: () => void,
    showButtons: boolean,
    colVal?: any
}