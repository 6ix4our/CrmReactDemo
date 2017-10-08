import { Collection } from './DataTypes';

export interface IEntitySchema
{
    LogicalName: string;
    IdAttributeName: string;
    EntityReferenceSchemas: Collection<IEntitySchema>;
}

export interface IEntitySchemaWithAttributes<TAttributes extends object> extends IEntitySchema
{
    Attributes: TAttributes;
}
