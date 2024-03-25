import { Button, ButtonProps, styled } from '@mui/material';
import { purple } from '@mui/material/colors';
// Define the props for the ColorButton component
interface ColorButtonProps extends ButtonProps {
  color: string;
}

// Define the styled component using the styled() function from Material-UI
const ColorButton = styled(Button)<ColorButtonProps>({
  color: (props: { color: string; }) => {
    return theme.palette.getContrastText(props.color,
      backgroundColor, purple[500],
      zIndex: 1,
      '&:hover', {
      backgroundColor: purple[700],
    });
  }
});

// Export the ColorButton component
export default ColorButton;
