import type {
  DetailedHTMLProps,
  HTMLAttributes,
} from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string
        alt?: string

        ar?: boolean
        'ar-modes'?: string
        'ar-scale'?: string

        'camera-controls'?: boolean
        'auto-rotate'?: boolean

        'shadow-intensity'?: string
        exposure?: string

        'interaction-prompt'?: string
        'touch-action'?: string
      }
    }
  }
}