import { Link } from 'react-router-dom';
import classes from './ClickableTableCell.module.scss';
import clsx from 'clsx';

type ClickableTableCellProps = {
  value: string | number;
  wrapperClass?: string;
  link: string;
};

export const ClickableTableCell = ({
  value,
  wrapperClass,
  link
}: ClickableTableCellProps) => {
  if (!value) return value;
  return (
    <Link className={clsx(wrapperClass, classes.root)} to={link}>
      {value}
    </Link>
  );
};
