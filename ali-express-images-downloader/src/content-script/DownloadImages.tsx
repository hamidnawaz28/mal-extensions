import { Download } from '@mui/icons-material'
import { Box, Button, ButtonGroup } from '@mui/material'
import { useState } from 'react'
import { asyncSleep, downloadImages, getDescriptionImages } from '../common/utils'

function ResponseContainer() {
  const [loading, setLoading] = useState(false)

  const downloadImagesHandle = async (images: string[]) => {
    setLoading(true)
    const fileNameRef = document.querySelector("[data-pl='product-title']") as HTMLElement
    const fileName = fileNameRef?.innerText
      ?.trim()
      ?.replaceAll(' ', '-')
      // eslint-disable-next-line no-useless-escape
      ?.replace(/[\/\\:*?"<>|]/g, '')
    const uniqueImages = Array.from(new Set(images))
    await downloadImages(uniqueImages, fileName)
    setLoading(false)
  }
  const extractDescriptionImages = async (): Promise<string[]> => {
    const fileNameRef = document.querySelector("[data-pl='product-title']") as HTMLElement
    const descriptionRef = document.querySelector("a[title='Description']") as HTMLElement
    descriptionRef.click()
    await asyncSleep(2000)
    const descriptionImages = getDescriptionImages()
    fileNameRef?.parentElement?.scrollIntoView({
      behavior: 'smooth',
    })
    return descriptionImages ?? []
  }
  const extractVariantImages = async (): Promise<string[]> => {
    const mainImagesRef = document.querySelectorAll(
      "[class^='main-image--wrap'] img:not([class*='slider--videoIcon'])",
    ) as NodeListOf<HTMLImageElement>

    const allSrcs = Array.from(mainImagesRef)
      .map((el) => el.src)
      .filter((el) => !el.includes('ver=1'))
      .filter((el) => el.includes('.jpg'))
      .map((el) => el.replace(/(\.jpg).*$/, '$1'))

    return allSrcs ?? []
  }

  const extractMainImages = async (): Promise<string[]> => {
    const mainImagesRef = document.querySelectorAll(
      "[class^='main-image--wrap'] img:not([class*='slider--videoIcon'])",
    ) as NodeListOf<HTMLImageElement>

    const allSrcs = Array.from(mainImagesRef)
      .map((el) => el.src)
      .filter((el) => el.includes('ver=1'))
      .filter((el) => el.includes('.jpg'))
      .map((el) => el.replace(/(\.jpg).*$/, '$1'))

    return allSrcs ?? []
  }
  const extractVideos = (): string[] => {
    const videoSourcesRef = Array.from(
      document.querySelectorAll('video source'),
    ) as HTMLImageElement[]
    return videoSourcesRef.map((el) => el?.src) ?? []
  }
  const extractAllMedia = async (): Promise<string[]> => {
    return [
      ...(await extractMainImages()),
      ...(await extractVariantImages()),
      ...(await extractDescriptionImages()),
      ...extractVideos(),
    ]
  }

  const VideosButton = () => {
    return (
      <Button
        size="small"
        variant="contained"
        onClick={async () => downloadImagesHandle(extractVideos())}
        sx={{
          fontSize: '11px',
          textTransform: 'none',
          px: 1,
        }}
      >
        Videos
      </Button>
    )
  }

  const DownloadMediaButton = ({
    mediaExtractor,
    label,
  }: {
    mediaExtractor: () => Promise<string[] | string[]>
    label: string
  }) => {
    return (
      <Button
        size="small"
        variant="contained"
        onClick={async () => downloadImagesHandle(await mediaExtractor())}
        sx={{
          fontSize: '11px',
          textTransform: 'none',
        }}
      >
        {label}
      </Button>
    )
  }
  return (
    <Box
      sx={{
        py: 1,
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '14px',
            color: 'gray',
          }}
        >
          Downloading...
        </Box>
      ) : (
        <ButtonGroup variant="contained" size="small">
          <Download
            sx={{
              mx: 1,
              pt: '3px',
            }}
            color="primary"
          />
          <DownloadMediaButton mediaExtractor={extractMainImages} label="Main Images" />
          <DownloadMediaButton mediaExtractor={extractVariantImages} label="Variant Images" />
          <DownloadMediaButton
            mediaExtractor={extractDescriptionImages}
            label="Description Images"
          />
          {extractVideos().length > 0 && <VideosButton />}
          <DownloadMediaButton mediaExtractor={extractAllMedia} label="All" />
        </ButtonGroup>
      )}
    </Box>
  )
}

export default ResponseContainer
