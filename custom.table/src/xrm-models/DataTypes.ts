import Entity from './Entity';
import EntityReference from './EntityReference';

export type Collection<TValue> = {[index: string]: TValue};

export type EntityCollection = Array<Entity>;

export type EntityAttributes = Collection<DataItem | EntityCollection>;

export type DataItem = boolean | number | string | Date | EntityReference;

export function SanitizeId(id: string)
{
    let decoded = decodeURIComponent(id);

    return decoded && (decoded.match(/(\w)+\-*/g) || []).join('');
}

export function ValidateId(id: string)
{
    return /^{?[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}}?$/i.test(id);
}