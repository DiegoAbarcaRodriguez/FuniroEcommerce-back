export class SortByDto {

    private constructor(
        public sortBy: string
    ) { }

    static create(object: { [key: string]: any }): [string?, SortByDto?] {
        const { sortBy } = object;

        const validSortByOptions = ['', 'name', 'price', 'discount'];
        
        if (!validSortByOptions.includes(sortBy)) {
            return ['SortBy is not valid!'];
        }
        
        return [undefined, new SortByDto(sortBy)];
    }
}