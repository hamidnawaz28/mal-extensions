import DownloadIcon from '@mui/icons-material/Download'
import { Box, Button } from '@mui/material'
import { useState } from 'react'
import { asyncSleep, downloadImages, getDescriptionImages } from '../common/utils'

function ResponseContainer() {
  const [loading, setLoading] = useState(false)

  const downloadImagesHandle = async () => {
    setLoading(true)

    const specRef = document.querySelector('#nav-description')
    specRef?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    await asyncSleep(2000)
    const specButtonRef = document.querySelector('#nav-description button') as HTMLElement
    specButtonRef?.click()
    await asyncSleep(2000)
    const allImages = document.querySelectorAll(
      "[class^='main-image--wrap'] img",
    ) as NodeListOf<HTMLImageElement>
    const fileNameRef = document.querySelector("[data-pl='product-title']") as HTMLElement
    const fileName = fileNameRef?.innerText
      ?.trim()
      ?.replaceAll(' ', '-')
      // eslint-disable-next-line no-useless-escape
      ?.replace(/[\/\\:*?"<>|]/g, '')

    const allSrcs = Array.from(allImages)
      .map((el) => el.src)
      .filter((el) => el.includes('.jpg'))
      .map((el) => el.replace(/(\.jpg).*$/, '$1'))
    const descriptionImages = getDescriptionImages()
    await downloadImages([...allSrcs, ...descriptionImages], fileName)
    setLoading(false)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px', marginTop: '8px' }}>
      <Button
        size="small"
        variant="contained"
        endIcon={<DownloadIcon />}
        onClick={downloadImagesHandle}
        loading={loading}
        loadingIndicator="Downloading..."
        sx={{ backgroundColor: '#6dcbbd' }}
      >
        Download Images
      </Button>
    </Box>
  )
}

export default ResponseContainer
