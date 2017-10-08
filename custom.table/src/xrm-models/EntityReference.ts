import { IEntitySchema } from './IEntitySchema';
import { Collection, SanitizeId, ValidateId } from './DataTypes';

class EntityReference
{
    public get Id()
    {
        return SanitizeId( this[this.Schema.IdAttributeName] as string);
    }

    public set Id(value: string)
    {
        if (!ValidateId(value))
            throw new Error(`Invalid ID "${value}" for EntityReference.`);

        this[this.Schema.IdAttributeName] = value;
    }

    constructor(public Schema: IEntitySchema, id: string)
    {
        this.Id = id;
    }

    public toJSON()
    {
        let serializable: Collection<string> = {};

        serializable[this.Schema.IdAttributeName] = this.Id;
        serializable['@odata.type'] = `Microsoft.Dynamics.CRM.${this.Schema.LogicalName}`;

        return serializable;
    }
}

export default EntityReference;