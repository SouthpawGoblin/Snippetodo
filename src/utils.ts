import { desktopCapturer, DesktopCapturerSource } from 'electron'

/**
 * capture entire screen, return a Promise of image's dataURI
 */
export function screenShot(): Promise<HTMLElement> {
  return new Promise(async (resolve, reject) => {
    let sources = await desktopCapturer.getSources({ types: ['screen'] }) as unknown
    for (const source of sources as DesktopCapturerSource[]) {
      if (source.name === 'Entire screen') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id,
                minWidth: 1280,
                maxWidth: 4000,
                minHeight: 720,
                maxHeight: 4000
              }
            }
          } as any)
          handleStream(stream)
        } catch (e) {
          reject(e)
        }
        return
      }
    }
    reject()
    
    function handleStream (stream: MediaStream) {
      // Create hidden video tag
      const video = document.createElement('video');
      video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
      // Event connected to stream
      video.onloadedmetadata = function () {
          // Set video ORIGINAL height (screenshot)
          video.style.height = video.videoHeight + 'px'; // videoHeight
          video.style.width = video.videoWidth + 'px'; // videoWidth

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
          // Draw video on canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Remove hidden video tag
          video.remove();
          try {
              // Destroy connect to stream
              stream.getTracks()[0].stop();
              resolve(canvas)
          } catch (e) {
            reject()
          }
      }
      video.src = URL.createObjectURL(stream);
      document.body.appendChild(video);
    }
  })
}