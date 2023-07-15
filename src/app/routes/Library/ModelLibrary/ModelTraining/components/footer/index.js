import {
  faChevronRight,
  faLongArrowAltLeft
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Button from 'app/components/ReviewButton';
import Show from 'app/hoc/Show';

const useStyles = makeStyles(theme => ({
  footer: {
    height: '65px',
    background: '#FFFFFF',
    borderTop: `1px solid ${theme.colors.grey[3]}`
  }
}));

const Footer = ({
  disabled,
  onClick,
  btnText,
  onBackBtnClick,
  backBtnText
}) => {
  const classes = useStyles();

  return (
    <Box
      className={classes.footer}
      px={2}
      display='flex'
      justifyContent='space-between'
      alignItems='center'
    >
      <Box>
        <Show when={backBtnText}>
          <Button
            text={backBtnText}
            icon={<FontAwesomeIcon icon={faLongArrowAltLeft} />}
            variant='tertiary'
            onClick={onBackBtnClick}
            size='l'
          />
        </Show>
      </Box>

      <Button
        disabled={disabled}
        onClick={onClick}
        text={btnText}
        icon={<FontAwesomeIcon icon={faChevronRight} />}
        size='l'
        wrapperClass='ml-auto'
      />
    </Box>
  );
};

export default Footer;
