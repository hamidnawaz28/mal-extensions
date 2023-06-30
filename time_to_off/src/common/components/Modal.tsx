import { Box } from '@mui/material'
const Modal = ({ children, setShow, show }: any) => {
  return (
    <div>
      {show ? (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 100,
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'rgba(0, 0, 0, 1)',
                borderRadius: '0px 12 0px 12',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={setShow}
            >
              <Box
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
              >
                <Icon />
              </Box>
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
            }}
          >
            <div
              style={{
                borderRadius: '12',
              }}
            >
              <div style={{ padding: '0px 32px 32px 32px' }}>{children}</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
const Icon = () => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.7377 1.5251C14.0866 1.17622 14.0866 0.610555 13.7377 0.261667C13.3888 -0.0872212 12.8232 -0.0872229 12.4743 0.261665L6.99991 5.73633L1.5255 0.261683C1.17663 -0.0872053 0.610997 -0.0872051 0.262124 0.261683C-0.0867482 0.610572 -0.0867499 1.17623 0.262123 1.52512L5.73653 6.99977L0.261654 12.4749C-0.0872183 12.8238 -0.0872181 13.3894 0.261655 13.7383C0.610527 14.0872 1.17616 14.0872 1.52503 13.7383L6.99991 8.2632L12.4748 13.7383C12.8237 14.0872 13.3893 14.0872 13.7382 13.7383C14.0871 13.3895 14.0871 12.8238 13.7382 12.4749L8.26329 6.99977L13.7377 1.5251Z"
        fill="white"
      />
    </svg>
  )
}
export default Modal
