export class CreateProductDto {
    constructor(
        public name: string,
        public description: string,
        public main_description: string,
        public short_description: string,
        public general_description_fk: number,
        public dimension_fk: number,
        public warranty_fk: number,
        public user_fk: string,
        public detail_description_fk: number,
        public discount?: number,
        public isNew?: boolean,
        public category?: string, //Todo Definir enum de categorias
        public price?: number,
        public stock?: number,
        public created_at?: Date
    ) { }
}