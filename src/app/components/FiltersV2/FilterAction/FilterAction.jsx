import clsx from 'clsx';

import Show from 'app/hoc/Show';

import CommonButton from 'app/components/ReviewButton';

import classes from './FilterAction.module.scss';

export const FilterAction = ({ theme, actionBtns }) => {
  return (
    <div className={classes.filterActions}>
      {actionBtns.map(
        (
          {
            show,
            text,
            onClick,
            size = 'sm',
            variant,
            icon = null,
            disabled = false
          },
          idx
        ) => {
          return (
            <Show when={show} key={idx}>
              <CommonButton
                text={text}
                onClick={onClick}
                size={size}
                variant={variant}
                icon={icon}
                disabled={disabled}
                wrapperClass={clsx(theme === 'dark' && classes.darkButton)}
              />
            </Show>
          );
        }
      )}
    </div>
  );
};
