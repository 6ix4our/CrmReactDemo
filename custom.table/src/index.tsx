import './index.css';
import * as React from 'react';
import TableApp from './TableApp';
import { TableStore } from './table-store';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { LoadTable } from './table-actions';

render(
    <Provider store={TableStore}>
        <TableApp />
    </Provider>,
    document.getElementById('root') as HTMLElement
);

TableStore.dispatch(LoadTable());