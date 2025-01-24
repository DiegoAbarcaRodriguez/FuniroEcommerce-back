import { objectEnumNames } from "@prisma/client/runtime/library";
import { UUIDAdaptor } from "../../../config/plugin";

export class CreateFurnitureDto {
    constructor(
        public name: string,
        public description: string,
        public user_fk: string,
        public image: string,

        public sales_package: string,
        public model_number: string,

        public height: number,
        public width: number,
        public weight: number,

        public warranty_domestic: number,
        public warranty_general: number,

        public max_load: number,
        public origin: string,


        public discount?: number,
        public isNew?: boolean,
        public category?: string, //Todo Definir enum de categorias
        public price?: number,
        public stock?: number,
        public modify_at?: Date,

        public secondary_material?: string,
        public upholstery_material?: string,
        public upholstery_color?: string,

        public depth?: number,

        public filling_material?: string,
        public has_adjustable_headrest?: boolean,
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateFurnitureDto?] {
        if (!object.name) return ['name is missing'];
        if (!object.description) return ['description is missing'];
        if (!object.image) return ['image is missing'];
        if (!object.user_fk) return ['user_fk is missing'];
        if (!UUIDAdaptor.isValidUUID(object.user_fk)) return ['user_fk is not valid'];

        if (!object.sales_package) return ['sales_package is missing'];
        if (!object.model_number) return ['model_number is missing'];
        if (!object.height || object.height <= 0) return ['height is missing or not valid'];
        if (!object.width || object.width <= 0) return ['width is missing or not valid'];
        if (!object.weight || object.weight <= 0) return ['weight is missing or not valid'];
        if (!object.warranty_domestic || object.warranty_domestic <= 0) return ['warranty_domestic is missing or not valid'];
        if (!object.warranty_general || object.warranty_general <= 0) return ['warranty_general is missing or not valid'];
        if (!object.max_load || object.max_load <= 0) return ['max_load is missing or not valid'];
        if (!object.origin) return ['origin is missing'];

        if (object.price && object.price < 0) return ['price have to be positive'];
        if (object.stock && object.stock < 0) return ['stock have to be positive'];


        return [undefined, new CreateFurnitureDto(
            object.name,
            object.description,
            object.user_fk,
            object.image,
            object.sales_package,
            object.model_number,
            object.height,
            object.width,
            object.weight,
            object.warranty_domestic,
            object.warranty_general,
            object.max_load,
            object.origin,
            object.discount,
            object.isNew,
            object.category,
            object.price,
            object.stock,
            object.modify_at,
            object.secondary_material,
            object.upholstery_material,
            object.upholstery_color,
            object.depth,
            object.filling_material,
            object.has_adjustable_headrest
        )];
    }
}