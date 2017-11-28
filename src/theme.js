import { createMuiTheme, colors } from 'material-ui'
import createPalette from 'material-ui/styles/createPalette'
import createTypography from 'material-ui/styles/createTypography'

const palette = createPalette({
  primary: colors.indigo
})

export default createMuiTheme({
  palette,
  typography: createTypography(palette, {
    fontFamily: 'Fira Sans, sans-serif',
    fontSize: 14
  }),
  overrides: {
    MuiInput: {
      underline: {
        '&:before': {
          display: 'none'
        }
      }
    },
  },
})