import { customColumnSort } from 'app/routes/configuration/tabs/components/columns';

// eslint-disable-next-line import/prefer-default-export
export const userRolesColumns = [
  {
    name: 'Name',
    selector: 'display_name',
    sortable: true,
    sortFunction: (rowA, rowB) =>
      customColumnSort(rowA.display_name, rowB.display_name)
  },
  {
    name: 'Role',
    selector: row => (row.is_staff ? 'Admin' : 'Member'),
    sortable: true,
    sortFunction: (rowA, rowB) => customColumnSort(rowA.is_staff, rowB.is_staff)
  },
  {
    name: 'Email',
    selector: 'email',
    sortable: true,
    sortFunction: (rowA, rowB) => customColumnSort(rowA.email, rowB.email)
  }
];
