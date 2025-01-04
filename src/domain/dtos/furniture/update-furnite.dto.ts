import { objectEnumNames } from "@prisma/client/runtime/library";
import { UUIDAdaptor } from "../../../config/plugin";

export class UpdateFurnitureDto {
    constructor(
        public name?: string,
        public description?: string,
        public user_fk?: string,
        public image?: string,


        public sales_package?: string,
        public model_number?: string,

        public height?: number,
        public width?: number,
        public weight?: number,

        public warranty_domestic?: number,
        public warranty_general?: number,

        public max_load?: number,
        public origin?: string,

        public discount?: number,
        public isNew?: boolean,
        public category?: string, //Todo Definir enum de categorias
        public price?: number,
        public stock?: number,
        public created_at?: Date,

        public secondary_material?: string,
        public upholstery_material?: string,
        public upholstery_color?: string,

        public depth?: number,

        public filling_material?: string,
        public has_adjustable_headrest?: boolean,

    ) {

    }

    get values() {
        const object: { [key: string]: any } = {};

        if (this.name) object.name = this.name;
        if (this.description) object.description = this.description;
        if (this.user_fk) object.user_fk = this.user_fk;


        if (this.sales_package) object.sales_package = this.sales_package;
        if (this.model_number) object.model_number = this.model_number;

        if (this.height) object.height = this.height;
        if (this.width) object.width = this.width;
        if (this.weight) object.weight = this.weight;

        if (this.warranty_domestic) object.warranty_domestic = this.warranty_domestic;
        if (this.warranty_general) object.warranty_general = this.warranty_general;

        if (this.max_load) object.max_load = this.max_load;
        if (this.origin) object.origin = this.origin;

        if (this.discount) object.discount = this.discount;
        if (this.isNew) object.isNew = this.isNew;
        if (this.category) object.category = this.category; //Todo Definir enum de categorias
        if (this.price) object.price = this.price;
        if (this.stock) object.stock = this.stock;

        if (this.secondary_material) object.secondary_material = this.secondary_material;
        if (this.upholstery_material) object.upholstery_material = this.upholstery_material;
        if (this.upholstery_color) object.upholstery_color = this.upholstery_color;

        if (this.depth) object.depth = this.depth;

        if (this.filling_material) object.filling_material = this.filling_material;
        if (this.has_adjustable_headrest) object.has_adjustable_headrest = this.has_adjustable_headrest;

        return object;
    }


    static create(object: { [key: string]: any }): [string?, UpdateFurnitureDto?] {

        if (object.user_fk && !UUIDAdaptor.isValidUUID(object.user_fk)) return ['user_fk is not valid'];


        return [undefined, new UpdateFurnitureDto(
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
            object.created_at,
            object.secondary_material,
            object.upholstery_material,
            object.upholstery_color,
            object.depth,
            object.filling_material,
            object.has_adjustable_headrest
        )];
    }
}