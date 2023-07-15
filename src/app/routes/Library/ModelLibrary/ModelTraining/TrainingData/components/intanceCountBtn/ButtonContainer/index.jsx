import classes from './ButtonContainer.module.scss';

const ButtonContainer = ({ children }) => {
  return <div className={classes.container}>{children}</div>;
};

export default ButtonContainer;
