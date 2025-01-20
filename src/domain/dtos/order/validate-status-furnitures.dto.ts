export class ValidateStatusFurnituresDto {

    constructor(
        public furniture_id: string[],
        public quantity: string[]
    ) { }

    static create(object: { [key: string]: any }): [string?, ValidateStatusFurnituresDto?] {

        const { furniture_id, quantity } = object;

        if (!Array.isArray(furniture_id) || !furniture_id || furniture_id.length === 0) {
            return ['furniture_id is not valid'];
        }

        if (!Array.isArray(quantity) || !quantity || quantity.length === 0) {
            return ['quantity is not valid'];
        }

        if (furniture_id.length !== quantity.length) {
            return ['quantity and furniture_id are different in length'];
        }

        return [undefined, new ValidateStatusFurnituresDto(furniture_id, quantity)];

    }

}