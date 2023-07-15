import classes from './Image.module.scss';

const Image = ({ alt, ...props }) => {
  return (
    <img alt={alt} className={classes.image} {...props} draggable={false} />
  );
};

export default Image;
