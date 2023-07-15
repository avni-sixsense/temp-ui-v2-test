import './styles/css/index.scss';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

import { createRoot } from 'react-dom/client';

import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
