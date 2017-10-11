import { IEntitySchemaWithAttributes } from '../xrm-models/IEntitySchema';

const OpportunityAttributes = {
    Topic: 'name',
    Probability: 'closeprobability'
};

const OpportunitySchema: IEntitySchemaWithAttributes<typeof OpportunityAttributes> =
{
    LogicalName: 'opportunity',
    IdAttributeName: 'opportunityid',
    Attributes: OpportunityAttributes,
    EntityReferenceSchemas: {}
};

export default OpportunitySchema;
