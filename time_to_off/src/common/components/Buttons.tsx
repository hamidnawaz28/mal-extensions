import { Add, Delete, Edit } from '@mui/icons-material'
import { Box ,IconButton,Button} from '@mui/material'
 
 

function AddIconButton({ onClick }: any) {
  return (
    <IconButton aria-label="delete" onClick={onClick} sx={{ width: 20, padding: 0, mt: 1, mb: 1 }}>
      <Add color="primary" fontSize={'small'} />
    </IconButton>
  )
}

function EditIconButton({ onClick }: any) {
  return (
    <IconButton aria-label="delete" onClick={onClick} sx={{ width: 20, padding: 0, mt: 1, mb: 1 }}>
      <Edit color="primary" fontSize={'small'} />
    </IconButton>
  )
}
function DeleteIconButton({ onClick }: any) {
  return (
    <IconButton aria-label="delete" onClick={onClick} sx={{ width: 20, padding: 0, mt: 1, mb: 1 }}>
      <Delete color="primary" fontSize={'small'} />
    </IconButton>
  )
}

function ActionButton({ label, onClick }: any) {
  return (
    <Box
      sx={{
        pt: 1,
        pb: 1,
      }}
    >
      <Button aria-label="delete" onClick={onClick} variant="contained" size="small">
        {label}
      </Button>
    </Box>
  )
}
export { AddIconButton, EditIconButton, DeleteIconButton, ActionButton }
