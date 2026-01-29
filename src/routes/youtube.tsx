/// <reference types="@types/youtube" />
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/youtube')({
  component: YouTubeWidget,
})

type PlayerState = 'waiting' | 'loading' | 'ready' | 'error'

function YouTubeWidget() {
  const [state, setState] = useState<PlayerState>('waiting')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerInstanceRef = useRef<YT.Player | null>(null) // YT is a global namespace

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // Listen for messages from parent
    const handleMessage = (event: MessageEvent) => {
      const { type, videoId, position } = event.data

      switch (type) {
        case 'load':
          loadVideo(videoId)
          break
        case 'play':
          if (playerInstanceRef.current) {
            playerInstanceRef.current.playVideo()
          }
          break
        case 'pause':
          if (playerInstanceRef.current) {
            playerInstanceRef.current.pauseVideo()
          }
          break
        case 'seek':
          if (playerInstanceRef.current) {
            playerInstanceRef.current.seekTo(position, true)
          }
          break
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const loadVideo = (videoId: string) => {
    if (!videoId) {
      setErrorMessage('No video ID provided')
      setState('error')
      postMessage({ type: 'error', message: 'No video ID provided' })
      return
    }

    setState('loading')

    // Wait for YouTube API to be ready
    const checkYT = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkYT)
        createPlayer(videoId)
      }
    }, 100)

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkYT)
      if (state === 'loading') {
        setErrorMessage('YouTube API failed to load')
        setState('error')
        postMessage({
          type: 'error',
          message: 'YouTube API failed to load',
        })
      }
    }, 5000)
  }

  const createPlayer = (videoId: string) => {
    try {
      // Clear previous player if exists
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }

      if (!containerRef.current) {
        throw new Error('Container element not found')
      }

      // Create the iframe element manually
      const iframe = document.createElement('iframe')
      const origin = window.location.origin
      iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(origin)}`
      iframe.width = '100%'
      iframe.height = '100%'
      iframe.frameBorder = '0'
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      iframe.sandbox.add(
        'allow-same-origin',
        'allow-scripts',
        'allow-presentation'
      )

      iframeRef.current = iframe
      containerRef.current.appendChild(iframe)

      // Pass the iframe to the Player API
      playerInstanceRef.current = new window.YT.Player(iframe, {
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError,
        },
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create player'
      setErrorMessage(message)
      setState('error')
      postMessage({ type: 'error', message })
    }
  }

  const onPlayerReady = (event: YT.PlayerEvent) => {
    setState('ready')
    postMessage({ type: 'ready' })
    startTimeUpdate()
  }

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    const stateMap: Record<number, string> = {
      [-1]: 'UNSTARTED',
      [0]: 'ENDED',
      [1]: 'PLAYING',
      [2]: 'PAUSED',
      [3]: 'BUFFERING',
      [5]: 'CUED',
    }

    const stateName = stateMap[event.data] || 'UNKNOWN'
    postMessage({ type: 'stateChange', state: stateName })
  }

  const onPlayerError = (event: YT.OnErrorEvent) => {
    const errorMap: Record<number, string> = {
      2: 'Invalid video ID',
      5: 'HTML5 player error',
      100: 'Video not found',
      101: 'Video owner does not allow embedding',
      150: 'Same as 101',
    }

    const errorMsg = errorMap[event.data] || 'Unknown player error'
    setErrorMessage(errorMsg)
    setState('error')
    postMessage({ type: 'error', message: errorMsg })
  }

  const startTimeUpdate = () => {
    const interval = setInterval(() => {
      if (playerInstanceRef.current && state === 'ready') {
        try {
          const currentTime = playerInstanceRef.current.getCurrentTime()
          const duration = playerInstanceRef.current.getDuration()
          postMessage({
            type: 'timeUpdate',
            currentTime,
            duration,
          })
        } catch (error) {
          clearInterval(interval)
        }
      }
    }, 500)
  }

  const postMessage = (data: any) => {
    window.parent.postMessage(data, '*')
  }

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
      {state === 'waiting' && (
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">YouTube Player Widget</h2>
          <p className="text-gray-300">
            Waiting for load message from parent application...
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Expected message format:
            <br />
            <code className="bg-gray-900 px-2 py-1 rounded inline-block mt-2">
              {'{type: "load", videoId: "dQw4w9WgXcQ"}'}
            </code>
          </p>
        </div>
      )}

      {state === 'loading' && (
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Loading YouTube Player...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {state === 'error' && (
        <div className="text-center text-white max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            Player Error
          </h2>
          <p className="text-gray-300 mb-4">{errorMessage}</p>
          <p className="text-sm text-gray-500">
            Waiting for another load message from parent...
          </p>
        </div>
      )}

      <div
        ref={containerRef}
        className={`w-full h-full ${
          state === 'ready' ? 'block' : 'hidden'
        }`}
      />
    </div>
  )
}

// YT namespace is globally available from @types/youtube
