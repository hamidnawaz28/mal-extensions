import DownloadIcon from '@mui/icons-material/Download'
import { Box, Button } from '@mui/material'
import { useState } from 'react'
import { asyncSleep, downloadImages, getDescriptionImages } from '../common/utils'

function ResponseContainer() {
  const [loading, setLoading] = useState(false)

  const downloadImagesHandle = async (includeDescriptionImages = false, includeVideos = false) => {
    setLoading(true)
    let descriptionImages = []
    const fileNameRef = document.querySelector("[data-pl='product-title']") as HTMLElement
    if (includeDescriptionImages) {
      const descriptionRef = document.querySelector("a[title='Description']") as HTMLElement
      descriptionRef.click()
      await asyncSleep(2000)
      descriptionImages = getDescriptionImages()
      fileNameRef?.scrollIntoView({
        behavior: 'smooth',
      })
    }
    const allImages = document.querySelectorAll(
      "[class^='main-image--wrap'] img",
    ) as NodeListOf<HTMLImageElement>
    const fileName = fileNameRef?.innerText
      ?.trim()
      ?.replaceAll(' ', '-')
      // eslint-disable-next-line no-useless-escape
      ?.replace(/[\/\\:*?"<>|]/g, '')

    const allSrcs = Array.from(allImages)
      .map((el) => el.src)
      .filter((el) => el.includes('.jpg'))
      .map((el) => el.replace(/(\.jpg).*$/, '$1'))
    let videoSources = []
    if (includeVideos) {
      videoSources = getVideosSources()
    }

    await downloadImages([...allSrcs, ...descriptionImages, ...videoSources], fileName)
    setLoading(false)
  }
  const getVideosSources = () => {
    const videoSourcesRef = Array.from(document.querySelectorAll('video source')) as any[]
    return videoSourcesRef.map((el) => el?.src)
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px', marginTop: '8px' }}>
      <Button
        size="small"
        variant="contained"
        endIcon={<DownloadIcon />}
        onClick={() => downloadImagesHandle(false, false)}
        loading={loading}
        loadingIndicator="Downloading..."
        sx={{ backgroundColor: '#6dcbbd', fontSize: '10px' }}
      >
        Download Images
      </Button>
      <Button
        size="small"
        variant="contained"
        endIcon={<DownloadIcon />}
        onClick={() => downloadImagesHandle(true, false)}
        loading={loading}
        loadingIndicator="Downloading..."
        sx={{ backgroundColor: '#6dcbbd', fontSize: '10px' }}
      >
        Download With Des. Images
      </Button>
      {getVideosSources().length > 0 && (
        <Button
          size="small"
          variant="contained"
          endIcon={<DownloadIcon />}
          onClick={() => downloadImagesHandle(true, true)}
          loading={loading}
          loadingIndicator="Downloading..."
          sx={{ backgroundColor: '#6dcbbd', fontSize: '10px' }}
        >
          All With Videos
        </Button>
      )}
    </Box>
  )
}

export default ResponseContainer
