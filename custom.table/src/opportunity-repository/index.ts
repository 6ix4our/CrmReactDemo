import OpportunitySchema from './OpportunitySchema';
import Entity from '../xrm-models/Entity';
import { XrmClient, IServiceOptions, IRequestOptions, QueryBuilder } from '../xrm-client';

const CommonPath = `${OpportunitySchema.LogicalName.slice(0, -1)}ies`;

class OpportunityRepository
{
    private static _serviceOptions: IServiceOptions = {
        EndpointUrl: '/api/data/v8.2'
    };

    private static _client = new XrmClient(OpportunityRepository._serviceOptions);

    public static async GetTopTenByProbability()
    {
        console.group('OpportunityRepository.GetTopTenByProbability');

        let requestOptions: IRequestOptions = {
            Method: 'get',
            Query: new QueryBuilder(CommonPath)
                .AddParameter('select', [
                    OpportunitySchema.Attributes.Topic,
                    OpportunitySchema.Attributes.Probability
                ].join())
                .AddParameter('orderby', `${OpportunitySchema.Attributes.Probability} desc`)
                .AddParameter('top', '10')
        };

        console.info('Submitting request to client');
        return await OpportunityRepository._client.ExecuteForEntityCollection(OpportunitySchema, requestOptions)
            .then(result => {
                console.info(result);
                console.groupEnd();
                return result;
            });
    }

    public static async Update(opportunity: Entity)
    {
        console.group('OpportunityRepository.Update');

        let requestOptions: IRequestOptions = {
            Method: 'patch',
            Query: new QueryBuilder(`${CommonPath}(${opportunity.Id})`),
            Body: opportunity
        };

        console.info('Submitting request to client');
        return await OpportunityRepository._client.Execute(requestOptions)
            .then(result =>
            {
                console.info(result);
                console.groupEnd();
                return result;
            });
    }
}

export default OpportunityRepository;