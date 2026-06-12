import { useState } from 'react'
import { useUiStore } from '../state'
import { Button } from './Button'

const STEPS = [
  {
    title: 'Drag a colored face',
    body: 'Click and drag any sticker face to turn that layer. Release past the threshold to commit the move.',
  },
  {
    title: 'Rotate your view',
    body: 'Drag empty space around the cube to orbit the camera. Scroll or pinch to zoom in and out.',
  },
  {
    title: 'Keyboard shortcuts',
    body: 'Press R, L, U, D, F, or B for face turns. Hold Shift for prime moves. Press ? anytime for the full shortcut list.',
  },
]

export function OnboardingOverlay() {
  const onboardingComplete = useUiStore((state) => state.onboardingComplete)
  const completeOnboarding = useUiStore((state) => state.completeOnboarding)
  const [step, setStep] = useState(0)
  const [dontShowAgain, setDontShowAgain] = useState(true)

  if (onboardingComplete) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const handleNext = () => {
    if (isLast) {
      completeOnboarding(dontShowAgain)
      return
    }
    setStep((s) => s + 1)
  }

  const handleSkip = () => {
    completeOnboarding(dontShowAgain)
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 p-4 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="glass-panel w-full max-w-sm rounded-2xl p-6">
        <div className="mb-2 text-[0.75rem] text-text-muted">
          Step {step + 1} of {STEPS.length}
        </div>
        <h2 id="onboarding-title" className="mb-3 text-[1.15rem] font-semibold">
          {current.title}
        </h2>
        <p className="mb-5 text-[0.9rem] leading-relaxed text-text-muted">{current.body}</p>
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-[0.8rem] text-text-muted">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(event) => setDontShowAgain(event.target.checked)}
            />
            Don&apos;t show again
          </label>
          <div className="flex gap-2">
            <Button onClick={handleSkip}>Skip</Button>
            <Button variant="primary" onClick={handleNext}>
              {isLast ? 'Get started' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
