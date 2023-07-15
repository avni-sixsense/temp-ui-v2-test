import Button from 'app/components/CommonButton';
import PropTypes from 'prop-types';
// import queryString from 'query-string'
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CardAction = props => {
  const navigate = useNavigate();
  const handleSubmit = () => {
    props.click(props.data.id);
    // const suffix = queryString.stringify({ packId: props.data.id }, { arrayFormat: 'comma' })
    // navigate(`${props.link}?${suffix}`)
    navigate(props.link);
  };
  return (
    <Button
      id={`purchased_scope_btn_${props.label.split(' ').join('_')}`}
      text={props.label}
      wrapperClass={props.classes.btn}
      onClick={handleSubmit}
      variant={props.variant}
    />
  );
};

export default CardAction;

CardAction.defaultValue = {
  variant: ''
};

CardAction.propTypes = {
  classes: PropTypes.any.isRequired,
  variant: PropTypes.string,
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  click: PropTypes.func.isRequired
};
