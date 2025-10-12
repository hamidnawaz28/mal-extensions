import { Box } from '@mui/material'
import { useState } from 'react'
import { storeSignInInfo } from '../../../common/appUtils'
import { MACTRAC_API_BASE_URL } from '../../../common/const'
import { TextLarge } from '../../../common/Typography'
import { mactracDarkLogo, mactracLogo } from '../../../common/utils'
import { Backdrop } from '../../Components/Backdrop'
import { Button } from '../../Components/Button'
import { Input } from '../../Components/Input'

export const SignIn = ({ onSuccess, openSignIn, setOpenSignIn, darkMode }) => {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const sendCode = async () => {
    if (!email || !/@/.test(email)) {
      alert('Enter a valid email.')
      return
    }
    try {
      setLoading(true)
      const response = await fetch(`${MACTRAC_API_BASE_URL}auth/request-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!response.ok) throw new Error(`Send failed (${response.status})`)
      setStep(2)
    } catch (e) {
      console.error(e)
      alert('Could not send code. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async () => {
    if (!code) {
      alert('Enter the code from your email.')
      return
    }
    try {
      setLoading(true)
      const r = await fetch(`${MACTRAC_API_BASE_URL}auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      if (!r.ok) {
        const t = await r.text().catch(() => '')
        throw new Error(t || `Verify failed (${r.status})`)
      }
      const j = await r.json()
      await storeSignInInfo(j.token)
      onSuccess(j.token || '')
    } catch (e) {
      console.error(e)
      alert('Incorrect or expired code. Request a new one.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Backdrop open={openSignIn}>
      <Box
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'center',
          backgroundColor: theme.palette.background.paper,
          p: 3,
          borderRadius: 2,
        })}
      >
        <Box>
          <img
            src={darkMode ? mactracDarkLogo() : mactracLogo()}
            alt="MacTrac Logo"
            style={{
              width: '64px',
              height: '64px',
            }}
          />
        </Box>
        <TextLarge
          sx={(theme) => ({
            color: theme.palette.text.primary,
          })}
        >
          Welcome to MacTrac
        </TextLarge>

        <Input
          type="email"
          label={'Email'}
          placeholder="you@example.com"
          value={email}
          setValue={setEmail}
          disabled={loading || step == 2}
          sx={() => ({
            width: '100%',
          })}
        />

        {step === 1 && (
          <Box>
            <Button
              onClick={() => sendCode()}
              disabled={loading}
              label={loading ? 'Sending...' : 'Send Code'}
              style={{
                border: '1px solid grey',
              }}
            />
          </Box>
        )}

        {step === 2 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <Input
              type="text"
              label={'Enter Code'}
              placeholder="6-digit code"
              value={code}
              setValue={setCode}
              disabled={loading}
            />
            <Box>
              <Button
                onClick={() => verifyCode()}
                disabled={loading}
                label={loading ? 'Verifying...' : 'Verify'}
                style={{
                  border: '1px solid grey',
                }}
              />
            </Box>
          </Box>
        )}

        <Box>You’ll only do this once on this browser.</Box>
      </Box>
    </Backdrop>
  )
}
