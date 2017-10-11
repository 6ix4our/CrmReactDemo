import EntityReference from './EntityReference';
import { IEntitySchema } from './IEntitySchema';
import { Collection, EntityAttributes, SanitizeId, ValidateId, DataItem, EntityCollection } from './DataTypes';

class Entity {
    public Attributes: EntityAttributes = {};
    public FormattedAttributes: Collection<string> = {};
    public LookupLogicalNames: Collection<string> = {};

    public get Id() {
        return SanitizeId(this.Attributes[this.Schema.IdAttributeName] as string);
    }

    public set Id(value: string) {
        if (!ValidateId(value))
            throw new Error(`Invalid ID "${value}" for Entity.`);

        this.Attributes[this.Schema.IdAttributeName] = value;
    }

    public constructor(public Schema: IEntitySchema, id?: string) {
        if (id)
            this.Id = id;
    }

    public ToEntityReference() {
        return new EntityReference(this.Schema, this.Id);
    }

    public GetAttributeValue<T extends DataItem | EntityCollection>(attributeName: string)
    {
        return this.Attributes[attributeName] as T;
    }

    public toJSON() {
        let serializable: EntityAttributes = {};

        for (const attributeName of Object.keys(this.Attributes)) {
            let attribute = this.Attributes[attributeName];

            if (attribute instanceof EntityReference)
                serializable[`${attributeName}@odata.bind`] = `/${attribute.Schema.LogicalName}s(${attribute.Id})`;
            else
                serializable[attributeName] = attribute;
        }

        return serializable;
    }
}

export default Entity;